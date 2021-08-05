import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { UuidService } from '@core/uuid/uuid.service';
import { MOCK_KYC_IMAGES_BASE_64 } from '@fixtures/private/wallet/kyc/kyc.fixtures.spec';
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
      service.request(MOCK_KYC_IMAGES_BASE_64).subscribe();
    });

    it('should request the KYC with the specified images', () => {
      const req: TestRequest = httpMock.expectOne(KYC_ENDPOINT);
      req.flush({});

      expect(req.request.url).toBe(KYC_ENDPOINT);
    });

    it('should do a POST petition', () => {
      const req: TestRequest = httpMock.expectOne(KYC_ENDPOINT);
      req.flush({});

      expect(req.request.method).toBe('POST');
    });

    it('should make the request with kyc required formed data', () => {
      const req: TestRequest = httpMock.expectOne(KYC_ENDPOINT);
      req.flush({});

      expect(req.request.body).toEqual(getBodyAsFormData());
    });

    it('should make the request with response type specified', () => {
      const req: TestRequest = httpMock.expectOne(KYC_ENDPOINT);
      req.flush({});

      expect(req.request.responseType).toEqual('text');
    });
  });
});

function getBlobFromBase64JPEGImage(dataURI: string): Blob {
  let rawBinary: string;
  if (dataURI.split(',')[0].indexOf('base64') >= 0) rawBinary = atob(dataURI.split(',')[1]);
  else rawBinary = unescape(dataURI.split(',')[1]);

  const blobPart: Uint8Array = new Uint8Array(rawBinary.length);
  for (let i = 0; i < rawBinary.length; i++) {
    blobPart[i] = rawBinary.charCodeAt(i);
  }

  return new Blob([blobPart], { type: 'image/jpeg' });
}

function getRequestIdAsBlob(): Blob {
  return new Blob([JSON.stringify({ id: '1-2' })], { type: 'application/json' });
}

function getBodyAsFormData(): FormData {
  const body = {
    firstImage: getBlobFromBase64JPEGImage(MOCK_KYC_IMAGES_BASE_64.frontSide),
    secondImage: getBlobFromBase64JPEGImage(MOCK_KYC_IMAGES_BASE_64.backSide),
    request: getRequestIdAsBlob(),
  };
  const bodyAsQueryParams: FormData = new FormData();
  Object.keys(body).forEach((key: string) => bodyAsQueryParams.append(key, body[key]));

  return bodyAsQueryParams;
}
