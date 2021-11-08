import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

export class ListingLimitServiceMock {
  showModal(): any {
    return {
      result: Promise.resolve(),
      componentInstance: {},
    };
  }
}
