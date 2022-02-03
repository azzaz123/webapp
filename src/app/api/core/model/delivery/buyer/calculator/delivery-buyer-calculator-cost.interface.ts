import { Money } from '@api/core/model/money.interface';

export interface DeliveryBuyerCalculatorCost {
  deliveryCost: Money;
  fees: Money;
  productPrice: Money;
  total: Money;
}
