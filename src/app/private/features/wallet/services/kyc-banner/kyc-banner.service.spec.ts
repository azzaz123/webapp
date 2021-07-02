import { TestBed } from '@angular/core/testing';

import { KycBannerService } from './kyc-banner.service';

describe('KycBannerService', () => {
  let service: KycBannerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KycBannerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
