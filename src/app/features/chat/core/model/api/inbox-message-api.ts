import { MessagePayload, MessageStatus, MessageType } from '../inbox-message';

export class InboxMessageApi {
  id: string;
  from_self: boolean;
  text: string;
  timestamp: Date;
  status: MessageStatus;
  type: MessageType;
  payload: MessagePayload;
}
