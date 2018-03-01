import { CartItem, BumpGroup } from './cart-item.interface';
import * as _ from 'lodash';

export const BUMP_TYPES = ['zonebump', 'citybump', 'countrybump'];

export class Cart {

  total: number;

  zonebump: BumpGroup = {
    total: 0,
    cartItems: [],
    collapsed: true
  };

  citybump: BumpGroup = {
    total: 0,
    cartItems: [],
    collapsed: true
  };

  countrybump: BumpGroup = {
    total: 0,
    cartItems: [],
    collapsed: true
  };

  add(cartItem: CartItem, type: string) {
    this[type].cartItems.push(cartItem);
    this.calculateTotals();
  }

  private calculateTotals() {
    this.total = 0;
    BUMP_TYPES.forEach((type: string) => {
      this[type].total = _.sumBy(this[type].cartItems, (c: CartItem) => +c.duration.market_code);
      this.total += this[type].total;
    });
  }

}
