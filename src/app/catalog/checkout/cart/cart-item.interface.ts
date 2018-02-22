import { Duration } from '../../../core/item/item-response.interface';
import { Item } from 'shield';
import { Cart } from './cart';

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
