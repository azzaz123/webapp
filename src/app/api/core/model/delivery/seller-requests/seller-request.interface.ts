import { Money } from '../../money.interface';
import { SellerRequestBuyerAddress } from './seller-request-buyer-address.interface';
import { SellerRequestPaymentAndRequestStatus } from './seller-request-payment-and-request-status.interface';
import { SellerRequestRevenue } from './seller-request-revenue.interface';

export interface SellerRequest {
  id: string;
  itemHash: string;
  buyerHash: string;
  buyerAddress: SellerRequestBuyerAddress;
  creationDate: Date;
  failReason: SellerRequestPaymentAndRequestStatus;
  offeredPrice: Money;
  sellerRevenue: SellerRequestRevenue;
  status: SellerRequestPaymentAndRequestStatus;
}
