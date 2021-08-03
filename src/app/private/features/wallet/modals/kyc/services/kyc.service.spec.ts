import { TestBed } from '@angular/core/testing';

import { KYCService } from './kyc.service';

describe('KYCService', () => {
  let service: KYCService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [KYCService],
    });
    service = TestBed.inject(KYCService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
