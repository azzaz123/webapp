import { Injectable } from '@angular/core';
import { XmppService } from '../xmpp/xmpp.service';
import { Conversation } from '../conversation/conversation';

@Injectable()
export class RealTimeService {

  constructor(private xmpp: XmppService) { }

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
}
