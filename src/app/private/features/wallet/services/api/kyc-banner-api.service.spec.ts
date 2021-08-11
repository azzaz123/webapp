import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MOCK_KYC_BANNER_PENDING_VERIFICATION } from '@fixtures/private/kyc/kyc.fixtures.spec';
import { KYCBanner } from '../../interfaces/kyc/kyc-banner.interface';

import { KYCBannerApiService, KYC_BANNER_STATUS_API_URL } from './kyc-banner-api.service';

describe('KYCBannerApiService', () => {
  let service: KYCBannerApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [KYCBannerApiService],
    });
    service = TestBed.inject(KYCBannerApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when requesting the kyc banner status...', () => {
    it('should get the kyc banner status ', () => {
      let response: KYCBanner;

      service.getKYCBanner().subscribe((data: KYCBanner) => {
        response = data;
      });
      const req: TestRequest = httpMock.expectOne(KYC_BANNER_STATUS_API_URL);
      req.flush(MOCK_KYC_BANNER_PENDING_VERIFICATION);

      expect(response).toEqual(MOCK_KYC_BANNER_PENDING_VERIFICATION);
      expect(req.request.url).toEqual(KYC_BANNER_STATUS_API_URL);
      expect(req.request.method).toBe('GET');
    });
  });
});
