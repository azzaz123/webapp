import { CartBase, BUMP_TYPES } from './cart-base';
import { CartProItem } from './cart-item.interface';
import * as _ from 'lodash';
import { Order, OrderPro } from '../../../core/item/item-response.interface';

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

  calculateTotals() {
    this.total = 0;
    BUMP_TYPES.forEach((type: string) => {
      this[type].total = _.sumBy(this[type].cartItems, (c: CartProItem) => +c.numberOfDays);
      this.total += this[type].total;
    });
  }

  prepareOrder() {
    const ordersArray: OrderPro[] = [];
    BUMP_TYPES.forEach((type: string) => {
      const orders: OrderPro[] = this[type].cartItems.map((cartProItem: CartProItem) => {
        return {
          item_id: cartProItem.item.id,
          start_date: this.prepareDate(cartProItem.formattedFromDate),
          end_date: this.prepareDate(cartProItem.formattedToDate),
          autorenew: false,
          bump: !this.prepareBumpType(cartProItem.bumpType),
          national: this.prepareBumpType(cartProItem.bumpType)
        };
      });
      ordersArray.push(...orders);
    });
    return ordersArray;
  }

  prepareDate(date): number {
    const dateParts: number = date.split('/');
    const dateObject: number = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]).getTime();
    return dateObject;
  }

  prepareBumpType(bumpType: string): boolean {
    return bumpType === 'countrybump' ? true : false;
  }

}
