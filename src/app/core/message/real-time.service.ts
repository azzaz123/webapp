import { Injectable } from '@angular/core';
import { XmppService } from '../xmpp/xmpp.service';
import { Conversation } from '../conversation/conversation';
import { EventService } from '../event/event.service';
import { Message } from './message';
import { PersistencyService } from '../persistency/persistency.service';

@Injectable()
export class RealTimeService {

  constructor(private xmpp: XmppService,
              private eventService: EventService,
              private persistencyService: PersistencyService) {
    this.subscribeEventNewMessage();
  }

  public connect(userId: string, accessToken: string) {
    this.xmpp.connect(userId, accessToken);
  }

  public disconnect() {
    this.xmpp.disconnect();
  }

  public reconnect() {
    this.xmpp.reconnectClient();
  }

  public sendMessage(conversation: Conversation, body: string, resend = false, messageId?: string) {
    this.xmpp.sendMessage(conversation, body, resend, messageId);
  }

  public sendDeliveryReceipt(to: string, id: string, conversationId: string) {
    this.xmpp.sendMessageDeliveryReceipt(to, id, conversationId);
  }

  public sendRead(to: string, conversationId: string) {
    this.xmpp.sendConversationStatus(to, conversationId);
  }

  private subscribeEventNewMessage() {
    this.eventService.subscribe(EventService.NEW_MESSAGE, (message: Message, replaceTimestamp: boolean, withDeliveryReceipt: boolean) => {
      if (!message.fromSelf && withDeliveryReceipt) {
        this.persistencyService.findMessage(message.id).subscribe(() => { }, (error) => {
          if (error.reason === 'missing') {
            this.sendDeliveryReceipt(message.from, message.id, message.conversationId);
          }
        });
      }
    });
  }

}
