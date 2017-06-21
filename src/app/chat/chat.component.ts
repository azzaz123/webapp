import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Conversation, UserService, EventService, ItemService, I18nService,
  BanReason, ConversationService, TrackingService } from 'shield';
import { ToastrService } from 'ngx-toastr';
import 'rxjs/add/operator/takeWhile';

@Component({
  selector: 'tsl-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {

  public currentConversation: Conversation;
  public conversationsLoaded: boolean;
  public conversationsTotal: number;
  public connectionError: boolean;
  public listingBanReasons: BanReason[];
  public userBanReasons: BanReason[];
  public selectedReportListingReason: number = null;
  public selectedReportUserReason: number = null;
  public reportListingReasonMessage: string;
  public reportUserReasonMessage: string;
  private modal: NgbModalRef;
  private active: boolean = true;

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
    this.itemService.getBanReasons().map(() => {

    });
    this.itemService.getBanReasons().takeWhile(() => {
      return this.active;
    }).subscribe((data) => {
      this.listingBanReasons = data;
    });
    this.userService.getBanReasons().takeWhile(() => {
      return this.active;
    }).subscribe((data) => {
      this.userBanReasons = data;
    });
  }

  ngOnDestroy() {
    this.active = false;
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

  public resetModals() {
    this.selectedReportUserReason = null;
    this.selectedReportListingReason = null;
    this.reportListingReasonMessage = null;
    this.reportUserReasonMessage = null;
  }

  public open(targetModal: string) {
    this.resetModals();
    this.modal = this.modalService.open(targetModal);
  }

  public selectReportListingReason(id: number): void {
    this.selectedReportListingReason = id;
  }

  public selectReportUserReason(id: number): void {
    this.selectedReportUserReason = id;
  }

  public reportListingAction(): void {
    this.itemService.reportListing(this.currentConversation.item.legacyId,
      this.reportListingReasonMessage,
      this.selectedReportListingReason,
      this.currentConversation.legacyId)
    .takeWhile(() => {
      return this.active;
    }).subscribe(() => {
      this.trackingService.track(TrackingService.PRODUCT_REPPORTED,
        {product_id: this.currentConversation.item.id, reason_id: this.selectedReportListingReason});
      this.modal.close();
      this.toastr.success(this.i18n.getTranslations('reportListingSuccess'));
    });
  }

  public reportUserAction(): void {
    this.userService.reportUser(this.currentConversation.user.id,
      this.currentConversation.item.legacyId,
      this.reportUserReasonMessage,
      this.selectedReportUserReason,
      this.currentConversation.legacyId)
    .takeWhile(() => {
      return this.active;
    }).subscribe(() => {
      this.trackingService.track(TrackingService.USER_PROFILE_REPPORTED,
        {user_id: this.currentConversation.user.id, reason_id: this.selectedReportUserReason});
      this.modal.close();
      this.toastr.success(this.i18n.getTranslations('reportUserSuccess'));
    });
  }

  public archiveConversation(): void {
    this.conversationService.archive(this.currentConversation.id).takeWhile(() => {
      return this.active;
    }).subscribe(() => {
      this.modal.close();
      this.eventService.emit(EventService.CONVERSATION_ARCHIVED, this.currentConversation);
      this.toastr.success(this.i18n.getTranslations('archiveConversationSuccess'));
    });
  }

}
