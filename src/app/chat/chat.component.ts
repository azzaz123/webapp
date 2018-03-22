import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ArchiveConversationComponent } from './modals/archive-conversation/archive-conversation.component';
import { ReportListingComponent } from './modals/report-listing/report-listing.component';
import { ReportUserComponent } from './modals/report-user/report-user.component';
import { BlockUserComponent } from './modals/block-user/block-user.component';
import { UnblockUserComponent } from './modals/unblock-user/unblock-user.component';
import { TrackingService } from '../core/tracking/tracking.service';
import { AdService } from '../core/ad/ad.service';
import { Conversation } from '../core/conversation/conversation';
import { ConversationService } from '../core/conversation/conversation.service';
import { ItemService } from '../core/item/item.service';
import { I18nService } from '../core/i18n/i18n.service';
import { UserService } from '../core/user/user.service';
import { EventService } from '../core/event/event.service';
import { XmppService } from '../core/xmpp/xmpp.service';
import { PersistencyService } from '../core/persistency/persistency.service';

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
  public firstLoad: boolean;
  public chatLoaded: boolean;
  public userWebSlug: string;

  constructor(private conversationService: ConversationService,
              private itemService: ItemService,
              private modalService: NgbModal,
              private toastr: ToastrService,
              private trackingService: TrackingService,
              private i18n: I18nService,
              public userService: UserService,
              private eventService: EventService,
              public xmppService: XmppService,
              private persistencyService: PersistencyService,
              private adService: AdService,
              @Inject('SUBDOMAIN') private subdomain: string) {
  }

  ngOnInit() {
    this.eventService.subscribe(EventService.CONNECTION_ERROR, () => {
      this.connectionError = true;
      this.conversationsLoaded = true;
    });
    this.eventService.subscribe(EventService.CONNECTION_RESTORED, () => {
      this.connectionError = false;
    });
    this.eventService.subscribe(EventService.USER_BLOCKED, (userId: string) => {
      this.userService.updateBlockStatus(userId, true);
    });
    this.eventService.subscribe(EventService.USER_UNBLOCKED, (userId: string) => {
      this.userService.updateBlockStatus(userId, false);
    });
    this.persistencyService.getMetaInformation().subscribe(() => {
    }, () => {
      this.firstLoad = true;
    });
  }

  ngOnDestroy () {
    this.adService.stopAdsRefresh();
  }

  public onCurrentConversationChange(conversation: Conversation) {
    if (this.currentConversation) {
      this.currentConversation.active = false;
    }
    this.currentConversation = conversation;

    if (this.currentConversation) {
      this.currentConversation.active = true;
      this.conversationService.sendRead(this.currentConversation);
      this.userWebSlug = this.currentConversation.user ? this.currentConversation.user.getUrl(this.subdomain) : null;
    }

    this.adService.startAdsRefresh();
  }

  public onLoaded(event: any) {
    this.chatLoaded ? this.conversationsLoaded = true : this.conversationsLoaded = event.loaded;
    this.conversationsTotal = event.total;
    this.chatLoaded = true;
  }

  public reportListingAction(): void {
    this.modalService.open(ReportListingComponent, {windowClass: 'report'}).result.then((result: any) => {
      this.itemService.reportListing(
        this.currentConversation.item.id,
        result.message,
        result.reason,
        this.currentConversation.legacyId
      ).subscribe(() => {
        this.trackingService.track(TrackingService.PRODUCT_REPPORTED,
          {product_id: this.currentConversation.item.id, reason_id: result.reason});
        this.toastr.success(this.i18n.getTranslations('reportListingSuccess'));
      }, (error: any) => {
        if (error.status === 403) {
          this.toastr.success(this.i18n.getTranslations('reportListingSuccess'));
        } else {
          this.toastr.error(this.i18n.getTranslations('serverError') + ' ' + error.json().message);
        }
      });
    }, () => {
    });
  }

  public reportUserAction(): void {
    this.modalService.open(ReportUserComponent, {windowClass: 'report'}).result.then((result: any) => {
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
    }, () => {
    });
  }

  public archiveConversation(): void {
    this.modalService.open(ArchiveConversationComponent).result.then(() => {
      this.conversationService.archive(this.currentConversation.id).subscribe(() => {
        this.conversationService.stream();
        this.eventService.emit(EventService.CONVERSATION_ARCHIVED, this.currentConversation);
        this.toastr.success(this.i18n.getTranslations('archiveConversationSuccess'));
      });
    }, () => {
    });
  }

  public blockUserAction() {
    this.modalService.open(BlockUserComponent).result.then(() => {
      this.xmppService.blockUser(this.currentConversation.user).subscribe(() => {
        this.toastr.success(this.i18n.getTranslations('blockUserSuccess'));
      });
    }, () => {
    });
  }

  public unblockUserAction() {
    this.modalService.open(UnblockUserComponent).result.then(() => {
      this.xmppService.unblockUser(this.currentConversation.user).subscribe(() => {
        this.toastr.success(this.i18n.getTranslations('unblockUserSuccess'));
      });
    }, () => {
    });
  }
}
