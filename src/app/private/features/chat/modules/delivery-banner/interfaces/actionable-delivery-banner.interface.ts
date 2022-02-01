import { DELIVERY_BANNER_BUTTON_TYPE } from '../enums/delivery-banner-button-type.enum';
import { DeliveryBanner } from './delivery-banner.interface';

export interface ActionableDeliveryBanner extends DeliveryBanner {
  action: {
    label: string;
    type: DELIVERY_BANNER_BUTTON_TYPE;
  };
}
