import { mapRequestsAndTransactionsPendingToPendingTransactions } from './requests-and-transactions-pending.mapper';
import { MOCK_PENDING_TRANSACTIONS } from '@api/fixtures/core/pending-transactions-fixtures.spec';
import {
  MOCK_REQUESTS_AND_TRANSACTIONS_PENDING_AS_SELLER_DTO_RESPONSE,
  MOCK_REQUESTS_AND_TRANSACTIONS_PENDING_DTO_RESPONSE,
} from '@api/fixtures/bff/delivery/requests-and-transactions/pending/requests-and-transactions-pending.fixtures.spec';

describe('mapRequestsAndTransactionsPendingToPendingTransactions', () => {
  describe('when mapping requests and transactions response from server', () => {
    it('should convert data into web context', () => {
      const expected = MOCK_PENDING_TRANSACTIONS;

      const result = mapRequestsAndTransactionsPendingToPendingTransactions(MOCK_REQUESTS_AND_TRANSACTIONS_PENDING_DTO_RESPONSE);

      expect(JSON.stringify(result)).toEqual(JSON.stringify(expected));
    });
  });

  describe('when mapping requests and transactions response from server', () => {
    it('should convert data into web context', () => {
      const expected = MOCK_PENDING_TRANSACTIONS;

      const result = mapRequestsAndTransactionsPendingToPendingTransactions(MOCK_REQUESTS_AND_TRANSACTIONS_PENDING_AS_SELLER_DTO_RESPONSE);

      expect(JSON.stringify(result)).toEqual(JSON.stringify(expected));
    });
  });

  describe('when mapping an undefined value from server', () => {
    it('should map to an empty collection', () => {
      const expected = [];

      const result = mapRequestsAndTransactionsPendingToPendingTransactions(null);

      expect(result).toEqual(expected);
    });
  });
});
