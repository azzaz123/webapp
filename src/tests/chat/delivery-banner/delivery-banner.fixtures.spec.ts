import { DELIVERY_BANNER_ACTION_TYPE } from '@private/features/chat/modules/delivery-banner/enums/delivery-banner-action-type.enum';
import { DELIVERY_BANNER_BUTTON_STYLE } from '@private/features/chat/modules/delivery-banner/enums/delivery-banner-button-style.enum';
import { ActionableDeliveryBanner } from '@private/features/chat/modules/delivery-banner/interfaces/actionable-delivery-banner.interface';
import { DeliveryBanner } from '@private/features/chat/modules/delivery-banner/interfaces/delivery-banner.interface';
import { DescriptiveDeliveryBanner } from '@private/features/chat/modules/delivery-banner/interfaces/descriptive-delivery-banner.interface';

export const MOCK_DELIVERY_BANNER: DeliveryBanner = {
  svgPath: 'assets/icon/money.svg',
  description: { text: 'Buy now all iPhones from Alex' },
};

export const MOCK_DESCRIPTIVE_DELIVERY_BANNER: DescriptiveDeliveryBanner = {
  svgPath: 'assets/icon/money.svg',
  description: {
    text: 'Oh no, dont do it',
    helpLink: 'https://wwww.adoptauniphone.com/',
  },
};

export const MOCK_ACTIONABLE_DELIVERY_BANNER: ActionableDeliveryBanner = {
  svgPath: 'assets/icon/cookie.svg',
  description: {
    text: 'Click here for a free cookie!',
  },
  action: {
    label: 'Click me!',
    type: DELIVERY_BANNER_ACTION_TYPE.AWARENESS_MODAL,
    style: DELIVERY_BANNER_BUTTON_STYLE.CONTAINED,
  },
};

export const MOCK_DELIVERY_BANNER_BUY_NOW_PROPERTIES: DescriptiveDeliveryBanner & ActionableDeliveryBanner = {
  svgPath: 'assets/icons/joke.svg',
  description: { text: 'Shipping available for 12€', helpLink: 'www.google.com' },
  action: {
    label: 'Buy',
    style: DELIVERY_BANNER_BUTTON_STYLE.CONTAINED,
    type: DELIVERY_BANNER_ACTION_TYPE.OPEN_PAYVIEW,
  },
};
