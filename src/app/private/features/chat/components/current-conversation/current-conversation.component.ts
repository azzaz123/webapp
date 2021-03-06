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
  ViewChild,
} from '@angular/core';
import { AdSlotConfiguration } from '@core/ads/models';
import { EventService } from '@core/event/event.service';
import { MomentCalendarSpecService } from '@core/i18n/moment/moment-calendar-spec.service';
import { RealTimeService } from '@core/message/real-time.service';
import { RemoteConsoleService } from '@core/remote-console';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TextMessageComponent } from '@private/features/chat/children/message/components/text-message';
import { ThirdVoiceDropPriceComponent } from '@private/features/chat/children/message/components/third-voice-drop-price';
import { ThirdVoiceReviewComponent } from '@private/features/chat/children/message/components/third-voice-review';
import { InboxConversationService } from '@private/features/chat/core/inbox/inbox-conversation.service';
import { InboxConversation, InboxMessage, MessageStatus, MessageType } from '@private/features/chat/core/model';
import { MaliciousConversationModalComponent } from '@private/features/chat/modals/malicious-conversation-modal/malicious-conversation-modal.component';
import {
  AnalyticsEvent,
  ANALYTICS_EVENT_NAMES,
  ANALYTIC_EVENT_TYPES,
  ClickBannedUserChatPopUpCloseButton,
  ClickBannedUserChatPopUpExitButton,
  SCREEN_IDS,
  ViewBannedUserChatPopUp,
} from 'app/core/analytics/analytics-constants';
import { AnalyticsService } from 'app/core/analytics/analytics.service';
import { UserService } from 'app/core/user/user.service';
import { eq, includes, isEmpty } from 'lodash-es';
import { CalendarSpec } from 'moment';
import { Observable, of, Subscription } from 'rxjs';
import { delay, take } from 'rxjs/operators';
import { onVisible } from 'visibilityjs';
import { CHAT_AD_SLOTS } from '../../core/ads/chat-ad.config';
import { PERMISSIONS } from '@core/user/user-constants';
import { ChatTranslationService } from '@private/features/chat/services/chat-translation/chat-translation.service';
import { TranslateButtonCopies } from '@core/components/translate-button/interfaces';
import { DeliveryBanner } from '../../modules/delivery-banner/interfaces/delivery-banner.interface';
import { DeliveryConversationContextService } from '../../modules/delivery-conversation-context/services/delivery-conversation-context/delivery-conversation-context.service';
import { DELIVERY_BANNER_ACTION } from '../../modules/delivery-banner/enums/delivery-banner-action.enum';

@Component({
  selector: 'tsl-current-conversation',
  templateUrl: './current-conversation.component.html',
  styleUrls: ['./current-conversation.component.scss'],
})
export class CurrentConversationComponent implements OnInit, OnChanges, AfterViewChecked, OnDestroy {
  @Input() currentConversation: InboxConversation;
  @Input() conversationsTotal: number;
  @Input() connectionError: boolean;
  @Input() loadingError: boolean;
  @ViewChild('scrollElement') private scrollElement: ElementRef;
  @ViewChild('userWarringNotification') private userWarringNotification: ElementRef;

  public readonly BOTTOM_BUFFER_ZONE = 100;
  public readonly MESSAGE_METRIC_DELAY = 5 * 1000;
  public readonly PERMISSIONS = PERMISSIONS;
  public momentCalendarSpec: CalendarSpec = this.momentCalendarSpecService.getCalendarSpec();
  public isLoadingMoreMessages = false;
  public isDeliveryContextLoading: boolean = true;
  public isEndOfConversation = true;
  public scrollHeight = 0;
  public scrollLocalPosition = 0;
  public noMessages = 0;
  public isConversationChanged: boolean;
  public isTopBarExpanded = false;
  public chatRightAdSlot: AdSlotConfiguration = CHAT_AD_SLOTS;
  public translateButtonCopies: TranslateButtonCopies = {
    showTranslation: $localize`:@@chat_all_users_translate_button:Translate conversation`,
  };

  private MESSAGE_HEIGHT = 14;
  private chatContext: ViewBannedUserChatPopUp;
  private newMessageSubscription: Subscription;
  private lastInboxMessage: InboxMessage;

