import { Observable } from 'rxjs';

export class CallsServiceMock {
  getPage() {
    return Observable.of([]);
  }

  getTotals() {
    return Observable.of({});
  }
}
