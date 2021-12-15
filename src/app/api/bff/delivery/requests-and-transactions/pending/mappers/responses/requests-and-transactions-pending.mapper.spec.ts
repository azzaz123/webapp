import { mapRequestsAndTransactionsPendingToPendingTransactionsAndRequests } from './requests-and-transactions-pending.mapper';
import {
  MOCK_REQUESTS_AND_TRANSACTIONS_PENDING_AS_SELLER_DTO_RESPONSE,
  MOCK_REQUESTS_AND_TRANSACTIONS_PENDING_DTO_RESPONSE,
} from '@api/fixtures/bff/delivery/requests-and-transactions/pending/requests-and-transactions-pending.fixtures.spec';
import { MockUser } from '@fixtures/user.fixtures.spec';
import {
  MOCK_EMPTY_PENDING_TRANSACTIONS_AND_REQUESTS,
  MOCK_PENDING_TRANSACTIONS_AND_REQUESTS,
} from '@api/fixtures/core/model/delivery/pending-transactions-and-requests.fixtures.spec';

describe('mapRequestsAndTransactionsPendingToPendingTransactions', () => {
  describe('when mapping requests and transactions response from server', () => {
    it('should convert data into web context', () => {
      const expected = MOCK_PENDING_TRANSACTIONS_AND_REQUESTS;

      const result = mapRequestsAndTransactionsPendingToPendingTransactionsAndRequests({
        dtoResponse: MOCK_REQUESTS_AND_TRANSACTIONS_PENDING_DTO_RESPONSE,
        currentUserId: MockUser.id,
      });

      expect(JSON.stringify(result)).toEqual(JSON.stringify(expected));
    });
  });

  describe('when mapping requests and transactions (pending as a seller) response from server', () => {
    it('should convert data into web context', () => {
      const expected = MOCK_PENDING_TRANSACTIONS_AND_REQUESTS;

      const result = mapRequestsAndTransactionsPendingToPendingTransactionsAndRequests({
        dtoResponse: MOCK_REQUESTS_AND_TRANSACTIONS_PENDING_AS_SELLER_DTO_RESPONSE,
        currentUserId: MockUser.id,
      });

      expect(JSON.stringify(result)).toEqual(JSON.stringify(expected));
    });
  });

  describe('when mapping an undefined value from server', () => {
    it('should map to an empty collection', () => {
      const expected = MOCK_EMPTY_PENDING_TRANSACTIONS_AND_REQUESTS;

      const result = mapRequestsAndTransactionsPendingToPendingTransactionsAndRequests(null);

      expect(result).toEqual(expected);
    });
  });
});
