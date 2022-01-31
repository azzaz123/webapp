import { PriceDto } from '@api/core/dtos';

export interface DeliveryBuyerCalculatorCostDto {
  delivery_cost: PriceDto;
  fees: PriceDto;
  product_price: PriceDto;
  total: PriceDto;
}
