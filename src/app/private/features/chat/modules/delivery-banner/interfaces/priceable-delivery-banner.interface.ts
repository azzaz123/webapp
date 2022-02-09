import { Money } from '@api/core/model/money.interface';
import { DeliveryBanner } from './delivery-banner.interface';

export interface PriceableDeliveryBanner extends DeliveryBanner {
  price: Money;
}
