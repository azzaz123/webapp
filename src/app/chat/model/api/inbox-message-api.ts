import { MessagePayload, MessageType } from '../inbox-message';

export class InboxMessageApi {
  id: string;
  from_self: boolean;
  text: string;
  timestamp: Date;
  status: string;
  type: MessageType;
  payload: MessagePayload;
}
