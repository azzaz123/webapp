
import { of } from 'rxjs';

export class ConversationServiceMock {
  getPage() {
    return of([]);
  }

  getTotals() {
    return of({});
  }

  public loadMoreMessages() {
  }
}
