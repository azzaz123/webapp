import { Money } from '../../money.interface';

export interface DeliveryItemDetails {
  minimumPurchaseCost: Money | null;
  isShippingAllowed: boolean;
  isShippable: boolean;
}
