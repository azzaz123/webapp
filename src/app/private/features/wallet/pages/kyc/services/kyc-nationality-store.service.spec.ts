import { TestBed } from '@angular/core/testing';

import { KYCNationalityStoreService } from './kyc-nationality-store.service';

describe('KYCNationalityStoreService', () => {
  let service: KYCNationalityStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KYCNationalityStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
