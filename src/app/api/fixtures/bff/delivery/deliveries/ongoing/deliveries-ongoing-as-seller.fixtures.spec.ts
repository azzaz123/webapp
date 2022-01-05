import { DeliveriesOngoingAsSellerDto, DeliveryOngoingSellerStatusDto } from '@api/bff/delivery/deliveries/ongoing/dtos';

const MOCK_DELIVERY_ONGOING_AS_SELLER_TRANSACTION_DTO = {
  buyer: {
    hash: '4444444',
    image: 'img/perfilLaia.png',
    name: 'Laia',
  },
  item: {
    cost: {
      amount: 2221,
      currency: 'EUR',
    },
    hash: '777',
    image: '/path/to/icon/thumbsup.svg',
    name: 'Barba Lluís',
  },
  request_id: '22222',
  seller: {
    hash: '666',
    image: 'img/perfilGonzalo.png',
    name: 'Gonzalo',
  },
  status: 'TRANSACTION_ERROR' as DeliveryOngoingSellerStatusDto,
};

export const MOCK_DELIVERIES_ONGOING_AS_SELLER_DTO_RESPONSE: DeliveriesOngoingAsSellerDto = {
  ongoing_deliveries: [MOCK_DELIVERY_ONGOING_AS_SELLER_TRANSACTION_DTO],
};
