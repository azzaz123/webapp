import { TransactionsHistoryDto } from '@api/delivery/transactions/history/dtos/transactions-history-dto.interface';
import { MOCK_ITEM, MOCK_ITEM_FEATURED } from '@fixtures/item.fixtures.spec';
import { MOCK_USER, MOCK_USER_PRO } from '@fixtures/user.fixtures.spec';

export const MOCK_TRANSACTIONS_HISTORY_DTO: TransactionsHistoryDto = [
  {
    amount: { amount: 19.75, currency: 'EUR' },
    created_at: '2021-10-22T10:57:14Z',
    id: '3b7560cc-b4f8-48bf-ba27-4d070952b3e8',
    item_hash_id: MOCK_ITEM.id,
    transaction_id: 'c86dafde-7f38-4437-8813-d5a6110326d0',
    transaction_status: 'SUCCEEDED',
    transactor_user_hash_id: MOCK_USER.id,
    user_hash_id: MOCK_USER_PRO.id,
  },
  {
    amount: { amount: 12, currency: 'EUR' },
    created_at: '2021-10-22T10:45:55Z',
    id: '001cf831-d040-4e31-b4e7-aa50d2a3cadc',
    item_hash_id: MOCK_ITEM_FEATURED.id,
    transaction_id: '97752a62-5171-46a0-a6c2-1e9e698fd020',
    transaction_status: 'SUCCEEDED',
    transactor_user_hash_id: MOCK_USER.id,
    user_hash_id: MOCK_USER_PRO.id,
  },
];
