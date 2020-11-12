import { of } from 'rxjs';

export class CallsServiceMock {
  getPage() {
    return of([]);
  }

  getTotals() {
    return of({});
  }
}
