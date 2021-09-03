import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { KYCPropertiesApi } from '@api/payments/kyc-properties/dtos/responses';
import { MOCK_KYC_BANNER_PENDING_VERIFICATION } from '@fixtures/private/wallet/kyc/kyc.fixtures.spec';

import { KYCStatusApiService, KYC_PROPERTIES_API_URL } from './kyc-status-api.service';

describe('KYCStatusApiService', () => {
  let service: KYCStatusApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [KYCStatusApiService],
    });
    service = TestBed.inject(KYCStatusApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when requesting the kyc banner status...', () => {
    it('should get the kyc banner status ', () => {
      let response: KYCPropertiesApi;

      service.get().subscribe((data: KYCPropertiesApi) => {
        response = data;
      });
      const req: TestRequest = httpMock.expectOne(KYC_PROPERTIES_API_URL);
      req.flush(MOCK_KYC_BANNER_PENDING_VERIFICATION);

      expect(response).toEqual(MOCK_KYC_BANNER_PENDING_VERIFICATION);
      expect(req.request.url).toEqual(KYC_PROPERTIES_API_URL);
      expect(req.request.method).toBe('GET');
    });
  });
});
