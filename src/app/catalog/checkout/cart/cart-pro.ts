import { CartBase, BUMP_TYPES } from './cart-base';
import { CartProItem } from './cart-item.interface';
import * as _ from 'lodash';
import { Order } from '../../../core/item/item-response.interface';

export class CartPro extends CartBase {

  add(cartProItem: CartProItem, type: string) {
    this.removeCartItemFromAnyBump(cartProItem.item.id);
    this[type].cartItems.push(cartProItem);
    this.calculateTotals();
  }

  removeCartItem(itemId: string, type: string) {
    const index = _.findIndex(this[type].cartItems, (c: CartProItem) => c.item.id === itemId);
    if (index !== -1) {
      this[type].cartItems.splice(index, 1);
      this.calculateTotals();
    }
  }

  clean() {
    BUMP_TYPES.forEach((type: string) => {
      this[type].cartItems = [];
    });
    this.calculateTotals();
  }

  private calculateTotals() {
  }

  prepareOrder(): Order[] {
    return [];
  }
}
