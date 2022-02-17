import { mapNumberAndCurrencyCodeToMoney } from '@api/core/mappers';
import { DeliveryItemDetails } from '@api/core/model/delivery/item-detail/delivery-item-details.interface';

export const MOCK_DELIVERY_ITEM_DETAILS: DeliveryItemDetails = {
  minimumPurchaseCost: mapNumberAndCurrencyCodeToMoney({ number: 2.5, currency: 'EUR' }),
  isShippingAllowed: true,
};

export const MOCK_DELIVERY_ITEM_DETAILS_SHIPPING_DISABLED: DeliveryItemDetails = {
  minimumPurchaseCost: null,
  isShippingAllowed: false,
};
