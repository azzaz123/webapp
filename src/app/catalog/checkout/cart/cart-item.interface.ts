import { Duration } from '../../../core/item/item-response.interface';
import { Item } from '../../../core/item/item';
import { CartBase } from './cart-base';
import { SelectedDates } from '../checkout-pro/range-datepicker/selected-dates.interface';

export interface CartItem {
  item: Item;
  duration: Duration;
}

export interface CartProItem {
  item: Item;
  selectedDates: SelectedDates;
  bumpType?: string;
}

export interface BumpGroup {
  total: number;
  cartItems: CartItem[] | CartProItem[];
  collapsed: boolean;
}

export interface CartChange {
  action: 'add' | 'remove' | 'clean';
  cart: CartBase;
  itemId?: string;
  type?: string;
}
