import { Duration } from '../../../core/item/item-response.interface';
import { Item } from 'shield';

export interface CartItem {
  item: Item;
  duration: Duration;
}

export interface Zonebump {
  total: number;
  cartItems: CartItem[];
  collapsed: boolean;
}
