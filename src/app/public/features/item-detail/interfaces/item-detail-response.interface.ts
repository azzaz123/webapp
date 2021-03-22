import { Car } from '@core/item/car';
import { Item } from '@core/item/item';
import { Realestate } from '@core/item/realestate';
import { User } from '@core/user/user';

export interface ItemDetailResponse {
  item: Item | Car | Realestate;
  user: User;
}
