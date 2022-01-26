import { DeliveryBanner } from './delivery-banner.interface';

export interface DescriptiveDeliveryBanner extends DeliveryBanner {
  description: {
    text: string;
    helpLink: string;
  };
}
