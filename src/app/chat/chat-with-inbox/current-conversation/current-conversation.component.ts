import { Component, OnInit, Input, OnDestroy } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { InboxMessage, MessageType } from '../message';
import { InboxConversation } from '../inbox/inbox-conversation';
import { EventService } from '../../../core/event/event.service';
import { RealTimeService } from '../../../core/message/real-time.service';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { TrackingService } from '../../../core/tracking/tracking.service';
import { ReportUserComponent } from '../../modals/report-user';
import { UserService } from '../../../core/user/user.service';
import { I18nService } from '../../../core/i18n/i18n.service';
import { ReportListingComponent } from '../../modals/report-listing';
import { ItemService } from '../../../core/item/item.service';
import { BlockUserComponent } from '../../modals/block-user';
import { UnblockUserComponent } from '../../modals/unblock-user';
import { ConversationService } from '../../../core/inbox/conversation.service';
import { ArchiveInboxConversationComponent } from '../modals/archive-inbox-conversation';
import { UnarchiveInboxConversationComponent } from '../modals/unarchive-inbox-conversation';
import { TextMessageComponent } from '../message/text-message';
import { ThirdVoiceMessageComponent } from '../message/third-voice-message';
import { BlockUserService, BlockUserXmppService } from '../../../core/conversation/block-user';
import * as _ from 'lodash';

@Component({
  selector: 'tsl-current-conversation',
  templateUrl: './current-conversation.component.html',
  styleUrls: ['./current-conversation.component.scss']
})
export class CurrentConversationComponent implements OnInit, OnDestroy {

  @Input() currentConversation: InboxConversation;
  @Input() conversationsTotal: number;
  @Input() connectionError: boolean;

  constructor(private eventService: EventService,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private trackingService: TrackingService,
    private userService: UserService,
    private itemService: ItemService,
    private blockUserService: BlockUserService,
    private blockUserXmppService: BlockUserXmppService,
    private i18n: I18nService,
    private realTime: RealTimeService,
    private conversationService: ConversationService) {
  }

  private newMessageSubscription: Subscription;
  public isLoadingMoreMessages = false;

  public momentConfig: any = {
    lastDay: '[Yesterday]',
    sameDay: '[Today]',
    nextDay: 'dddd, D MMM',
    lastWeek: 'dddd, D MMM',
    nextWeek: 'dddd, D MMM',
    sameElse: 'dddd, D MMM'
  };

  get emptyInbox(): boolean {
    return this.conversationsTotal === 0;
  }

  ngOnInit() {
    this.newMessageSubscription = this.eventService.subscribe(EventService.MESSAGE_ADDED,
      (message: InboxMessage) => this.sendRead(message));

    this.eventService.subscribe(EventService.MORE_MESSAGES_LOADED,
      (conversation: InboxConversation) => {
        this.isLoadingMoreMessages = false;
        this.currentConversation = conversation;
      });

    this.eventService.subscribe(EventService.CURRENT_CONVERSATION_SET, (conversation: InboxConversation) => {
      if (conversation !== this.currentConversation) {
        this.currentConversation = conversation;
      }
    });
  }

  ngOnDestroy() {
    this.currentConversation = null;
    if (this.newMessageSubscription) {
      this.newMessageSubscription.unsubscribe();
    }
  }

  public showDate(currentMessage: InboxMessage, nextMessage: InboxMessage): boolean {
    return nextMessage ? new Date(currentMessage.date).toDateString() !== new Date(nextMessage.date).toDateString() : true;
  }

  public dateIsThisYear(date: Date) {
    return date.getFullYear() === new Date().getFullYear();
  }

  private sendRead(message: InboxMessage) {
    if (_.eq(this.currentConversation.id, message.thread) && !message.fromSelf) {
      Visibility.onVisible(() => {
        setTimeout(() => {
          this.realTime.sendRead(message.from, message.thread);
        }, 1000);
      });
    }
  }

