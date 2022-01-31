import { Money } from '@api/core/model/money.interface';
import { DELIVERY_BANNER_BUTTON_STYLE } from '@private/features/chat/modules/delivery-banner/enums/delivery-banner-button-style.enum';
import { ActionableDeliveryBanner } from '@private/features/chat/modules/delivery-banner/interfaces/actionable-delivery-banner.interface';
import { DeliveryBanner } from '@private/features/chat/modules/delivery-banner/interfaces/delivery-banner.interface';
import { DescriptiveDeliveryBanner } from '@private/features/chat/modules/delivery-banner/interfaces/descriptive-delivery-banner.interface';

type BuyerBuyDeliveryBannerProperties = DescriptiveDeliveryBanner & ActionableDeliveryBanner;
export const BUYER_BUY_DELIVERY_BANNER_PROPERTIES = (price: Money): BuyerBuyDeliveryBannerProperties => {
  const bannerProperties: BuyerBuyDeliveryBannerProperties = {
    svgPath: 'assets/icons/joke.svg',
    description: { text: `Shipping available for ${price}`, helpLink: 'www.google.com' },
    action: {
      label: 'Buy',
      style: DELIVERY_BANNER_BUTTON_STYLE.CONTAINED,
    },
  };
  return bannerProperties;
};

export const BUYER_ASK_SELLER_FOR_SHIPPING_BANNER_PROPERTIES: DeliveryBanner = {
  svgPath: 'assets/icons/joke.svg',
  description: { text: `Ask seller for shipping` },
};

export const SELLER_ACTIVATE_SHIPPING_BANNER_PROPERTIES: ActionableDeliveryBanner = {
  svgPath: 'assets/icons/joke.svg',
  description: { text: `Ask seller for shipping` },
  action: {
    label: 'Edit',
    style: DELIVERY_BANNER_BUTTON_STYLE.CONTAINED,
  },
};

export const SELLER_EDIT_PRICE_BANNER_PROPERTIES: ActionableDeliveryBanner = {
  svgPath: 'assets/icons/joke.svg',
  description: { text: `Change price` },
  action: {
    label: 'Change',
    style: DELIVERY_BANNER_BUTTON_STYLE.OUTLINED,
  },
};
