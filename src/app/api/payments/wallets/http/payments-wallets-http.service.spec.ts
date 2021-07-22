import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MOCK_PAYMENTS_WALLETS_RESPONSE } from '@api/fixtures/payments/wallets/payments-wallets.fixtures.spec';
import { PaymentsWalletsApi } from '../dtos/responses';
import { PAYMENTS_WALLETS_ENDPOINT } from './endpoints';
import { PaymentsWalletsHttpService } from './payments-wallets-http.service';

describe('PaymentsWalletsHttpService', () => {
  let service: PaymentsWalletsHttpService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PaymentsWalletsHttpService],
    });
    service = TestBed.inject(PaymentsWalletsHttpService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('when asking to get the Wallet information', () => {
    it('should get the Wallet information', () => {
      let response: PaymentsWalletsApi;

      service.get().subscribe((data) => (response = data));
      const req: TestRequest = httpMock.expectOne(PAYMENTS_WALLETS_ENDPOINT);
      req.flush(MOCK_PAYMENTS_WALLETS_RESPONSE);

      expect(req.request.method).toBe('GET');
      expect(response).toEqual(MOCK_PAYMENTS_WALLETS_RESPONSE);
    });
  });
});
