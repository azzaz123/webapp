
import {of as observableOf,  Observable } from 'rxjs';

export class ConversationServiceMock {
  getPage() {
    return observableOf([]);
  }

  getTotals() {
    return observableOf({});
  }
}
