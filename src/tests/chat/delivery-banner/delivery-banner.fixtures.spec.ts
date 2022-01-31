import { DELIVERY_BANNER_ACTION_TYPE } from '@private/features/chat/modules/delivery-banner/enums/delivery-banner-action-type.enum';
import { DELIVERY_BANNER_BUTTON_STYLE } from '@private/features/chat/modules/delivery-banner/enums/delivery-banner-button-style.enum';
import { ActionableDeliveryBanner } from '@private/features/chat/modules/delivery-banner/interfaces/actionable-delivery-banner.interface';
import { DescriptiveDeliveryBanner } from '@private/features/chat/modules/delivery-banner/interfaces/descriptive-delivery-banner.interface';

export const MOCK_DELIVERY_BANNER_BUY_NOW_PROPERTIES: DescriptiveDeliveryBanner & ActionableDeliveryBanner = {
  svgPath: 'assets/icons/joke.svg',
  description: { text: 'Shipping available for 12€', helpLink: 'www.google.com' },
  action: {
    label: 'Buy',
    style: DELIVERY_BANNER_BUTTON_STYLE.CONTAINED,
    type: DELIVERY_BANNER_ACTION_TYPE.OPEN_PAYVIEW,
  },
};
