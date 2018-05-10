import { Duration } from '../../../core/item/item-response.interface';
import { Item } from '../../../core/item/item';
import { CartBase } from './cart-base';
import { CalendarDates } from '../checkout-pro/range-datepicker/calendar-dates';

export interface CartItem {
  item: Item;
  duration: Duration;
}

export interface CartProItem {
  item: Item;
  selectedDates: CalendarDates;
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