  constructor(
    private eventService: EventService,
    private realTime: RealTimeService,
    private inboxConversationService: InboxConversationService,
    private remoteConsoleService: RemoteConsoleService,
    private modalService: NgbModal,
    private userService: UserService,
    private analyticsService: AnalyticsService,
    private momentCalendarSpecService: MomentCalendarSpecService,
    private translationService: ChatTranslationService,
    private deliveryConversationContextService: DeliveryConversationContextService
  ) {}

  get emptyInbox(): boolean {
    return this.conversationsTotal === 0;
  }

  public get deliveryBannerProperties$(): Observable<DeliveryBanner> {
    return this.deliveryConversationContextService.bannerProperties$;
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

  ngOnInit() {
    this.isEndOfConversation = true;
    this.newMessageSubscription = this.eventService.subscribe(EventService.MESSAGE_ADDED, (message: InboxMessage) => {
      this.isConversationChanged = true;
      this.lastInboxMessage = message;
      if (this.isEndOfConversation) {
        this.sendReadForLastInboxMessage();
        this.scrollHeight = this.scrollLocalPosition;
      } else {
        this.noMessages += 1;
        this.scrollHeight = this.scrollLocalPosition + this.noMessages * this.MESSAGE_HEIGHT;
      }

      if (this.currentConversation?.isAutomaticallyTranslatable) {
        this.translateConversation();
      }

      const shouldRefreshDeliveryContext: boolean = this.deliveryContextNeedsRefresh(message);
      if (shouldRefreshDeliveryContext) {
        this.refreshDeliveryContext();
      }
    });

    this.eventService.subscribe(EventService.MORE_MESSAGES_LOADED, (conversation: InboxConversation) => {
      this.isLoadingMoreMessages = false;
      this.isConversationChanged = false;
      this.currentConversation = conversation;

      if (this.currentConversation.isAutomaticallyTranslatable) {
        this.translateConversation();
      }
    });

    this.eventService.subscribe(EventService.CONNECTION_RESTORED, () =>
      this.sendMetricMessageSendFailed('pending messages after restored connection')
    );

    this.listenDeliveryContextLoadingChanges();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { currentConversation } = changes;
    this.scrollHeight = 0;
    this.scrollLocalPosition = 0;
    if (currentConversation) {
      this.openMaliciousConversationModal();
      this.isConversationChanged = true;
      this.isTopBarExpanded = this.currentConversation && isEmpty(this.currentConversation.messages);
      this.refreshDeliveryContext();
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

  public hasMoreMessages(): boolean {
    return this.currentConversation?.nextPageToken !== null && this.currentConversation?.nextPageToken !== undefined;
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

  public isDeliveryThirdVoice(messageType: MessageType): boolean {
    return (
      messageType === MessageType.DELIVERY ||
      messageType === MessageType.DELIVERY_GENERIC ||
      messageType === MessageType.TRANSACTION_CLAIM_PERIOD ||
      messageType === MessageType.TRANSACTION_CLAIM_PERIOD_RT
    );
  }

  public isShippingKeywordsThirdVoice(messageType: MessageType): boolean {
    return messageType === MessageType.SHIPPING_KEYWORDS;
  }

  public scrollToLastMessage(): void {
    const lastMessage = document.querySelector('.message-body');
    if (lastMessage) {
      lastMessage.scrollIntoView({ behavior: 'smooth' });
      this.sendReadForLastInboxMessage();
      this.isEndOfConversation = true;
    }

    if (this.userWarringNotification) {
      this.userWarringNotification.nativeElement.scrollIntoView({
        behavior: 'smooth',
      });
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
    of(messageId)
      .pipe(delay(this.MESSAGE_METRIC_DELAY))
      .subscribe((id) => this.sendMetricMessageSendFailedByMessageId(id, `message is not send after ${this.MESSAGE_METRIC_DELAY}ms`));
  }

  public translateConversation(): void {
    if (!this.currentConversation?.isTranslating && this.currentConversation?.isTranslatable) {
      const conversation = this.currentConversation;
      conversation.isTranslating = true;
      this.translationService
        .translateConversation(this.currentConversation)
        .pipe(take(1))
        .subscribe(() => {
          conversation.isTranslating = false;
          conversation.isAutomaticallyTranslatable = true;
        });
    }
  }

  public handleDeliveryBannerCTAClick(deliveryBannerActionType: DELIVERY_BANNER_ACTION): void {
    this.deliveryConversationContextService.handleBannerCTAClick(this.currentConversation, deliveryBannerActionType);
  }

  public handleDeliveryThirdVoiceCTAClick(): void {
    this.deliveryConversationContextService.handleThirdVoiceCTAClick(this.currentConversation);
  }

  private sendRead(message: InboxMessage) {
    if (this.currentConversation !== null && eq(this.currentConversation.id, message.thread) && !message.fromSelf) {
      onVisible(() => {
        setTimeout(() => {
          this.realTime.sendRead(message.from, message.thread);
        }, 1000);
      });
    }
  }

  private deliveryContextNeedsRefresh(newMessage: InboxMessage): boolean {
    const isDeliveryThirdVoice: boolean = this.isDeliveryThirdVoice(newMessage.type);
    const isMessageInCurrentConversation: boolean = !!this.currentConversation?.messages.find((m) => m.id === newMessage.id);
    return isDeliveryThirdVoice && isMessageInCurrentConversation;
  }

  private sendMetricMessageSendFailedByMessageId(messageId: string, description: string): void {
    if (!this.currentConversation) {
      return;
    }

    this.currentConversation.messages
      .filter((message) => message.id === messageId && message.status === MessageStatus.PENDING)
      .forEach((message) => this.remoteConsoleService.sendMessageAckFailed(message.id, description));
  }

  private sendMetricMessageSendFailed(description: string): void {
    if (!this.currentConversation) {
      return;
    }

    this.currentConversation.messages
      .filter((message) => message.status === MessageStatus.PENDING)
      .forEach((message) => this.remoteConsoleService.sendMessageAckFailed(message.id, description));
  }

  private fillChatContext(): void {
    this.chatContext = {
      userId: this.userService.user.id,
      bannedUserId: this.currentConversation?.user?.id,
      conversationId: this.currentConversation?.id,
      screenId: SCREEN_IDS.BannedUserChatPopUp,
    };
  }

  private openMaliciousConversationModal(): void {
    if (!this.currentConversation?.isFromMaliciousUser) {
      return;
    }
    this.fillChatContext();
    const modalRef: NgbModalRef = this.modalService.open(MaliciousConversationModalComponent, { windowClass: 'warning' });
    modalRef.componentInstance.chatContext = this.chatContext;

    modalRef.result.then(() => this.handleUserConfirmsMaliciousModal()).catch(() => this.trackDismissMaliciousModal());
  }

  private handleUserConfirmsMaliciousModal(): void {
    this.inboxConversationService.currentConversation = null;
    this.trackClickMaliciousModalCTAButton();
  }

  private refreshDeliveryContext(): void {
    this.deliveryConversationContextService.reset();
    if (this.currentConversation) {
      this.deliveryConversationContextService.update(this.currentConversation);
    }
  }

  private listenDeliveryContextLoadingChanges(): void {
    this.deliveryConversationContextService.loading$.subscribe((loading) => (this.isDeliveryContextLoading = loading));
  }

  private trackClickMaliciousModalCTAButton(): void {
    const event: AnalyticsEvent<ClickBannedUserChatPopUpExitButton> = {
      name: ANALYTICS_EVENT_NAMES.ClickBannedUserChatPopUpExitButton,
      eventType: ANALYTIC_EVENT_TYPES.Navigation,
      attributes: this.chatContext,
    };
    this.analyticsService.trackEvent(event);
  }

  private trackDismissMaliciousModal(): void {
    const event: AnalyticsEvent<ClickBannedUserChatPopUpCloseButton> = {
      name: ANALYTICS_EVENT_NAMES.ClickBannedUserChatPopUpCloseButton,
      eventType: ANALYTIC_EVENT_TYPES.Navigation,
      attributes: this.chatContext,
    };
    this.analyticsService.trackEvent(event);
  }
}
