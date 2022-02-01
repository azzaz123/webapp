import { mapNumberAndCurrencyCodeToMoney } from '@api/core/mappers';
import { DeliveryItemDetails } from '@api/core/model/delivery/item-detail/delivery-item-details.interface';

export const MOCK_DELIVERY_ITEM_DETAILS: DeliveryItemDetails = {
  minimumPurchaseCost: mapNumberAndCurrencyCodeToMoney({ number: 2.5, currency: 'EUR' }),
};
