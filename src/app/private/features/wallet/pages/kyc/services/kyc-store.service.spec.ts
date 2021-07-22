import { TestBed } from '@angular/core/testing';

import { KYCStoreService } from './kyc-store.service';

describe('KYCStoreService', () => {
  let service: KYCStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KYCStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
