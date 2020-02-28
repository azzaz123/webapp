import { now } from 'lodash-es';
import * as retry from 'retry';
import { Injectable } from '@angular/core';
import { XmppService } from '../xmpp/xmpp.service';
import { Conversation } from '../conversation/conversation';
import { EventService } from '../event/event.service';
import { Message } from './message';
import { TrackingService } from '../tracking/tracking.service';
import { ChatSignal, chatSignalType } from './chat-signal.interface';
import { InboxConversation } from '../../chat/model/inbox-conversation';
import { RemoteConsoleService } from '../remote-console';
import { AnalyticsService } from '../analytics/analytics.service';
import {
  ANALYTIC_EVENT_TYPES,
  ANALYTICS_EVENT_NAMES,
  SCREEN_IDS,
  AnalyticsEvent,
  SendFirstMessage
} from '../analytics/analytics-constants';
import { ConnectionService } from '../connection/connection.service';
import { filter } from 'rxjs/operators';
import { InboxMessage } from '../../chat/model';

@Injectable()
export class RealTimeService {

  constructor(private xmpp: XmppService,
              private eventService: EventService,
              private trackingService: TrackingService,
              private remoteConsoleService: RemoteConsoleService,
              private analyticsService: AnalyticsService,
              private connectionService: ConnectionService) {
    this.subscribeEventMessageSent();
    this.subscribeConnectionRestored();
  }

  private ongoingRetry: boolean;

  public connect(userId: string, accessToken: string) {
    this.xmpp.isConnected$()
    .pipe(filter((isConnectedWithXMPP: boolean) => !isConnectedWithXMPP))
    .subscribe(() => {
        if (this.connectionService.isConnected) {
          let startTimestamp = now();
          this.xmpp.connect$(userId, accessToken).subscribe(() => {
            this.remoteConsoleService.sendConnectionTimeout(userId, now() - startTimestamp);
            startTimestamp = null;
          });
        }
      }
    );
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
  }

  public resendMessage(conversation: Conversation | InboxConversation, message: Message | InboxMessage) {
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

  private subscribeEventMessageSent() {
    this.eventService.subscribe(EventService.MESSAGE_SENT, (conversation: Conversation, messageId: string) => {
      if (this.isFirstMessage(conversation)) {
        this.trackConversationCreated(conversation, messageId);
        this.trackSendFirstMessage(conversation);
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
    const event: AnalyticsEvent<SendFirstMessage> = {
      name: ANALYTICS_EVENT_NAMES.SendFirstMessage,
      eventType: ANALYTIC_EVENT_TYPES.Other,
      attributes: {
        itemId: conversation.item.id,
        sellerUserId: conversation.user.id,
        conversationId: conversation.id,
        screenId: SCREEN_IDS.Chat
      }
    };

    this.analyticsService.trackEvent(event);
  }

}
