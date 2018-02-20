import { Duration } from '../../../core/item/item-response.interface';
import { Item } from 'shield';

export interface CartItem {
  item: Item;
  duration: Duration;
}

export interface CartItems {
  zonebump: CartItem[];
  citybump: CartItem[];
  countrybump: CartItem[];
}
