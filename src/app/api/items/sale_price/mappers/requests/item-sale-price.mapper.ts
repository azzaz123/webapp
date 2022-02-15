import { Money } from '@api/core/model/money.interface';
import { ToApiMapper } from '@api/core/utils/types';
import { ItemSalePriceDto } from '../../dtos/requests';

export const mapNewPriceToItemSalePrice: ToApiMapper<Money, ItemSalePriceDto> = (input: Money): ItemSalePriceDto => {
  return {
    currency_code: input.currency.code,
    sale_price: input.amount.total,
  };
};
