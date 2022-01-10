import { UuidService } from 'app/core/uuid/uuid.service';
import { BumpGroup, CartItem, CartProItem, CartProExtrasPack } from './cart-item.interface';

export const BUMP_TYPES = ['zonebump', 'citybump', 'countrybump'];
export const BUMP_PROVINCIAL_TYPES = ['zonebump', 'countrybump'];
export const BUMP_PRO_TYPES = ['citybump', 'countrybump'];

export abstract class CartBase {
  total = 0;
  discountedTotal = 0;

  zonebump: BumpGroup = {
    total: 0,
    discountedTotal: 0,
    cartItems: [],
    collapsed: false,
  };

  citybump: BumpGroup = {
    total: 0,
    discountedTotal: 0,
    cartItems: [],
    collapsed: false,
  };

  countrybump: BumpGroup = {
    total: 0,
    discountedTotal: 0,
    cartItems: [],
    collapsed: false,
  };

  public getOrderId(): string {
    return UuidService.getUUID();
  }

  protected removeCartItemFromAnyBump(itemId: string) {
    BUMP_TYPES.forEach((type: string) => {
      this.removeCartItem(itemId, type);
    });
  }

  abstract add(cartItem: CartItem | CartProItem | CartProExtrasPack, type: string);

  abstract removeCartItem(type: string, itemId?: string, index?: number);

  abstract clean();

  abstract prepareOrder();
}
