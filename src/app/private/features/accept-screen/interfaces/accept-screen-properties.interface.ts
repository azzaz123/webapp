import { SellerRequest } from '@api/core/model/delivery/seller-requests/seller-request.interface';
import { Item } from '@core/item/item';
import { User } from '@core/user/user';

export interface AcceptScreenProperties {
  request: SellerRequest;
  item: Item;
  buyer: User;
  seller: User;
}
