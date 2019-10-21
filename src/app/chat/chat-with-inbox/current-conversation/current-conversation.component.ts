import { Component, HostListener, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
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
import { InboxConversationService } from '../../../core/inbox/inbox-conversation.service';
import { ArchiveInboxConversationComponent } from '../modals/archive-inbox-conversation';
import { UnarchiveInboxConversationComponent } from '../modals/unarchive-inbox-conversation';
import { TextMessageComponent } from '../message/text-message';
import { ThirdVoiceMessageComponent } from '../message/third-voice-message';
import { BlockUserService, BlockUserXmppService } from '../../../core/conversation/block-user';
import * as _ from 'lodash';
import { InboxConversation, InboxMessage, MessageType } from '../../model';

@Component({
  selector: 'tsl-current-conversation',
  templateUrl: './current-conversation.component.html',
  styleUrls: ['./current-conversation.component.scss']
})
export class CurrentConversationComponent implements OnInit, OnChanges, OnDestroy {

  public readonly BOTTOM_BUFFER_ZONE = 100;
  private MESSAGE_HEIGHT = 42;

  @Input() currentConversation: InboxConversation;
  @Input() conversationsTotal: number;
  @Input() connectionError: boolean;
  @Input() loadingError: boolean;

  public momentConfig: any;

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
              private conversationService: InboxConversationService) {
    this.momentConfig = i18n.getTranslations('defaultDaysMomentConfig');
  }

  private newMessageSubscription: Subscription;
  public isLoadingMoreMessages = false;
  private lastInboxMessage: InboxMessage;
  private isEndOfConversation = true;
  public scrollHeight = 0;
  public scrollLocalPosition = 0;
  public noMessages = 0;
  public textareaHeight = 0;

  get emptyInbox(): boolean {
    return this.conversationsTotal === 0;
  }

  ngOnInit() {
    this.newMessageSubscription = this.eventService.subscribe(EventService.MESSAGE_ADDED,
      (message: InboxMessage) => {
        this.lastInboxMessage = message;
        if (this.isEndOfConversation) {
          this.sendReadForLastInboxMessage();
          this.scrollHeight = this.scrollLocalPosition;
        } else {
          this.noMessages += 1;
          this.scrollHeight = this.scrollLocalPosition + this.noMessages * this.MESSAGE_HEIGHT;
        }
      });

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

  ngOnChanges(changes: SimpleChanges): void {
    this.scrollLocalPosition = 0;
  }

  ngOnDestroy() {
    this.currentConversation = null;
    if (this.newMessageSubscription) {
      this.newMessageSubscription.unsubscribe();
    }
  }

  @HostListener('scroll', ['$event'])
  onScrollMessages(event: any) {
    this.noMessages = 0;
    this.scrollLocalPosition = event.target.scrollHeight - event.target.scrollTop;
    if (event.target.offsetHeight + event.target.scrollTop >= event.target.scrollHeight - this.BOTTOM_BUFFER_ZONE) {
      this.sendReadForLastInboxMessage();
      this.isEndOfConversation = true;
    } else {
      this.isEndOfConversation = false;
    }
  }

  public showDate(currentMessage: InboxMessage, nextMessage: InboxMessage): boolean {
    return nextMessage ? new Date(currentMessage.date).toDateString() !== new Date(nextMessage.date).toDateString() : true;
  }

  public dateIsThisYear(date: Date) {
    return date.getFullYear() === new Date().getFullYear();
  }

  public sendReadForLastInboxMessage() {
    if (this.lastInboxMessage) {
      this.sendRead(this.lastInboxMessage);
      this.lastInboxMessage = null;
    }
  }

  public changeTextareaHeight(textareaHeight: number): void {
    this.textareaHeight = textareaHeight;
    if (this.isEndOfConversation) {
      this.scrollToLastMessage();
    }
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
        this.currentConversation.id,
        result.reason,
        result.message
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
        this.currentConversation = null;
      });
    });
  }

  public unarchiveConversation() {
    this.modalService.open(UnarchiveInboxConversationComponent).result.then(() => {
      this.conversationService.unarchive(this.currentConversation).subscribe(() => {
        this.toastr.success(this.i18n.getTranslations('unarchiveConversationSuccess'));
        this.currentConversation = null;
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
    return this.conversationService.containsArchivedConversation(this.currentConversation);
  }

  public hasMoreMessages(): boolean {
    return this.currentConversation.nextPageToken !== null && this.currentConversation.nextPageToken !== undefined;
  }

  public loadMoreMessages(scrollHeight: number = 0) {
    if (this.isLoadingMoreMessages) {
      return;
    }
    this.isLoadingMoreMessages = true;
    this.scrollHeight = scrollHeight;
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
      this.sendReadForLastInboxMessage();
      this.isEndOfConversation = true;
    }
  }
}
