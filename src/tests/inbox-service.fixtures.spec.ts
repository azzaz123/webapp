import { InboxConversation } from '../app/chat/model';
import { Observable } from 'rxjs';

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
