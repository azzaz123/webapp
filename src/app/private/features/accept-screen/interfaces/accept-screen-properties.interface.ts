import { SellerRequest } from '@api/core/model/delivery/seller-requests/seller-request.interface';
import { AcceptScreenSeller } from './accept-screen-seller.interface';
import { AcceptScreenBuyer } from './accept-screen-buyer.interface';
import { AcceptScreenItem } from './accept-screen-item.interface';

export interface AcceptScreenProperties {
  request: SellerRequest;
  item: AcceptScreenItem;
  buyer: AcceptScreenBuyer;
  seller: AcceptScreenSeller;
}
