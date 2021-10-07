import { InboxConversation } from '@private/features/chat/core/model';

export class InboxServiceMock {
  public conversations: InboxConversation[] = [];
  public archivedConversations: InboxConversation[] = [];

  public isInboxReady(): boolean {
    return false;
  }

  public isArchivedInboxReady(): boolean {
    return false;
  }
}
