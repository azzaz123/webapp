import { mapRequestsAndTransactionsPendingToPendingBalance } from './requests-and-transactions-pending.mapper';
import { MOCK_PENDING_TRANSACTIONS } from '@api/fixtures/core/pending-transactions-fixtures.spec';
import { MOCK_REQUESTS_AND_TRANSACTIONS_PENDING_AS_SELLER_API } from '@api/fixtures/bff/delivery/requests-and-transactions/pending-as-seller/pending-as-seller.fixtures.spec';

describe('GIVEN mapRequestsAndTransactionsPendingToPendingBalance', () => {
  describe('WHEN there is a collection of RequestsAndTransactionsPendingApi', () => {
    it('should map to a collection of PendingTransactions', () => {
      const expected = MOCK_PENDING_TRANSACTIONS;

      const result = mapRequestsAndTransactionsPendingToPendingBalance(MOCK_REQUESTS_AND_TRANSACTIONS_PENDING_AS_SELLER_API);

      expect(JSON.stringify(result)).toEqual(JSON.stringify(expected));
    });
  });
  describe('WHEN there is not a collection of RequestsAndTransactionsPendingApi', () => {
    it('should map to an empty collection', () => {
      const expected = [];

      const result = mapRequestsAndTransactionsPendingToPendingBalance(null);

      expect(result).toEqual(expected);
    });
  });
});
