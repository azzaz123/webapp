import { SELLER_PAYMENT_STATUS } from './status/seller-payment-status.enum';
import { SELLER_REQUEST_STATUS } from './status/seller-request-status.enum';

export interface SellerRequestPaymentAndRequestStatus {
  payment: SELLER_PAYMENT_STATUS;
  request: SELLER_REQUEST_STATUS;
}
