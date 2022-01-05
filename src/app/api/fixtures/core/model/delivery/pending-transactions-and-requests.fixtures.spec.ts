import { PendingTransactionsAndRequests } from '@api/core/model/delivery';
import { MOCK_PENDING_TRANSACTIONS } from './pending-transactions-fixtures.spec';
import { MOCK_PENDING_REQUEST_AS_BUYER } from './requests.fixtures.spec';

export const MOCK_PENDING_TRANSACTIONS_AND_REQUESTS: PendingTransactionsAndRequests = {
  requests: [MOCK_PENDING_REQUEST_AS_BUYER],
  transactions: MOCK_PENDING_TRANSACTIONS,
};

export const MOCK_EMPTY_PENDING_TRANSACTIONS_AND_REQUESTS: PendingTransactionsAndRequests = {
  requests: [],
  transactions: [],
};
