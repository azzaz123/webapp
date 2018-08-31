import { CartBase, BUMP_TYPES } from './cart-base';
import { CartProExtrasPack } from './cart-item.interface';
import * as _ from 'lodash';
import { OrderProExtras } from '../../../core/payments/payment.interface';

export class CartProExtras extends CartBase {

  add(cartProExtrasPack: CartProExtrasPack, type: string) {
    this[type].cartItems.push(cartProExtrasPack);
    this.calculateTotals();
  }

  removeCartItem(type: string, packId: string, index: number) {
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

  prepareOrder(): OrderProExtras {
    const ordersArray: Array<string> = [];
    BUMP_TYPES.forEach((type: string) => {
      const orders: Array<string> = this[type].cartItems.map((cartProExtrasPack: CartProExtrasPack) => {
        return cartProExtrasPack.pack.id;
      });
      ordersArray.push(...orders);
    });
    return {
      id: this.getOrderId(),
      packs: ordersArray
    };
  }

  private calculateTotals() {
    this.total = 0;
    BUMP_TYPES.forEach((type: string) => {
      this[type].total = _.sumBy(this[type].cartItems, (c: CartProExtrasPack) => +c.pack.price);
      this.total += this[type].total;
    });
  }
}
