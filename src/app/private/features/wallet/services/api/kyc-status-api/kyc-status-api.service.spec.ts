import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MOCK_KYC_BANNER_PENDING_VERIFICATION } from '@fixtures/private/wallet/kyc/kyc.fixtures.spec';
import { KYCStatus } from '@private/features/wallet/interfaces/kyc/kyc-status.interface';

import { KYCStatusApiService, KYC_STATUS_API_URL } from './kyc-status-api.service';

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
      let response: KYCStatus;

      service.get().subscribe((data: KYCStatus) => {
        response = data;
      });
      const req: TestRequest = httpMock.expectOne(KYC_STATUS_API_URL);
      req.flush(MOCK_KYC_BANNER_PENDING_VERIFICATION);

      expect(response).toEqual(MOCK_KYC_BANNER_PENDING_VERIFICATION);
      expect(req.request.url).toEqual(KYC_STATUS_API_URL);
      expect(req.request.method).toBe('GET');
    });
  });
});
