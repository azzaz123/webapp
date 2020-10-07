import { Conversation } from '../app/core/conversation/conversation';
import { InboxConversation, InboxMessage } from '../app/chat/model';
import { Message } from '../app/core/message/message';

export class RealTimeServiceMock {
  sendRead(): void {
  }

  resendMessage(conversation: Conversation | InboxConversation, message: Message | InboxMessage): void {
  }

  sendDeliveryReceipt(to: string, id: string, thread: string): void {
  }

  addPhoneNumberMessageToConversation(conversation: InboxConversation) {
  }
}
