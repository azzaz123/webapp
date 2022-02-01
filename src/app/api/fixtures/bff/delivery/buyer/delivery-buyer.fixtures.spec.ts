import { DELIVERY_MODE } from '@api/core/model/delivery/delivery-mode.type';
import { DeliveryBuyerDeliveryMethods } from '@api/core/model/delivery/buyer/delivery-methods';
import { DeliveryBuyerDeliveryMethodsDto } from '@api/bff/delivery/buyer/dtos';
import { POST_OFFICE_CARRIER } from '@api/core/model/delivery/post-offices-carriers.type';

export const MOCK_DELIVERY_BUYER_DELIVERY_METHODS_RESPONSE: DeliveryBuyerDeliveryMethodsDto = {
  delivery_methods: [
    {
      method: 'CARRIER_OFFICE',
      icon: 'http://prod-delivery-resources.wallapop.com/Correos.png',
      carrier: 'correos',
      delivery_times: { from: 3, to: 7 },
      last_address_used: {
        id: 'c10c9fa9-9589-4212-991b-43237ac8afd6',
        label: 'NAVARCLES, CATALUNYA, 13, 08270 Navarcles, España',
      },
    },
    {
      method: 'BUYER_ADDRESS',
      icon: 'http://prod-delivery-resources.wallapop.com/default_home.png',
      carrier: null,
      delivery_times: { from: 3, to: 7 },
      last_address_used: {
        id: 'dedfa0ab-d4bd-48da-acf6-f7976d2877d5',
        label: 'calle jtrx 6, 1, 08199 Montserrat, España',
      },
    },
  ],
  default: { index: 1 },
};
export const MOCK_DELIVERY_BUYER_DELIVERY_METHODS: DeliveryBuyerDeliveryMethods = {
  deliveryMethods: [
    {
      method: DELIVERY_MODE.CARRIER_OFFICE,
      icon: 'http://prod-delivery-resources.wallapop.com/Correos.png',
      carrier: POST_OFFICE_CARRIER.CORREOS,
      deliveryTimes: { from: 3, to: 7 },
      lastAddressUsed: {
        id: 'c10c9fa9-9589-4212-991b-43237ac8afd6',
        label: 'NAVARCLES, CATALUNYA, 13, 08270 Navarcles, España',
      },
    },
    {
      method: DELIVERY_MODE.BUYER_ADDRESS,
      icon: 'http://prod-delivery-resources.wallapop.com/default_home.png',
      carrier: null,
      deliveryTimes: { from: 3, to: 7 },
      lastAddressUsed: {
        id: 'dedfa0ab-d4bd-48da-acf6-f7976d2877d5',
        label: 'calle jtrx 6, 1, 08199 Montserrat, España',
      },
    },
  ],
  default: { index: 1 },
};
