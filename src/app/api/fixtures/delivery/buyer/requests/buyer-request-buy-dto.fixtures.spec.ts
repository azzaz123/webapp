import { BuyerRequestBuyDto } from '@api/delivery/buyer/requests/dtos/buyer-request-buy-dto.interface';

export const MOCK_BUYER_REQUEST_BUY_DTO_WITH_BUYER_ADDRESS: BuyerRequestBuyDto = {
  id: '12345',
  item_hash: '54321',
  seller_user_hash: '98765',
  offered_price: {
    amount: 20,
    currency: 'EUR',
  },
  carrier_delivery_mode: 'BUYER_ADDRESS',
};

export const MOCK_BUYER_REQUEST_BUY_DTO_WITH_CARRIER_OFFICE: BuyerRequestBuyDto = {
  ...MOCK_BUYER_REQUEST_BUY_DTO_WITH_BUYER_ADDRESS,
  carrier_delivery_mode: 'CARRIER_OFFICE',
};

export const MOCK_BUYER_REQUEST_BUY_DTO_WITH_CARRIER_OFFICE_AND_PROMOCODE: BuyerRequestBuyDto = {
  ...MOCK_BUYER_REQUEST_BUY_DTO_WITH_CARRIER_OFFICE,
  promocode: 'WALLA',
};
