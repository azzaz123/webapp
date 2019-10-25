import { InboxMessage, MessageType } from '../inbox-message';

export class InboxMessageApi {
  id: string;
  from_self: boolean;
  text: string;
  timestamp: Date;
  status: string;
  type: MessageType;

  public adapt(conversationId: string, currentUserId: string, otherUserId: string): InboxMessage {
    return new InboxMessage(
      this.id,
      conversationId,
      this.text,
      this.from_self ? currentUserId : otherUserId,
      this.from_self,
      this.timestamp,
      this.status,
      this.type);
  }
}
