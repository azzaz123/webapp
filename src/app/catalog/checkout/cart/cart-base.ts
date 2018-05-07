import { BumpGroup, CartItem, CartProItem } from './cart-item.interface';
import { CartPro } from './cart-pro';
import { Cart } from './cart';
import { Order } from '../../../core/item/item-response.interface';
import { UUID } from 'angular2-uuid';

export const BUMP_TYPES = ['zonebump', 'citybump', 'countrybump'];

export abstract class CartBase {
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

  abstract add(cartItem: CartItem | CartProItem, type: string);

  abstract removeCartItem(type: string, itemId?: string);

  abstract clean();

  abstract prepareOrder();

  public getOrderId() {
    return UUID.UUID();
  }

  protected removeCartItemFromAnyBump(itemId: string) {
    BUMP_TYPES.forEach((type: string) => {
      this.removeCartItem(itemId, type);
    });
  }
}
