import * as retry from 'retry';
import {Injectable} from '@angular/core';
import {XmppService} from '../xmpp/xmpp.service';
import {EventService} from '../event/event.service';
import {RemoteConsoleService} from '../remote-console';
import {AnalyticsService} from '../analytics/analytics.service';
import {ANALYTIC_EVENT_TYPES, ANALYTICS_EVENT_NAMES, AnalyticsEvent, SCREEN_IDS, SendFirstMessage,} from '../analytics/analytics-constants';
import {ConnectionService} from '../connection/connection.service';
import {ConnectionType} from '../remote-console/connection-type';
import {I18nService} from '../i18n/i18n.service';
import {ChatSignal, ChatSignalType, InboxConversation, InboxMessage} from '@private/features/chat/core/model';
import {TRANSLATION_KEY} from '@core/i18n/translations/enum/translation-keys.enum';
import {AnalyticsMarketService} from '@core/analytics/analytics-market.service';

export const SEARCHID_STORAGE_NAME = 'searchId';

@Injectable()
export class RealTimeService {
  constructor(
    private xmpp: XmppService,
    private eventService: EventService,
    private remoteConsoleService: RemoteConsoleService,
    private analyticsService: AnalyticsService,
    private i18n: I18nService,
    private connectionService: ConnectionService,
    private analyticsMarketService: AnalyticsMarketService
  ) {
    this.subscribeEventMessageSent();
    this.subscribeConnectionRestored();
  }

  private ongoingRetry: boolean;

  public connect(userId: string, accessToken: string) {
    if (this.connectionService.isConnected && !this.xmpp.clientConnected) {
      let startTimestamp = Date.now();
      this.xmpp.connect$(userId, accessToken).subscribe(
        () => {
          this.remoteConsoleService.sendChatConnectionTime(ConnectionType.XMPP, true);
          this.remoteConsoleService.sendConnectionTimeout(userId, Date.now() - startTimestamp);
          startTimestamp = null;
        },
        () => {
          this.remoteConsoleService.sendChatConnectionTime(ConnectionType.XMPP, false);
        }
      );
    }
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
      forever: true,
    });
    operation.attempt(() => {
      this.xmpp.reconnectClient();
      this.xmpp.disconnectError().subscribe(
        () => (this.ongoingRetry = false),
        (err) => {
          if (operation.retry(err)) {
            return;
          }
        }
      );
    });
  }

  public sendMessage(conversation: InboxConversation, body: string): string {
    return this.xmpp.sendMessage(conversation, body);
  }

  public resendMessage(conversation: InboxConversation, message: InboxMessage) {
    this.xmpp.resendMessage(conversation, message);
  }

  public sendDeliveryReceipt(to: string, id: string, thread: string) {
    this.xmpp.sendMessageDeliveryReceipt(to, id, thread);
  }

  public sendRead(to: string, thread: string) {
    this.xmpp.sendConversationStatus(to, thread);
    this.eventService.emit(EventService.CHAT_SIGNAL, new ChatSignal(ChatSignalType.READ, thread, new Date().getTime(), null, true));
  }

  public addPhoneNumberMessageToConversation(conversation: InboxConversation, phone: string) {
    const message = `${this.i18n.translate(TRANSLATION_KEY.CHAT_MY_PHONE_NUMBER)} ${phone}`;
    this.sendMessage(conversation, message);
  }

  private subscribeEventMessageSent() {
    this.eventService.subscribe(EventService.MESSAGE_SENT, (conversation: InboxConversation, messageId: string) => {
      if (this.isFirstMessage(conversation)) {
        this.trackConversationCreated(conversation);
        this.trackSendFirstMessage(conversation);
      }
    });
  }

  private subscribeConnectionRestored() {
    this.eventService.subscribe(EventService.CONNECTION_RESTORED, () => {
      this.reconnect(false);
    });
  }

  private isFirstMessage(conversation: InboxConversation): boolean {
    return conversation.messages.length === 1;
  }

  private trackConversationCreated(conversation: InboxConversation) {
    fbq('track', 'InitiateCheckout', {
      value: conversation.item.price.amount,
      currency: conversation.item.price.currency,
    });

    pintrk('track', 'checkout', {
      value: conversation.item.price.amount,
      currency: conversation.item.price.currency,
      line_items: [
        {
          product_category: conversation.item.categoryId,
          product_id: conversation.item.id,
        },
      ],
    });
  }

  private trackSendFirstMessage(conversation: InboxConversation) {
    const searchId = sessionStorage.getItem(SEARCHID_STORAGE_NAME);
    const event: AnalyticsEvent<SendFirstMessage> = {
      name: ANALYTICS_EVENT_NAMES.SendFirstMessage,
      eventType: ANALYTIC_EVENT_TYPES.Other,
      attributes: {
        itemId: conversation.item.id,
        sellerUserId: conversation.user.id,
        conversationId: conversation.id,
        screenId: SCREEN_IDS.Chat,
        categoryId: conversation.item.categoryId,
        country: this.analyticsMarketService.market,
        language: this.analyticsMarketService.localeId
      },
    };

    if (searchId) {
      event.attributes.searchId = searchId;
    }

    this.analyticsService.trackEvent(event);
    sessionStorage.removeItem(SEARCHID_STORAGE_NAME);
  }
}
