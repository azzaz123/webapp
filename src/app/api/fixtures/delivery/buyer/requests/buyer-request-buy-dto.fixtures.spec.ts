import { BuyerRequestBuyDto } from '@api/delivery/buyer/requests/dtos/buyer-request-buy-dto.interface';

export const MOCK_BUYER_REQUEST_BUY_DTO_WITH_BUYER_ADDRESS: BuyerRequestBuyDto = {
  id: '12345',
  item_hash: 'p61v99q1rx65',
  seller_user_hash: 'v4z4rv0lx86y',
  offered_price: {
    amount: 63,
    currency: 'EUR',
  },
  carrier_delivery_mode: 'BUYER_ADDRESS',
};

export const MOCK_BUYER_REQUEST_BUY_DTO_WITH_CARRIER_OFFICE: BuyerRequestBuyDto = {
  ...MOCK_BUYER_REQUEST_BUY_DTO_WITH_BUYER_ADDRESS,
  carrier_delivery_mode: 'CARRIER_OFFICE',
};

export const MOCK_BUYER_REQUEST_BUY_DTO_WITH_BUYER_ADDRESS_AND_PROMOCODE: BuyerRequestBuyDto = {
  ...MOCK_BUYER_REQUEST_BUY_DTO_WITH_BUYER_ADDRESS,
  promocode: 'fakepromocode123321',
};
