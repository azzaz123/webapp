import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MOCK_REQUESTS_AND_TRANSACTIONS_PENDING_AS_SELLER_API } from '@api/fixtures/bff/delivery/requests-and-transactions/pending-as-seller/pending-as-seller.fixtures.spec';
import { RequestsAndTransactionsPendingAsSellerApi } from '../dtos/responses';
import { DELIVERY_REQUESTS_AND_TRANSACTIONS_PENDING_AS_SELLER } from './endpoints';
import { RequestsAndTransactionsPendingAsSellerHttpService } from './requests-and-transactions-pending-as-seller-http.service';

describe('RequestsAndTransactionsPendingAsSellerHttpService', () => {
  let service: RequestsAndTransactionsPendingAsSellerHttpService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RequestsAndTransactionsPendingAsSellerHttpService],
    });
    service = TestBed.inject(RequestsAndTransactionsPendingAsSellerHttpService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('when asking to get the delivery pending transactions', () => {
    it('should get the delivery pending transactions', () => {
      let response: RequestsAndTransactionsPendingAsSellerApi;

      service.get().subscribe((data) => (response = data));
      const req: TestRequest = httpMock.expectOne(DELIVERY_REQUESTS_AND_TRANSACTIONS_PENDING_AS_SELLER);
      req.flush(MOCK_REQUESTS_AND_TRANSACTIONS_PENDING_AS_SELLER_API);

      expect(req.request.method).toBe('GET');
      expect(response).toEqual(MOCK_REQUESTS_AND_TRANSACTIONS_PENDING_AS_SELLER_API);
    });
  });
});
