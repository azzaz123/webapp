import {
  AfterViewChecked,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { EventService } from '../../core/event/event.service';
import { RealTimeService } from '../../core/message/real-time.service';
import { of, Subscription } from 'rxjs';
import { I18nService } from '../../core/i18n/i18n.service';
import { InboxConversationService } from '../service';
import { TextMessageComponent } from '../message/text-message';
import { eq, includes, isEmpty } from 'lodash-es';
import { InboxConversation, InboxMessage, MessageStatus, MessageType } from '../model';
import { ThirdVoiceDropPriceComponent } from '../message/third-voice-drop-price';
import { ThirdVoiceReviewComponent } from '../message/third-voice-review';
import { RemoteConsoleService } from '../../core/remote-console';
import { delay } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MaliciousConversationModalComponent } from '../modals/malicious-conversation-modal/malicious-conversation-modal.component';

@Component({
  selector: 'tsl-current-conversation',
  templateUrl: './current-conversation.component.html',
  styleUrls: ['./current-conversation.component.scss']
})
export class CurrentConversationComponent implements OnInit, OnChanges, AfterViewChecked, OnDestroy {

  public readonly BOTTOM_BUFFER_ZONE = 100;
  private MESSAGE_HEIGHT = 14;
  public readonly MESSAGE_METRIC_DELAY = 5 * 1000;

  @Input() currentConversation: InboxConversation;
  @Input() conversationsTotal: number;
  @Input() connectionError: boolean;
  @Input() loadingError: boolean;
  @ViewChild('scrollElement') private scrollElement: ElementRef;
  @ViewChild('userWarringNotification') private userWarringNotification: ElementRef;

  public momentConfig: any;
  private newMessageSubscription: Subscription;
  public isLoadingMoreMessages = false;
  private lastInboxMessage: InboxMessage;
  public isEndOfConversation = true;
  public scrollHeight = 0;
  public scrollLocalPosition = 0;
  public noMessages = 0;
  public isConversationChanged: boolean;
  public isTopBarExpanded = false;

  constructor(private eventService: EventService,
              i18n: I18nService,
              private realTime: RealTimeService,
              private inboxConversationService: InboxConversationService,
              private remoteConsoleService: RemoteConsoleService,
              private modalService: NgbModal) {
    this.momentConfig = i18n.getTranslations('defaultDaysMomentConfig');
  }

  get emptyInbox(): boolean {
    return this.conversationsTotal === 0;
  }

  ngOnInit() {
    this.isEndOfConversation = true;
    this.newMessageSubscription = this.eventService.subscribe(EventService.MESSAGE_ADDED,
      (message: InboxMessage) => {
        this.isConversationChanged = true;
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
        this.isConversationChanged = false;
        this.currentConversation = conversation;
      });

    this.eventService.subscribe(EventService.CONNECTION_RESTORED,
      () => this.sendMetricMessageSendFailed('pending messages after restored connection'));
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { currentConversation } = changes;
    this.scrollHeight = 0;
    this.scrollLocalPosition = 0;
    if (currentConversation) {
      this.openMaliciousConversationModal();
      this.isConversationChanged = true;
      this.isTopBarExpanded = this.currentConversation && isEmpty(this.currentConversation.messages);
    }
  }

  ngAfterViewChecked(): void {
    if (this.isConversationChanged && this.scrollElement) {
      this.scrollElement.nativeElement.scrollTop = this.scrollElement.nativeElement.scrollHeight - this.scrollHeight;
    }
  }

  ngOnDestroy() {
    this.currentConversation = null;
    this.isTopBarExpanded = false;
    if (this.newMessageSubscription) {
      this.newMessageSubscription.unsubscribe();
    }
  }

  @HostListener('scroll', ['$event'])
  onScrollMessages(event: any) {
    this.noMessages = 0;
    this.isConversationChanged = false;
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

  private sendRead(message: InboxMessage) {
    if (this.currentConversation !== null && eq(this.currentConversation.id, message.thread) && !message.fromSelf) {
      Visibility.onVisible(() => {
        setTimeout(() => {
          this.realTime.sendRead(message.from, message.thread);
        }, 1000);
      });
    }
  }

  public hasMoreMessages(): boolean {
    return this.currentConversation.nextPageToken !== null && this.currentConversation.nextPageToken !== undefined;
  }

  public loadMoreMessages(scrollHeight: number = 0) {
    if (this.isLoadingMoreMessages) {
      return;
    }
    this.isConversationChanged = true;
    this.isLoadingMoreMessages = true;
    this.scrollHeight = scrollHeight;
    this.inboxConversationService.loadMoreMessages(this.currentConversation.id);
  }

  public isTextMessage(messageType: MessageType): boolean {
    return includes(TextMessageComponent.ALLOW_MESSAGES_TYPES, messageType);
  }

  public isThirdVoiceDropPrice(messageType: MessageType): boolean {
    return includes(ThirdVoiceDropPriceComponent.ALLOW_MESSAGES_TYPES, messageType);
  }

  public isThirdVoiceReview(messageType: MessageType): boolean {
    return includes(ThirdVoiceReviewComponent.ALLOW_MESSAGES_TYPES, messageType);
  }

  public scrollToLastMessage(): void {
    const lastMessage = document.querySelector('.message-body');
    if (lastMessage) {
      lastMessage.scrollIntoView({ behavior: 'smooth' });
      this.sendReadForLastInboxMessage();
      this.isEndOfConversation = true;
    }

    if (this.userWarringNotification) {
      this.userWarringNotification.nativeElement.scrollIntoView({ behavior: 'smooth' });
    }
  }

  public navigationBack(): void {
    this.eventService.emit(EventService.CURRENT_CONVERSATION_SET, null);
  }

  public expandTopBar(isTopBarExpanded: boolean): void {
    this.isTopBarExpanded = isTopBarExpanded;
  }

  public typing() {
    this.isTopBarExpanded = false;
  }

  public clickSendMessage(messageId: string): void {
    of(messageId).pipe(delay(this.MESSAGE_METRIC_DELAY))
      .subscribe(id => this.sendMetricMessageSendFailedByMessageId(id, `message is not send after ${this.MESSAGE_METRIC_DELAY}ms`));
  }

  private sendMetricMessageSendFailedByMessageId(messageId: string, description: string): void {
    this.currentConversation.messages
      .filter(message => message.id === messageId && message.status === MessageStatus.PENDING)
      .forEach(message => this.remoteConsoleService.sendMessageAckFailed(message.id, description));
  }

  private sendMetricMessageSendFailed(description: string): void {
    this.currentConversation.messages
      .filter(message => message.status === MessageStatus.PENDING)
      .forEach(message => this.remoteConsoleService.sendMessageAckFailed(message.id, description));
  }

  private openMaliciousConversationModal(): void {
    if (!this.currentConversation || !this.currentConversation.isFromMaliciousUser) {
      return;
    }

    this.modalService.open(MaliciousConversationModalComponent, { windowClass: 'warning' }).result.then(userExitsConversation => {
      if (userExitsConversation) {
        this.inboxConversationService.currentConversation = null;
      }
    });
  }
}
