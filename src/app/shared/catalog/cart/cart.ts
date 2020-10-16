import { CartItem } from './cart-item.interface';
import { findIndex, sumBy } from 'lodash-es';
import { Order } from '../../../core/item/item-response.interface';
import { CartBase, BUMP_TYPES } from './cart-base';
import { UuidService } from '../../../core/uuid/uuid.service';

export class Cart extends CartBase {

  add(cartItem: CartItem, type: string) {
    this.removeCartItemFromAnyBump(cartItem.item.id);
    this[type].cartItems.push(cartItem);
    this.calculateTotals();
  }

  removeCartItem(itemId: string, type: string) {
    const index = findIndex(this[type].cartItems, (c: CartItem) => c.item.id === itemId);
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
    const ordersArray: Order[] = [];
    BUMP_TYPES.forEach((type: string) => {
      const orders: Order[] = this[type].cartItems.map((cartItem: CartItem) => {
        return {
          item_id: cartItem.item.id,
          product_id: cartItem.duration.id
        };
      });
      ordersArray.push(...orders);
    });
    return ordersArray;
  }

  getOrderId(): string {
    return UuidService.getUUID();
  }

  private calculateTotals() {
    this.total = 0;
    this.discountedTotal = 0;
    BUMP_TYPES.forEach((type: string) => {
      this[type].total = sumBy(this[type].cartItems, (c: CartItem) => +c.duration.market_code);
      this.total += this[type].total;
      this[type].discountedTotal = sumBy(this[type].cartItems, (c: CartItem) => +c.duration.original_market_code || 0);
      this.discountedTotal += this[type].discountedTotal;
    });
  }

}
