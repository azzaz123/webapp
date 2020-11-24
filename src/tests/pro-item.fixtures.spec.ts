import { CartProItem } from '../app/shared/catalog/cart/cart-item.interface';
import { MOCK_ITEM_V3, MOCK_ITEM_V3_2 } from './item.fixtures.spec';
import { MOCK_SELECTED_DATES } from './calendar.fixtures.spec';
import { OrderPro } from '../app/core/item/item-response.interface';

export const MOCK_PROITEM: CartProItem = {
  item: MOCK_ITEM_V3,
  selectedDates: MOCK_SELECTED_DATES,
};

export const MOCK_PROITEM2: CartProItem = {
  item: MOCK_ITEM_V3_2,
  selectedDates: MOCK_SELECTED_DATES,
};

export const MOCK_PROITEM3: CartProItem = {
  item: MOCK_ITEM_V3,
  selectedDates: MOCK_SELECTED_DATES,
  bumpType: 'citybump',
};

export const CART_ORDER_PRO: OrderPro[] = [
  {
    item_id: MOCK_PROITEM.item.id,
    start_date: 1525730400000,
    end_date: 1527112800000,
    autorenew: false,
    bump: true,
    national: false,
  },
  {
    item_id: MOCK_PROITEM2.item.id,
    start_date: 1525730400000,
    end_date: 1527112800000,
    autorenew: false,
    bump: false,
    national: true,
  },
];
