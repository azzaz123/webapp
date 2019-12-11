import { Observable } from 'rxjs';

export class ConversationServiceMock {
  getPage() {
    return Observable.of([]);
  }

  getTotals() {
    return Observable.of({});
  }
}
