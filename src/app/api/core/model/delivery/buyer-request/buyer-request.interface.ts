import { BUYER_REQUEST_PAYMENT_STATUS } from './status/buyer-payment-status.enum';
import { BUYER_REQUEST_STATUS } from './status/buyer-request-status.enum';

export interface BuyerRequest {
  id: string;
  itemHash: string;
  status: {
    request: BUYER_REQUEST_STATUS;
    payment: BUYER_REQUEST_PAYMENT_STATUS;
  };
}
