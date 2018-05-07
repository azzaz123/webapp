import { CartBase, BUMP_TYPES } from './cart-base';
import { CartProExtrasPack } from './cart-item.interface';
import * as _ from 'lodash';
import { OrderProExtras } from '../../../core/item/item-response.interface';

export class CartProExtras extends CartBase {

  add(cartProExtrasPack: CartProExtrasPack, type: string) {
    console.log('add', this, type);
    this[type].cartItems.push(cartProExtrasPack);
    this.calculateTotals();
  }

  removeCartItem(packId: string, type: string) {
    const index = _.findIndex(this[type].cartItems, (c: CartProExtrasPack) => c.pack.id === packId);
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

  prepareOrder() {
    const ordersArray: OrderProExtras[] = [];
    BUMP_TYPES.forEach((type: string) => {
      const orders: OrderProExtras[] = this[type].cartItems.map((cartProExtrasPack: CartProExtrasPack) => {
        return {
          pack_id: cartProExtrasPack.pack.id
        };
      });
      ordersArray.push(...orders);
    });
    return ordersArray;
  }

  private calculateTotals() {
    this.total = 0;
    BUMP_TYPES.forEach((type: string) => {
      this[type].total = _.sumBy(this[type].cartItems, (c: CartProExtrasPack) => +c.pack.price);
      this.total += this[type].total;
    });
  }
}
