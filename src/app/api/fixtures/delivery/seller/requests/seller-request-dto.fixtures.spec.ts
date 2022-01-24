import { SellerRequestDto } from '@api/delivery/seller/requests/dtos/seller-request-dto.interface';

export const MOCK_SELLER_REQUEST_DTO: SellerRequestDto = {
  id: '1928192',
  item_hash: 'sas23cdf2323',
  buyer_user_hash: 'usd2y82b3',
  buyer_address: { city: 'Barcelona', country: 'ES' },
  created_at: '2021-10-22T10:57:14Z',
  fail_reason: { payment: 'pending', request: 'cancelled' },
  offered_price: {
    amount: 11,
    currency: 'EUR',
  },
  seller_revenue: {
    delivery_cost: {
      amount: 2,
      currency: 'EUR',
    },
    fees_cost: {
      amount: 1,
      currency: 'EUR',
    },
    item: {
      amount: 11,
      currency: 'EUR',
    },
    total: {
      amount: 14,
      currency: 'EUR',
    },
  },
  status: { payment: 'succeeded', request: 'accepted' },
};
