import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MOCK_KYC_IMAGES } from '@fixtures/private/wallet/kyc/kyc.fixtures.spec';

import { KYCService, KYC_ENDPOINT } from './kyc.service';

describe('KYCService', () => {
  let service: KYCService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [KYCService],
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(KYCService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when requesting the KYC...', () => {
    it('should request the KYC with specified images', () => {
      service.request(MOCK_KYC_IMAGES).subscribe();
      const req: TestRequest = httpMock.expectOne(KYC_ENDPOINT);
      req.flush({});

      expect(req.request.url).toBe(KYC_ENDPOINT);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ firstImage: MOCK_KYC_IMAGES.frontSide, secondImage: MOCK_KYC_IMAGES.backSide });
    });
  });
});
