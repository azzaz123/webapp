import { DeliveriesOngoingAsBuyerDto, DeliveryOngoingBuyerStatusDto } from '@api/bff/delivery/deliveries/ongoing/dtos';

const MOCK_DELIVERY_ONGOING_AS_BUYER_REQUEST_DTO = {
  buyer: {
    hash: '232323',
    image: 'img/perfilLaia.png',
    name: 'Laia',
  },
  item: {
    cost: {
      amount: 66666666,
      currency: 'EUR',
    },
    hash: '23827837283',
    image: '/path/to/icon/thumbsup.svg',
    name: 'Melena Alejandro',
  },
  request_id: '823827329873',
  seller: {
    hash: '987459347',
    image: 'img/perfilToni.png',
    name: 'Toni',
  },
  status: 'REQUEST_CREATED' as DeliveryOngoingBuyerStatusDto,
};

const MOCK_DELIVERY_ONGOING_AS_BUYER_TRANSACTION_DTO = {
  buyer: {
    hash: '232323',
    image: 'img/perfilCarlos.png',
    name: 'Carlos',
  },
  item: {
    cost: {
      amount: 66666666,
      currency: 'EUR',
    },
    hash: '55454545',
    image: '/path/to/icon/thumbsup.svg',
    name: 'Barba Lluís',
  },
  request_id: '8767665655',
  seller: {
    hash: '09787864311',
    image: 'img/perfilGonzalo.png',
    name: 'Gonzalo',
  },
  status: 'ON_HOLD_INSTRUCTIONS_RECEIVED' as DeliveryOngoingBuyerStatusDto,
};

export const MOCK_DELIVERIES_ONGOING_AS_BUYER_DTO_RESPONSE: DeliveriesOngoingAsBuyerDto = {
  ongoing_deliveries: [MOCK_DELIVERY_ONGOING_AS_BUYER_REQUEST_DTO, MOCK_DELIVERY_ONGOING_AS_BUYER_TRANSACTION_DTO],
};
