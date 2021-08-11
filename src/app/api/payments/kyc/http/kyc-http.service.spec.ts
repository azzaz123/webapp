import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { UuidService } from '@core/uuid/uuid.service';
import {
  MOCK_KYC_IMAGES_BASE_64,
  MOCK_KYC_IMAGES_BASE_64_BACK_NULL,
  MOCK_KYC_REQUEST_BODY,
} from '@fixtures/private/wallet/kyc/kyc.fixtures.spec';
import { KYC_ENDPOINT } from './endpoints';

import { KYCHttpService } from './kyc-http.service';

describe('KYCHttpService', () => {
  let service: KYCHttpService;
  let httpMock: HttpTestingController;
  let uuidService: UuidService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [KYCHttpService, UuidService],
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(KYCHttpService);
    httpMock = TestBed.inject(HttpTestingController);
    uuidService = TestBed.inject(UuidService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when requesting the KYC...', () => {
    beforeEach(() => {
      spyOn(uuidService, 'getUUID').and.returnValue('1-2');
    });

    describe('and we request it with first image and second image', () => {
      beforeEach(() => {
        service.request(MOCK_KYC_IMAGES_BASE_64).subscribe();
      });

      it('should request the KYC', () => {
        shouldRequestTheKYC();
      });

      it('should do a POST petition', () => {
        shouldDoPOSTPetition();
      });

      it('should make the request with kyc required formed data', () => {
        shouldMakeRequestWithSpecifiedImages(MOCK_KYC_IMAGES_BASE_64.frontSide, MOCK_KYC_IMAGES_BASE_64.backSide);
      });

      it('should make the request with response type specified', () => {
        shouldResponseTypeText();
      });
    });

    describe('and we request it only with the first image', () => {
      beforeEach(() => {
        service.request(MOCK_KYC_IMAGES_BASE_64_BACK_NULL).subscribe();
      });

      it('should request the KYC', () => {
        shouldRequestTheKYC();
      });

      it('should do a POST petition', () => {
        shouldDoPOSTPetition();
      });

      it('should make the request with second image null and kyc required formed data', () => {
        shouldMakeRequestWithSpecifiedImages(MOCK_KYC_IMAGES_BASE_64_BACK_NULL.frontSide, MOCK_KYC_IMAGES_BASE_64_BACK_NULL.backSide);
      });

      it('should make the request with response type specified', () => {
        shouldResponseTypeText();
      });
    });
  });

  function shouldRequestTheKYC(): void {
    const req: TestRequest = httpMock.expectOne(KYC_ENDPOINT);
    req.flush({});

    expect(req.request.url).toBe(KYC_ENDPOINT);
  }

  function shouldDoPOSTPetition(): void {
    const req: TestRequest = httpMock.expectOne(KYC_ENDPOINT);
    req.flush({});

    expect(req.request.method).toBe('POST');
  }

  function shouldResponseTypeText(): void {
    const req: TestRequest = httpMock.expectOne(KYC_ENDPOINT);
    req.flush({});

    expect(req.request.responseType).toEqual('text');
  }

  function shouldMakeRequestWithSpecifiedImages(frontSideImage: string, backSideImage: string): void {
    const req: TestRequest = httpMock.expectOne(KYC_ENDPOINT);
    req.flush({});

    expect(req.request.body).toEqual(MOCK_KYC_REQUEST_BODY(frontSideImage, backSideImage));
  }
});
