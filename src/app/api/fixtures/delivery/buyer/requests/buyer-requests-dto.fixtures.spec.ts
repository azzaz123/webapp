import { BuyerRequestsDto } from '@api/delivery/buyer/requests/dtos/buyer-request-dto.interface';

export const MOCK_BUYER_REQUESTS_DTO: BuyerRequestsDto = [
  {
    id: '0bcf6d92-4b8a-4ac4-a74c-67246845f447',
    item_hash: '9jdxdd2rylzk',
    seller_user_hash: '8x6qnq34oe6y',
    offered_price: { amount: 1.0, currency: 'EUR' },
    buyer_cost: {
      item: { amount: 1.0, currency: 'EUR' },
      delivery: { amount: 2.5, currency: 'EUR' },
      fees: { amount: 1.95, currency: 'EUR' },
      total: { amount: 5.45, currency: 'EUR' },
    },
    buyer_cost_promotion: null,
    status: { request: 'rejected', payment: 'succeeded' },
    fail_reason: { request: null, payment: null },
    created_at: '2022-01-19T10:50:59Z',
  },
  {
    id: 'cc9c2911-e068-4404-b579-baadda664693',
    item_hash: '9jdxdd2rylzk',
    seller_user_hash: '8x6qnq34oe6y',
    offered_price: { amount: 1.0, currency: 'EUR' },
    buyer_cost: {
      item: { amount: 1.0, currency: 'EUR' },
      delivery: { amount: 2.5, currency: 'EUR' },
      fees: { amount: 1.95, currency: 'EUR' },
      total: { amount: 5.45, currency: 'EUR' },
    },
    buyer_cost_promotion: null,
    status: { request: 'expired', payment: 'succeeded' },
    fail_reason: { request: null, payment: null },
    created_at: '2021-12-23T16:14:28Z',
  },
  {
    id: 'bc95d542-517c-4850-aea0-91de4162232a',
    item_hash: '9jdxdd2rylzk',
    seller_user_hash: '8x6qnq34oe6y',
    offered_price: { amount: 1.0, currency: 'EUR' },
    buyer_cost: {
      item: { amount: 1.0, currency: 'EUR' },
      delivery: { amount: 2.5, currency: 'EUR' },
      fees: { amount: 1.95, currency: 'EUR' },
      total: { amount: 5.45, currency: 'EUR' },
    },
    buyer_cost_promotion: null,
    status: { request: 'accepted', payment: 'succeeded' },
    fail_reason: { request: null, payment: null },
    created_at: '2021-12-23T16:10:42Z',
  },
];
