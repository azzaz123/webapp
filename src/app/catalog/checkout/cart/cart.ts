import { CartItem, Zonebump } from './cart-item.interface';
import * as _ from 'lodash';

export const BUMP_TYPES = ['zonebump', 'citybump', 'countrybump'];

export class Cart {

  total: number;

  zonebump: Zonebump = {
    total: 0,
    cartItems: []
  };

  citybump: Zonebump = {
    total: 0,
    cartItems: []
  };

  countrybump: Zonebump = {
    total: 0,
    cartItems: []
  };

  calculateTotals() {
    this.total = 0;
    BUMP_TYPES.forEach((type: string) => {
      this[type].total = _.sumBy(this[type].cartItems, (c: CartItem) => +c.duration.market_code);
      this.total += this[type].total;
    });
  }

}
