import { CartProItem } from './cart-pro-item.interface';
import { BumpGroup } from '../../cart/cart-item.interface';
import * as _ from 'lodash';

export const BUMP_PRO_TYPES = ['citybump', 'countrybump'];

export class CartPro {

  total: number;

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

  add(cartItem: CartProItem) {
    this.removeCartItemFromAnyBump(cartItem.item.id);
    this[cartItem.bumpType].cartItems.push(cartItem);
  }

  private removeCartItemFromAnyBump(itemId: string) {
    BUMP_PRO_TYPES.forEach((type: string) => {
      this.removeCartItem(itemId, type);
    });
  }

  removeCartItem(itemId: string, type: string) {
    const index = _.findIndex(this[type].cartItems, (c: CartProItem) => c.item.id === itemId);
    if (index !== -1) {
      this[type].cartItems.splice(index, 1);
    }
  }
}
