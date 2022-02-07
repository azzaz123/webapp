import { SellerRequestAcceptPostOfficeDropOffDto } from '@api/delivery/seller/requests/dtos/seller-request-accept-post-office-drop-off-dto.interface';

export const MOCK_SELLER_REQUEST_ACCEPT_POST_OFFICE_DROP_OFF_DTO: SellerRequestAcceptPostOfficeDropOffDto = {
  buyer_address: {
    city: 'Barcelona',
    country: 'ES',
    region: 'Barcelona',
  },
  buyer_cost: {
    delivery: {
      amount: 13.95,
      currency: 'EUR',
    },
    fees: {
      amount: 6.03,
      currency: 'EUR',
    },
    item: {
      amount: 56.7,
      currency: 'EUR',
    },
    total: {
      amount: 76.68,
      currency: 'EUR',
    },
  },
  buyer_cost_promotion: {
    delivery_cost_discount_percentage: 2,
    fees_discount_percentage: 3,
    original_buyer_cost: {
      delivery: {
        amount: 13.95,
        currency: 'EUR',
      },
      fees: {
        amount: 6.03,
        currency: 'EUR',
      },
      item: {
        amount: 56.7,
        currency: 'EUR',
      },
      total: {
        amount: 76.68,
        currency: 'EUR',
      },
    },
  },
  buyer_user_hash_id: 'abc123',
  carrier_tag: '2',
  created_at: '2022-01-19T10:50:59Z',
  deliver_to_carrier_deadline_date: '2021-12-23T16:14:28Z',
  fail_reason: {
    delivery: null,
    payment: null,
    transaction: null,
  },
  id: 'abcd1234',
  item_hash_id: 'abcde12345',
  item_price: {
    amount: 56.7,
    currency: 'EUR',
  },
  request_id: 'zxc987',
  seller_address: {
    city: 'Barcelona',
    country: 'ES',
    region: 'Barcelona',
  },
  seller_revenue: {
    delivery_cost: {
      amount: 2.7,
      currency: 'EUR',
    },
    fees_cost: {
      amount: 1.7,
      currency: 'EUR',
    },
    item: {
      amount: 56.7,
      currency: 'EUR',
    },
    total: {
      amount: 61.1,
      currency: 'EUR',
    },
  },
  seller_user_hash_id: 'abcdefg1234567',
  status: {
    delivery: 'pending registration',
    payment: 'pending pay in',
    transaction: 'pending',
  },
};
