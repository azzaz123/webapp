import { TestBed } from '@angular/core/testing';

import { AcceptScreenStoreService } from './accept-screen-store.service';

describe('AcceptScreenStoreService', () => {
  let service: AcceptScreenStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AcceptScreenStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
