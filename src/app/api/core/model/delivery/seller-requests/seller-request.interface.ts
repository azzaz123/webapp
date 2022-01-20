import { Money } from '../../money.interface';
import { SellerRequestBuyer } from './seller-request-buyer.interface';
import { SellerRequestPaymentAndRequestStatus } from './seller-request-payment-and-request-status.interface';
import { SellerRequestRevenue } from './seller-request-revenue.interface';

export interface SellerRequest {
  id: string;
  itemId: string;
  buyer: SellerRequestBuyer;
  creationDate: Date;
  failReason: SellerRequestPaymentAndRequestStatus;
  offeredPrice: Money;
  sellerRevenue: SellerRequestRevenue;
  status: SellerRequestPaymentAndRequestStatus;
}
