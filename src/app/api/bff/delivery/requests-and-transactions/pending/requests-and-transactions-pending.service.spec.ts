import { TestBed, waitForAsync } from '@angular/core/testing';

import { MOCK_PENDING_TRANSACTIONS } from '@api/fixtures/core/pending-transactions-fixtures.spec';
import { MOCK_REQUESTS_AND_TRANSACTIONS_PENDING_AS_SELLER_API } from '@api/fixtures/bff/delivery/requests-and-transactions/pending-as-seller/pending-as-seller.fixtures.spec';
import { RequestsAndTransactionsPendingHttpService } from './http/requests-and-transactions-pending-http.service';

import { of } from 'rxjs';

describe('GIVEN the RequestsAndTransactionsPendingService', () => {
  class MockTransactionsService {
    get() {
      return of(MOCK_REQUESTS_AND_TRANSACTIONS_PENDING_AS_SELLER_API);
    }
  }
  let mockTransactionsService: MockTransactionsService = new MockTransactionsService();
  let service: RequestsAndTransactionsPendingHttpService;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [],
        providers: [
          {
            provide: RequestsAndTransactionsPendingHttpService,
            useValue: mockTransactionsService,
          },
        ],
      });
      service = TestBed.inject(RequestsAndTransactionsPendingHttpService);
    })
  );

  describe('WHEN they try to create an instance', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });
  });

  describe('WHEN they ask for the pending transactions', () => {
    it('should call to the transactions http service', () => {
      const spy = spyOn(mockTransactionsService, 'get').and.callThrough();

      service.get();

      expect(spy).toBeCalledTimes(1);
    });

    it('should receive a collection of pending transactions', () => {
      const subscription = service.get();

      subscription.subscribe((result) => {
        expect(result).toEqual(MOCK_PENDING_TRANSACTIONS);
      });
    });
  });
});
