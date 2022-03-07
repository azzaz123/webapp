import { MOCK_MONEY } from '@api/fixtures/core/money.fixtures';
import { ItemSalePriceDto } from '@api/items/sale_price/dtos/requests';

export const MOCK_ITEM_SALE_PRICE_REQUEST_DTO: ItemSalePriceDto = {
  currency_code: MOCK_MONEY.currency.code,
  sale_price: MOCK_MONEY.amount.total,
};
