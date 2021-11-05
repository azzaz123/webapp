import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import {
  MOCK_REQUESTS_AND_TRANSACTIONS_PENDING_AS_SELLER_DTO_RESPONSE,
  MOCK_REQUESTS_AND_TRANSACTIONS_PENDING_DTO_RESPONSE,
} from '@api/fixtures/bff/delivery/requests-and-transactions/pending/requests-and-transactions-pending.fixtures.spec';
import { RequestsAndTransactionsPendingDto } from '../dtos/responses';
import {
  DELIVERY_REQUESTS_AND_TRANSACTIONS_PENDING_AS_SELLER_ENDPOINT,
  DELIVERY_REQUESTS_AND_TRANSACTIONS_PENDING_ENDPOINT,
} from './endpoints';
import { RequestsAndTransactionsPendingHttpService } from './requests-and-transactions-pending-http.service';

describe('RequestsAndTransactionsPendingHttpService', () => {
  let service: RequestsAndTransactionsPendingHttpService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RequestsAndTransactionsPendingHttpService],
    });
    service = TestBed.inject(RequestsAndTransactionsPendingHttpService);
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
      let response: RequestsAndTransactionsPendingDto;

      service.get().subscribe((data) => (response = data));
      const req: TestRequest = httpMock.expectOne(DELIVERY_REQUESTS_AND_TRANSACTIONS_PENDING_ENDPOINT);
      req.flush(MOCK_REQUESTS_AND_TRANSACTIONS_PENDING_DTO_RESPONSE);

      expect(req.request.method).toBe('GET');
      expect(response).toEqual(MOCK_REQUESTS_AND_TRANSACTIONS_PENDING_DTO_RESPONSE);
    });
  });

  describe('when asking to get the delivery pending transactions as seller', () => {
    it('should get the delivery pending transactions', () => {
      let response: RequestsAndTransactionsPendingDto;

      service.getAsSeller().subscribe((data) => (response = data));
      const req: TestRequest = httpMock.expectOne(DELIVERY_REQUESTS_AND_TRANSACTIONS_PENDING_AS_SELLER_ENDPOINT);
      req.flush(MOCK_REQUESTS_AND_TRANSACTIONS_PENDING_AS_SELLER_DTO_RESPONSE);

      expect(req.request.method).toBe('GET');
      expect(response).toEqual(MOCK_REQUESTS_AND_TRANSACTIONS_PENDING_AS_SELLER_DTO_RESPONSE);
    });
  });
});
