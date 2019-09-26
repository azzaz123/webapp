import * as retry from 'retry';
import { Injectable } from '@angular/core';
import { XmppService } from '../xmpp/xmpp.service';
import { Conversation } from '../conversation/conversation';
import { EventService } from '../event/event.service';
import { Message } from './message';
import { PersistencyService } from '../persistency/persistency.service';
import { TrackingService } from '../tracking/tracking.service';
import { ChatSignal, chatSignalType } from './chat-signal.interface';
import { InboxConversation } from '../../chat/chat-with-inbox/inbox/inbox-conversation/inbox-conversation';
import { RemoteConsoleService } from '../remote-console';
import { SendFirstMessage } from '../analytics/events-interfaces/send-first-message.interface';
import { SCREENS_IDS, EVENT_TYPES } from '../analytics/resources/analytics-constants';
import { AnalyticsService } from '../analytics/analytics.service';
import { ANALYTICS_EVENT_NAMES } from '../analytics/resources/analytics-event-names';

@Injectable()
export class RealTimeService {
  
  constructor(private xmpp: XmppService,
    private eventService: EventService,
    private persistencyService: PersistencyService,
    private trackingService: TrackingService,
    private remoteConsoleService: RemoteConsoleService,
    private analyticsService: AnalyticsService) {
    this.subscribeEventNewMessage();
    this.subscribeEventMessageSent();
    this.subscribeConnectionRestored();
  }

  static readonly FIRST_MESSAGE = 1;
  private ongoingRetry: boolean;

  public connect(userId: string, accessToken: string) {
    const startTimestamp = new Date().getTime();
    this.xmpp.connect(userId, accessToken).subscribe(() => {
      const endTimestamp = new Date().getTime();
      this.remoteConsoleService.sendConnectionTimeout(userId, endTimestamp - startTimestamp);
    });
  }

  public disconnect() {
    this.xmpp.disconnect();
  }

  public reconnect(recursivly = true) {
    if (!recursivly) {
      this.xmpp.reconnectClient();
    } else if (!this.ongoingRetry) {
      this.recursiveReconnect();
    }
  }

  private recursiveReconnect() {
    this.ongoingRetry = true;
    const operation = retry.operation({
      minTimeout: 5 * 1000,
      maxTimeout: 5 * 60 * 1000,
      forever: true
    });
    operation.attempt(() => {
      this.xmpp.reconnectClient();
      this.xmpp.disconnectError().subscribe(
        () => this.ongoingRetry = false,
        (err) => {
          if (operation.retry(err)) {
            return;
          }
        });
    });
  }

  public sendMessage(conversation: Conversation | InboxConversation, body: string) {
    this.xmpp.sendMessage(conversation, body);
    if (conversation.messages.length === RealTimeService.FIRST_MESSAGE) {
      this.trackSendFirstMessage(conversation);
    }
  }

  public resendMessage(conversation: Conversation, message: Message) {
    this.xmpp.resendMessage(conversation, message);
  }

  public sendDeliveryReceipt(to: string, id: string, thread: string) {
    this.xmpp.sendMessageDeliveryReceipt(to, id, thread);
  }

  public sendRead(to: string, thread: string) {
    this.xmpp.sendConversationStatus(to, thread);
    this.eventService.emit(EventService.CHAT_SIGNAL,
      new ChatSignal(chatSignalType.READ, thread, new Date().getTime(), null, true));
  }

  private subscribeEventNewMessage() {
    this.eventService.subscribe(EventService.NEW_MESSAGE, (message: Message, replaceTimestamp: boolean, withDeliveryReceipt: boolean) => {
      if (!message.fromSelf && withDeliveryReceipt) {
        this.persistencyService.findMessage(message.id).subscribe(() => { }, (error) => {
          if (error.reason === 'missing') {
            this.sendDeliveryReceipt(message.from, message.id, message.thread);
          }
        });
      }
    });
  }

  private subscribeEventMessageSent() {
    this.eventService.subscribe(EventService.MESSAGE_SENT, (conversation: Conversation, messageId: string) => {
      if (this.isFirstMessage(conversation)) {
        this.trackConversationCreated(conversation, messageId);
        appboy.logCustomEvent('FirstMessage', { platform: 'web' });
        const phoneRequestMsg = conversation.messages.find(m => !!m.phoneRequest);
        if (phoneRequestMsg) {
          this.eventService.emit(EventService.CONV_WITH_PHONE_CREATED, conversation, phoneRequestMsg);
        }
      }
      this.trackMessageSent(conversation.id, messageId);
    });
  }

  private subscribeConnectionRestored() {
    this.eventService.subscribe(EventService.CONNECTION_RESTORED, () => {
      this.reconnect(false);
    });
  }

  private isFirstMessage(conversation: Conversation): boolean {
    const phoneRequestMsg = conversation.messages.find(m => !!m.phoneRequest);
    if (conversation.messages.length === 1 || (phoneRequestMsg && conversation.messages.length === 2)) {
      return true;
    }
    return false;
  }

  private trackMessageSent(thread: string, messageId: string) {
    this.trackingService.addTrackingEvent({
      eventData: TrackingService.MESSAGE_SENT,
      attributes: {
        thread_id: thread,
        message_id: messageId
      }
    }, false);
  }

  private trackConversationCreated(conversation: Conversation, messageId: string) {
    this.trackingService.addTrackingEvent({
      eventData: TrackingService.CONVERSATION_CREATE_NEW,
      attributes: {
        item_id: conversation.item.id,
        thread_id: conversation.id,
        message_id: messageId
      }
    }, false);

    fbq('track', 'InitiateCheckout', {
      value: conversation.item.salePrice,
      currency: conversation.item.currencyCode,
    });
  }

  private trackSendFirstMessage(conversation: Conversation | InboxConversation) {
    const eventAttrs: SendFirstMessage = {
      itemId: conversation.item.id,
      sellerUserId: conversation.user.id,
      conversationId: conversation.id,
      screenId: SCREENS_IDS.ItemDetail
    }

    this.analyticsService.trackEvent({
      name: ANALYTICS_EVENT_NAMES.SendFirstMessage,
      eventType: EVENT_TYPES.Other,
      attributes: eventAttrs
    });
  }

}
