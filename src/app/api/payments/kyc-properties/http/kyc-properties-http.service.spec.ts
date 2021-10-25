import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { KYCPropertiesApi } from '@api/payments/kyc-properties/dtos/responses';
import { MOCK_KYC_REJECTED_PROPERTIES_API } from '@fixtures/private/wallet/kyc/kyc-properties.fixtures.spec';
import { KYC_PROPERTIES_ENDPOINT } from './endpoints';
import { KYCPropertiesHttpService } from './kyc-properties-http.service';

describe('KYCPropertiesHttpService', () => {
  let service: KYCPropertiesHttpService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [KYCPropertiesHttpService],
    });
    service = TestBed.inject(KYCPropertiesHttpService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when requesting the kyc properties...', () => {
    it('should call to the backend service', () => {
      service.get().subscribe();
      const req: TestRequest = httpMock.expectOne(KYC_PROPERTIES_ENDPOINT);
      req.flush({});

      expect(req.request.url).toEqual(KYC_PROPERTIES_ENDPOINT);
      expect(req.request.method).toBe('GET');
    });

    it('should get the kyc properties ', () => {
      let response: KYCPropertiesApi;

      service.get().subscribe((data: KYCPropertiesApi) => {
        response = data;
      });
      const req: TestRequest = httpMock.expectOne(KYC_PROPERTIES_ENDPOINT);
      req.flush(MOCK_KYC_REJECTED_PROPERTIES_API);

      expect(response).toEqual(MOCK_KYC_REJECTED_PROPERTIES_API);
    });
  });
});
