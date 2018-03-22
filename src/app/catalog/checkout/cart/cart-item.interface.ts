import { Duration } from '../../../core/item/item-response.interface';
import { Cart } from './cart';
import { Item } from '../../../core/item/item';

export interface CartItem {
  item: Item;
  duration: Duration;
}

export interface BumpGroup {
  total: number;
  cartItems: CartItem[];
  collapsed: boolean;
}

export interface CartChange {
  action: 'add' | 'remove' | 'clean';
  cart: Cart;
  itemId?: string;
  type?: string;
}
