import { InboxMessagesApi } from './inbox-messages-api';
import { InboxItemApi } from './inbox-item-api';
import { InboxUserApi } from './inbox-user-api';

export class InboxConversationApi {
  hash: string;
  with_user: InboxUserApi;
  item: InboxItemApi;
  messages: InboxMessagesApi;
  unread_messages: number;
  phone_shared: boolean;
  phone_number: string;
  translatable: boolean;
}
