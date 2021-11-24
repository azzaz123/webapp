import { SORT_KEYS } from '@api/core/model/subscriptions/items-by-subscription/sort-items.interface';

export const SORT_KEYS_MAPPER: Record<SORT_KEYS, string> = {
  [SORT_KEYS.DATE_DESC]: 'date_desc',
  [SORT_KEYS.DATE_ASC]: 'date_asc',
  [SORT_KEYS.PRICE_DESC]: 'price_desc',
  [SORT_KEYS.PRICE_ASC]: 'price_asc',
};
