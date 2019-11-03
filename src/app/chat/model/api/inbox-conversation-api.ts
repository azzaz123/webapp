import { InboxMessagesApi } from './inbox-messages-api';
import { InboxItemApi } from './inbox-item-api';

export class InboxConversationApi {
  hash: string;
  with_user: any;
  item: InboxItemApi;
  messages: InboxMessagesApi;
  unread_messages: number;
}
