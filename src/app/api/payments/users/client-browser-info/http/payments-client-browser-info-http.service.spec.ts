import { HttpTestingController, HttpClientTestingModule, TestRequest } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MOCK_PAYMENTS_CLIENT_BROWSER_INFO } from '@api/fixtures/core/model/payments/payments-client-browser-info.fixtures.spec';
import { MOCK_PAYMENTS_CLIENT_BROWSER_INFO_DTO } from '@api/fixtures/payments/users/client-browser-info/payments-client-browser-info.fixtures.spec';
import { PAYMENTS_CLIENT_BROWSER_INFO_ENDPOINT } from './endpoints';
import { PaymentsClientBrowserInfoHttpService } from './payments-client-browser-info-http.service';

describe('PaymentsClientBrowserInfoHttpService', () => {
  let service: PaymentsClientBrowserInfoHttpService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PaymentsClientBrowserInfoHttpService],
    });
    service = TestBed.inject(PaymentsClientBrowserInfoHttpService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('when asking to put client browser information to server', () => {
    it('should send information to the server', () => {
      service.put(MOCK_PAYMENTS_CLIENT_BROWSER_INFO).subscribe();
      const req: TestRequest = httpMock.expectOne(PAYMENTS_CLIENT_BROWSER_INFO_ENDPOINT);
      req.flush(null);

      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(MOCK_PAYMENTS_CLIENT_BROWSER_INFO_DTO);
    });
  });
});
