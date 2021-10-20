import { RequestsAndTransactionsPendingAsSellerApi } from '@api/bff/delivery/requests-and-transactions/pending-as-seller/dtos/responses';

export const MOCK_REQUESTS_AND_TRANSACTIONS_PENDING_AS_SELLER_API: RequestsAndTransactionsPendingAsSellerApi = {
  requests: [],
  transactions: [
    {
      id: '81891bfa-9df3-41f9-9411-0cd85d1daf9e',
      item_hash: 'kmzn9dmg4kjn',
      item_cost: { amount: 3, currency: 'EUR' },
      item_name: 'Laia testing beta',
      item_image: 'http://cdn-beta.wallapop.com/images/10420/34/ow/__/c10420p189278801/i420098101.jpg?pictureSize=W800',
      buyer_user_hash: 'mxzo7qgdvlj9',
      buyer_user_name: 'Generisius M.',
      buyer_user_image: 'http://cdn-beta.wallapop.com/images/13/19/ok/__/c13p76729033/i420346101.jpg?pictureSize=W800',
      seller_user_hash: 'npj9v2o98m6e',
      seller_user_name: 'Dimasiado P.',
      seller_user_image: 'http://cdn-beta.wallapop.com/images/13/1a/7c/__/c13p77605037/i419166102.jpg?pictureSize=W800',
      status: 'pending',
      delivery_status: 'in transit',
      payment_status: 'pay in succeeded',
      dispute_status: null,
      payment_error: null,
      carrier_delivery_mode: 'buyer address',
      carrier_drop_off_mode: 'POST_OFFICE',
      carrier: 'correos',
      kyc_status: 'pending',
    },
  ],
};
