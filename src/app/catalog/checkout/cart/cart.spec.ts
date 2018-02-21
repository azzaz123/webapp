import { Cart } from './cart';
import {
  CART_ITEM_CITYBUMP, CART_ITEM_CITYBUMP2, CART_ITEM_COUNTRYBUMP, CART_ITEM_COUNTRYBUMP2,
  CART_ITEM_ZONEBUMP
} from '../../../../tests/item.fixtures';

describe('Cart', () => {

  let cart: Cart;

  beforeEach(() => {
    cart = new Cart();
  });

  describe('add', () => {

    beforeEach(() => {
      cart.add(CART_ITEM_CITYBUMP, 'citybump');
      cart.add(CART_ITEM_CITYBUMP2, 'citybump');
      cart.add(CART_ITEM_ZONEBUMP, 'zonebump');
      cart.add(CART_ITEM_COUNTRYBUMP, 'countrybump');
      cart.add(CART_ITEM_COUNTRYBUMP2, 'countrybump');
    });

    it('should add cartItems to array', () => {
      expect(cart.citybump.cartItems[0]).toEqual(CART_ITEM_CITYBUMP);
      expect(cart.citybump.cartItems[1]).toEqual(CART_ITEM_CITYBUMP2);
      expect(cart.zonebump.cartItems[0]).toEqual(CART_ITEM_ZONEBUMP);
      expect(cart.countrybump.cartItems[0]).toEqual(CART_ITEM_COUNTRYBUMP);
      expect(cart.countrybump.cartItems[1]).toEqual(CART_ITEM_COUNTRYBUMP2);
    });

    it('should calculate totals', () => {
      expect(cart.citybump.total).toBe(+CART_ITEM_CITYBUMP.duration.market_code + +CART_ITEM_CITYBUMP2.duration.market_code);
      expect(cart.zonebump.total).toBe(+CART_ITEM_ZONEBUMP.duration.market_code);
      expect(cart.countrybump.total).toBe(+CART_ITEM_COUNTRYBUMP.duration.market_code + +CART_ITEM_COUNTRYBUMP2.duration.market_code);
      expect(cart.total).toBe(cart.citybump.total + cart.zonebump.total + cart.countrybump.total);
    });
  });

});
