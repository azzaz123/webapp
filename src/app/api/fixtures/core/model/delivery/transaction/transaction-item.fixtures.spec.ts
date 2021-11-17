import { TransactionItem } from '@api/core/model';
import { MOCK_ITEM, MOCK_ITEM_FEATURED } from '@fixtures/item.fixtures.spec';

export const MOCK_TRANSACTION_ITEM_1: TransactionItem = {
  id: MOCK_ITEM.id,
  imageUrl: MOCK_ITEM.images[0].urls_by_size.original,
  title: MOCK_ITEM.title,
};

export const MOCK_TRANSACTION_ITEM_2: TransactionItem = {
  id: MOCK_ITEM_FEATURED.id,
  imageUrl: MOCK_ITEM_FEATURED.images[0].urls_by_size.original,
  title: MOCK_ITEM_FEATURED.title,
};
