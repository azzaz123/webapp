import { DELIVERY_BANNER_ACTION } from '../enums/delivery-banner-action.enum';
import { DeliveryBanner } from './delivery-banner.interface';

export interface ActionableDeliveryBanner extends DeliveryBanner {
  action: DELIVERY_BANNER_ACTION;
}
