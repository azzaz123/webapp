
import {of as observableOf,  Observable } from 'rxjs';

export class CallsServiceMock {
  getPage() {
    return observableOf([]);
  }

  getTotals() {
    return observableOf({});
  }
}
