import { DELIVERY_BANNER_BUTTON_TYPE } from '@private/features/chat/modules/delivery-banner/enums/delivery-banner-button-type.enum';
import { ActionableDeliveryBanner } from '@private/features/chat/modules/delivery-banner/interfaces/actionable-delivery-banner.interface';
import { DescriptiveDeliveryBanner } from '@private/features/chat/modules/delivery-banner/interfaces/descriptive-delivery-banner.interface';

export const MOCK_BUY_NOW_BANNER_PROPERTIES: DescriptiveDeliveryBanner & ActionableDeliveryBanner = {
  svgPath: 'assets/icons/.svg',
  description: { text: 'Shipping available for 12€', helpLink: 'www.google.com' },
  action: {
    label: 'Buy',
    type: DELIVERY_BANNER_BUTTON_TYPE.CONTAINED,
  },
};