  public reportUserAction(): void {
    this.modalService.open(ReportUserComponent, { windowClass: 'report' }).result.then((result: any) => {
      this.userService.reportUser(
        this.currentConversation.user.id,
        this.currentConversation.item.id,
        result.message,
        result.reason,
        this.currentConversation.id
      ).subscribe(() => {
        this.trackingService.track(TrackingService.USER_PROFILE_REPPORTED,
          { user_id: this.currentConversation.user.id, reason_id: result.reason });
        this.toastr.success(this.i18n.getTranslations('reportUserSuccess'));
      });
    });
  }

  public reportListingAction(): void {
    this.modalService.open(ReportListingComponent, { windowClass: 'report' }).result.then((result: any) => {
      this.itemService.reportListing(
        this.currentConversation.item.id,
        result.message,
        result.reason,
        this.currentConversation.id
      ).subscribe(() => {
        this.trackingService.track(TrackingService.PRODUCT_REPPORTED,
          { product_id: this.currentConversation.item.id, reason_id: result.reason });
        this.toastr.success(this.i18n.getTranslations('reportListingSuccess'));
      }, (error: any) => {
        if (error.status === 403) {
          this.toastr.success(this.i18n.getTranslations('reportListingSuccess'));
        } else {
          this.toastr.error(this.i18n.getTranslations('serverError') + ' ' + error.json().message);
        }
      });
    });
  }

  public blockUserAction() {
    this.modalService.open(BlockUserComponent).result.then(() => {
      this.blockUserService.blockUser(this.currentConversation.user.id).subscribe(() => {
        this.blockUserXmppService.blockUser(this.currentConversation.user).subscribe(() => {
          this.toastr.success(this.i18n.getTranslations('blockUserSuccess'));
        });
      }, () => {
      });
    });
  }

  public unblockUserAction() {
    this.modalService.open(UnblockUserComponent).result.then(() => {
      this.blockUserService.unblockUser(this.currentConversation.user.id).subscribe(() => {
        this.blockUserXmppService.unblockUser(this.currentConversation.user).subscribe(() => {
          this.toastr.success(this.i18n.getTranslations('unblockUserSuccess'));
        });
      }, () => {
      });
    });
  }

  public archiveConversation(): void {
    this.modalService.open(ArchiveInboxConversationComponent).result.then(() => {
      this.conversationService.archive(this.currentConversation).subscribe(() => {
        this.toastr.success(this.i18n.getTranslations('archiveConversationSuccess'));
      });
    });
  }

  public unarchiveConversation() {
    this.modalService.open(UnarchiveInboxConversationComponent).result.then(() => {
      this.conversationService.unarchive(this.currentConversation).subscribe(() => {
        this.toastr.success(this.i18n.getTranslations('unarchiveConversationSuccess'));
      });
    });
  }

  get itemIsMine(): boolean {
    return this.currentConversation.item.isMine;
  }

  get conversationChattable(): boolean {
    return !this.currentConversation.cannotChat;
  }

  get currentConversationisArchived(): boolean {
    return this.conversationService.isConversationArchived(this.currentConversation);
  }

  public hasMoreMessages(): boolean {
    return this.currentConversation.nextPageToken !== null && this.currentConversation.nextPageToken !== undefined;
  }

  public loadMoreMessages() {
    if (this.isLoadingMoreMessages) {
      return;
    }
    this.isLoadingMoreMessages = true;
    this.conversationService.loadMoreMessages(this.currentConversation.id);
  }

  public isTextMessage(messageType: MessageType): boolean {
    return _.includes(TextMessageComponent.ALLOW_MESSAGES_TYPES, messageType);
  }

  public isThirdVoiceMessage(messageType: MessageType): boolean {
    return _.includes(ThirdVoiceMessageComponent.ALLOW_MESSAGES_TYPES, messageType);
  }

  public scrollToLastMessage(): void {
    const lastMessage = document.querySelector('.message-body');
    if (lastMessage) {
      lastMessage.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
