import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  Conversation,
  ConversationService,
  EventService,
  I18nService,
  ItemService,
  TrackingService,
  UserService
} from 'shield';
import { ToastrService } from 'ngx-toastr';
import { ArchiveConversationComponent } from './modals/archive-conversation/archive-conversation.component';
import { ReportListingComponent } from './modals/report-listing/report-listing.component';
import { ReportUserComponent } from './modals/report-user/report-user.component';

@Component({
  selector: 'tsl-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  public currentConversation: Conversation;
  public conversationsLoaded: boolean;
  public conversationsTotal: number;
  public connectionError: boolean;

  constructor(private conversationService: ConversationService,
              private itemService: ItemService,
              private modalService: NgbModal,
              private toastr: ToastrService,
              private trackingService: TrackingService,
              private i18n: I18nService,
              public userService: UserService,
              private eventService: EventService) {
  }

  ngOnInit() {
    this.eventService.subscribe(EventService.CONNECTION_ERROR, () => {
      this.connectionError = true;
      this.conversationsLoaded = true;
    });
    this.eventService.subscribe(EventService.CONNECTION_RESTORED, () => {
      this.connectionError = false;
    });
  }

  public onCurrentConversationChange(conversation: Conversation) {
    if (this.currentConversation) {
      this.currentConversation.active = false;
    }
    this.currentConversation = conversation;
    if (this.currentConversation) {
      this.currentConversation.active = true;
      this.conversationService.sendRead(this.currentConversation);
      this.userService.syncStatus(this.currentConversation.user);
    }
  }

  public onLoaded(event: any) {
    this.conversationsLoaded = event.loaded;
    this.conversationsTotal = event.total;
  }

  public reportListingAction(): void {
    this.modalService.open(ReportListingComponent, {windowClass: 'report'}).result.then((result: any) => {
      this.itemService.reportListing(
        this.currentConversation.item.legacyId,
        result.message,
        result.reason,
        this.currentConversation.legacyId
      ).subscribe(() => {
        this.trackingService.track(TrackingService.PRODUCT_REPPORTED,
          {product_id: this.currentConversation.item.id, reason_id: result.reason});
        this.toastr.success(this.i18n.getTranslations('reportListingSuccess'));
      });
    }, () => {});
  }

  public reportUserAction(): void {
    this.modalService.open(ReportUserComponent).result.then((result: any) => {
      this.userService.reportUser(
        this.currentConversation.user.id,
        this.currentConversation.item.legacyId,
        result.message,
        result.reason,
        this.currentConversation.legacyId
      ).subscribe(() => {
        this.trackingService.track(TrackingService.USER_PROFILE_REPPORTED,
          {user_id: this.currentConversation.user.id, reason_id: result.reason});
        this.toastr.success(this.i18n.getTranslations('reportUserSuccess'));
      });
    }, () => {});
  }

  public archiveConversation(): void {
    this.modalService.open(ArchiveConversationComponent).result.then(() => {
      this.conversationService.archive(this.currentConversation.id).subscribe(() => {
        this.conversationService.stream();
        this.eventService.emit(EventService.CONVERSATION_ARCHIVED, this.currentConversation);
        this.toastr.success(this.i18n.getTranslations('archiveConversationSuccess'));
      });
    }, () => {});
  }

}
