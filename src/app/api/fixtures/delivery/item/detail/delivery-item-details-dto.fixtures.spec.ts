import { DeliveryItemDetailsDto } from '@api/bff/delivery/items/detail/dtos/delivery-item-detail-dto.interface';

export const MOCK_DELIVERY_ITEM_DETAILS_DTO: DeliveryItemDetailsDto = {
  buy_now_allowed: true,
  shipping_banner_enabled: true,
  delivery_costs: {
    buyer_address_cost: {
      amount: 2.95,
      currency: 'EUR',
    },
    carrier_office_cost: {
      amount: 2.5,
      currency: 'EUR',
    },
  },
  delivery_times: {
    from: 3,
    to: 7,
  },
  shippable: true,
  shipping_allowed: true,
  call_to_action: 'checkout',
};
