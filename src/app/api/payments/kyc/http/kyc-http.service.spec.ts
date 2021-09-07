import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MOCK_KYC_IMAGES_BASE_64, MOCK_KYC_REQUEST_BODY } from '@fixtures/private/wallet/kyc/kyc.fixtures.spec';
import { KYC_ENDPOINT } from './endpoints';

import { KYCHttpService } from './kyc-http.service';

describe('KYCHttpService', () => {
  let service: KYCHttpService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [KYCHttpService],
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(KYCHttpService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when requesting the KYC...', () => {
    beforeEach(() => {
      service.request(MOCK_FORM_DATA()).subscribe();
    });

    it('should send a petition to create the KYC request', () => {
      const req: TestRequest = httpMock.expectOne(KYC_ENDPOINT);
      req.flush({});

      expect(req.request.url).toEqual(KYC_ENDPOINT);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(MOCK_FORM_DATA());
    });

    it('should make the request with response type specified', () => {
      const req: TestRequest = httpMock.expectOne(KYC_ENDPOINT);
      req.flush({});

      expect(req.request.responseType).toEqual('text');
    });
  });

  function MOCK_FORM_DATA(): FormData {
    return MOCK_KYC_REQUEST_BODY(MOCK_KYC_IMAGES_BASE_64.frontSide, MOCK_KYC_IMAGES_BASE_64.backSide);
  }
});
