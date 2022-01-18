import { Money } from '../../money.interface';

export interface SellerRequestRevenue {
  deliveryCost: Money;
  feesCost: Money;
  itemPrice: Money;
  totalPrice: Money;
}
