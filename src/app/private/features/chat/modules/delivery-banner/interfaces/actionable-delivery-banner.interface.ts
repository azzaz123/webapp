import { DELIVERY_BANNER_BUTTON_STYLE as DELIVERY_BANNER_BUTTON_STYLE } from '../enums/delivery-banner-button-style.enum';
import { DeliveryBanner } from './delivery-banner.interface';

export interface ActionableDeliveryBanner extends DeliveryBanner {
  action: {
    label: string;
    style: DELIVERY_BANNER_BUTTON_STYLE;
  };
}
