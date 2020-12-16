import { Duration } from '../../../core/item/item-response.interface';
import { Item } from '../../../core/item/item';
import { CartBase } from './cart-base';

import { Pack } from '../../../core/payments/pack';
import { CalendarDates } from '@features/catalog-pro/core/calendar-dates';

export interface CartItem {
  item: Item;
  duration: Duration;
}

export interface CartProItem {
  item: Item;
  selectedDates: CalendarDates;
  bumpType?: string;
}

export interface CartProExtrasPack {
  pack: Pack;
}

export interface BumpGroup {
  total: number;
  discountedTotal: number;
  cartItems: CartItem[] | CartProItem[] | CartProExtrasPack[];
  collapsed: boolean;
}

export interface CartChange {
  action: 'add' | 'remove' | 'clean';
  cart: CartBase;
  itemId?: string;
  packId?: string;
  type?: string;
}
