import { InboxConversation, InboxMessage } from '@features/chat/core/model';
import { Conversation } from '../app/core/conversation/conversation';
import { Message } from '../app/core/message/message';

export class RealTimeServiceMock {
  sendRead(): void {}

  resendMessage(
    conversation: Conversation | InboxConversation,
    message: Message | InboxMessage
  ): void {}

  sendDeliveryReceipt(to: string, id: string, thread: string): void {}

  addPhoneNumberMessageToConversation(conversation: InboxConversation) {}
}
