import { InboxConversation } from './inbox-conversation';

export class GetInboxConversation {

  public conversations: InboxConversation[];
  public user_hash: string;
  public unread_messages: number;
  public next_from: string;
}
