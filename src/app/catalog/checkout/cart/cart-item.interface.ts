import { Duration } from '../../../core/item/item-response.interface';
import { Cart } from './cart';
import { Item } from '../../../core/item/item';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { CartBase } from './cart-base';
import { Pack } from '../../../core/payments/pack';

export interface CartItem {
  item: Item;
  duration: Duration;
}

export interface CartProItem {
  item: Item;
  fromDate?: NgbDateStruct;
  toDate?: NgbDateStruct;
  formattedFromDate?: string;
  formattedToDate?: string;
  bumpType: string;
}

export interface CartProExtrasPack {
  pack: Pack;
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
  packId?: string;
  type?: string;
}

