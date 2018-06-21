import { BumpGroup, CartItem, CartProItem, CartProExtrasPack } from './cart-item.interface';
import { UUID } from 'angular2-uuid';

export const BUMP_TYPES = ['zonebump', 'citybump', 'countrybump'];
export const BUMP_PRO_TYPES = ['citybump', 'countrybump'];

export abstract class CartBase {
  total = 0;
  discountedTotal = 0;

  zonebump: BumpGroup = {
    total: 0,
    discountedTotal: 0,
    cartItems: [],
    collapsed: false
  };

  citybump: BumpGroup = {
    total: 0,
    discountedTotal: 0,
    cartItems: [],
    collapsed: false
  };

  countrybump: BumpGroup = {
    total: 0,
    discountedTotal: 0,
    cartItems: [],
    collapsed: false
  };

  abstract add(cartItem: CartItem | CartProItem | CartProExtrasPack, type: string);

  abstract removeCartItem(type: string, itemId?: string, index?: number);

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
