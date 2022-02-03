import { MOCK_MONEY } from '@api/fixtures/core/money.fixtures';
import { BUYER_BUY_DELIVERY_BANNER_PROPERTIES } from '@private/features/chat/modules/delivery-banner/constants/delivery-banner-configs';
import { ActionableDeliveryBanner } from '@private/features/chat/modules/delivery-banner/interfaces/actionable-delivery-banner.interface';
import { PriceableDeliveryBanner } from '@private/features/chat/modules/delivery-banner/interfaces/priceable-delivery-banner.interface';

export const MOCK_DELIVERY_BANNER_BUY_NOW_PROPERTIES: PriceableDeliveryBanner & ActionableDeliveryBanner =
  BUYER_BUY_DELIVERY_BANNER_PROPERTIES(MOCK_MONEY);
