import { TestBed, waitForAsync } from '@angular/core/testing';

import { RequestsAndTransactionsPendingHttpService } from './http/requests-and-transactions-pending-http.service';
import { MOCK_PENDING_TRANSACTIONS } from '@api/fixtures/core/model/delivery/pending-transactions-fixtures.spec';
import { of } from 'rxjs';
import { MOCK_REQUESTS_AND_TRANSACTIONS_PENDING_DTO_RESPONSE } from '@api/fixtures/bff/delivery/requests-and-transactions/pending/requests-and-transactions-pending.fixtures.spec';
import { UserService } from '@core/user/user.service';
import { MockUserService } from '@fixtures/user.fixtures.spec';

describe('GIVEN the RequestsAndTransactionsPendingService', () => {
  class MockTransactionsService {
    get() {
      return of(MOCK_REQUESTS_AND_TRANSACTIONS_PENDING_DTO_RESPONSE);
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
          {
            provide: UserService,
            useValue: MockUserService,
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
