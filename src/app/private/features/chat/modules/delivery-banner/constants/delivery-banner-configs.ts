import { Money } from '@api/core/model/money.interface';
import { DeliveryBanner } from '@private/features/chat/modules/delivery-banner/interfaces/delivery-banner.interface';
import { DELIVERY_BANNER_TYPE } from '../enums/delivery-banner-type.enum';
import { DELIVERY_BANNER_ACTION } from '../enums/delivery-banner-action.enum';
import { ActionableDeliveryBanner } from '../interfaces/actionable-delivery-banner.interface';
import { PriceableDeliveryBanner } from '../interfaces/priceable-delivery-banner.interface';

export const BUYER_BUY_DELIVERY_BANNER_PROPERTIES = (price: Money): PriceableDeliveryBanner => {
  const bannerProperties: PriceableDeliveryBanner & ActionableDeliveryBanner = {
    type: DELIVERY_BANNER_TYPE.BUY,
    price,
    action: DELIVERY_BANNER_ACTION.OPEN_PAYVIEW,
  };
  return bannerProperties;
};

export const BUYER_ASK_SELLER_FOR_SHIPPING_BANNER_PROPERTIES: DeliveryBanner = {
  type: DELIVERY_BANNER_TYPE.ASK_SELLER_FOR_SHIPPING,
};

export const SELLER_ACTIVATE_SHIPPING_BANNER_PROPERTIES: DeliveryBanner = {
  type: DELIVERY_BANNER_TYPE.ACTIVATE_SHIPPING,
};

export const SELLER_EDIT_PRICE_BANNER_PROPERTIES: DeliveryBanner = {
  type: DELIVERY_BANNER_TYPE.EDIT_PRICE,
};
