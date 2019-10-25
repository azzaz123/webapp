import { InboxConversationApi } from './inbox-conversation-api';

export class InboxApi {
  user_hash: string;
  next_from: string;
  unread_messages: number;
  conversations: InboxConversationApi[];
}
