import { TransactionUser } from '@api/core/model';
import { MOCK_USER, MOCK_USER_PRO } from '@fixtures/user.fixtures.spec';

export const MOCK_TRANSACTION_USER_1: TransactionUser = {
  id: MOCK_USER.id,
  imageUrl: MOCK_USER.image.urls_by_size.original,
  name: MOCK_USER.microName,
};

export const MOCK_TRANSACTION_USER_2: TransactionUser = {
  id: MOCK_USER_PRO.id,
  imageUrl: MOCK_USER_PRO.image.urls_by_size.original,
  name: MOCK_USER_PRO.microName,
};
