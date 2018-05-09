import { Duration } from '../../../core/item/item-response.interface';
import { Cart } from './cart';
import { Item } from '../../../core/item/item';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { CartBase } from './cart-base';
import { SelectedDates } from '../checkout-pro/range-datepicker/selected-dates.interface';

export interface CartItem {
  item: Item;
  duration: Duration;
}

export interface CartProItem {
  item: Item;
  bumpType?: string;
  selectedDates: SelectedDates;
}

export interface BumpGroup {
  total: number;
  cartItems: CartItem[];
  collapsed: boolean;
}

export interface CartChange {
  action: 'add' | 'remove' | 'clean';
  cart: CartBase;
  itemId?: string;
  type?: string;
}
