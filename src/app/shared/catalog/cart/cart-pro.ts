import { CartBase, BUMP_TYPES } from './cart-base';
import { CartProItem } from './cart-item.interface';
import { findIndex, sumBy } from 'lodash-es';
import { OrderPro } from '../../../core/item/item-response.interface';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

export class CartPro extends CartBase {
  add(cartProItem: CartProItem, type: string) {
    this.removeCartItemFromAnyBump(cartProItem.item.id);
    this[type].cartItems.push(cartProItem);
    this.calculateTotals();
  }

  removeCartItem(itemId: string, type: string) {
    const index = findIndex(
      this[type].cartItems,
      (c: CartProItem) => c.item.id === itemId
    );
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
      this[type].total = sumBy(
        this[type].cartItems,
        (c: CartProItem) => +c.selectedDates.numberOfDays
      );
      this.total += this[type].total;
    });
  }

  prepareOrder() {
    const ordersArray: OrderPro[] = [];
    BUMP_TYPES.forEach((type: string) => {
      const orders: OrderPro[] = this[type].cartItems.map(
        (cartProItem: CartProItem) => {
          return {
            item_id: cartProItem.item.id,
            start_date: this.prepareDate(cartProItem.selectedDates.fromDate),
            end_date: this.prepareDate(cartProItem.selectedDates.toDate),
            autorenew: false,
            bump: !this.isCountryBump(cartProItem.bumpType),
            national: this.isCountryBump(cartProItem.bumpType),
          };
        }
      );
      ordersArray.push(...orders);
    });
    return ordersArray;
  }

  prepareDate(date: NgbDateStruct): number {
    const dateObject: number = new Date(
      date.year,
      date.month - 1,
      date.day
    ).getTime();
    return dateObject;
  }

  isCountryBump(bumpType: string): boolean {
    return bumpType === 'countrybump' ? true : false;
  }
}
