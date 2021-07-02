import { TestBed } from '@angular/core/testing';

import { KycBannerApiService } from './kyc-banner-api.service';

describe('KycBannerApiService', () => {
  let service: KycBannerApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KycBannerApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
