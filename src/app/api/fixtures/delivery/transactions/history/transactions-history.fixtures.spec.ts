import { TransactionsHistoryDto } from '@api/delivery/transactions/history/dtos/transactions-history-dto.interface';

export const MOCK_TRANSACTIONS_HISTORY_DTO: TransactionsHistoryDto = [
  {
    amount: { amount: 19.75, currency: 'EUR' },
    created_at: '2021-10-22T10:57:14Z',
    id: '3b7560cc-b4f8-48bf-ba27-4d070952b3e8',
    item_hash_id: 'dqjwmm4eeqzo',
    transaction_id: 'c86dafde-7f38-4437-8813-d5a6110326d0',
    transaction_status: 'SUCCEEDED',
    transactor_user_hash_id: 'p8j32x5e31z9',
    user_hash_id: 'mxzodvxyllj9',
  },
  {
    amount: { amount: 12, currency: 'EUR' },
    created_at: '2021-10-22T10:45:55Z',
    id: '001cf831-d040-4e31-b4e7-aa50d2a3cadc',
    item_hash_id: '4w67qq4337zx',
    transaction_id: '97752a62-5171-46a0-a6c2-1e9e698fd020',
    transaction_status: 'SUCCEEDED',
    transactor_user_hash_id: 'p8j32x5e31z9',
    user_hash_id: 'mxzodvxyllj9',
  },
];
