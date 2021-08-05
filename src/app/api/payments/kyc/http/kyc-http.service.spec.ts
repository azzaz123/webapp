import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { UuidService } from '@core/uuid/uuid.service';
import { MOCK_KYC_IMAGES } from '@fixtures/private/wallet/kyc/kyc.fixtures.spec';
import { KYC_ENDPOINT } from './endpoints';

import { KYCHttpService } from './kyc-http.service';

describe('KYCHttpService', () => {
  let service: KYCHttpService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [KYCHttpService, UuidService],
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(KYCHttpService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when requesting the KYC...', () => {
    it('should request the KYC with the specified images', () => {
      service.request(MOCK_KYC_IMAGES).subscribe();
      const req: TestRequest = httpMock.expectOne(KYC_ENDPOINT);
      req.flush({});

      expect(req.request.url).toBe(KYC_ENDPOINT);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ firstImage: MOCK_KYC_IMAGES.frontSide, secondImage: MOCK_KYC_IMAGES.backSide });
    });
  });
});
