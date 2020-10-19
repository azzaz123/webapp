import { Cart } from './cart';
import {
  CART_ITEM_CITYBUMP, CART_ITEM_CITYBUMP2, CART_ITEM_COUNTRYBUMP, CART_ITEM_COUNTRYBUMP2,
  CART_ITEM_ZONEBUMP, CART_ORDER, ZONEBUMP_DURATIONS
} from '../../../../tests/item.fixtures.spec';
import { CartItem } from './cart-item.interface';
import { Order } from '../../../core/item/item-response.interface';
import * as UUID from 'uuid';

jest.mock('uuid', () => {
  return { v4: () => null }
});

describe('Cart', () => {

  let cart: Cart;

  beforeEach(() => {
    cart = new Cart();
    cart.add(CART_ITEM_CITYBUMP, 'citybump');
    cart.add(CART_ITEM_CITYBUMP2, 'citybump');
    cart.add(CART_ITEM_ZONEBUMP, 'zonebump');
    cart.add(CART_ITEM_COUNTRYBUMP, 'countrybump');
    cart.add(CART_ITEM_COUNTRYBUMP2, 'countrybump');
  });

  describe('add', () => {

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
      expect(cart.citybump.discountedTotal).toBe(+CART_ITEM_CITYBUMP.duration.original_market_code + +CART_ITEM_CITYBUMP2.duration.original_market_code);
      expect(cart.zonebump.discountedTotal).toBe(+CART_ITEM_ZONEBUMP.duration.original_market_code);
      expect(cart.countrybump.discountedTotal).toBe(+CART_ITEM_COUNTRYBUMP.duration.original_market_code + +CART_ITEM_COUNTRYBUMP2.duration.original_market_code);
      expect(cart.discountedTotal).toBe(cart.citybump.discountedTotal + cart.zonebump.discountedTotal + cart.countrybump.discountedTotal);
    });

    it('should move item from city to zone', () => {
      const newZonebump: CartItem = {
        item: CART_ITEM_CITYBUMP.item,
        duration: ZONEBUMP_DURATIONS[0]
      };
      cart.add(newZonebump, 'zonebump');
      expect(cart.zonebump.cartItems[1]).toEqual(newZonebump);
      expect(cart.citybump.cartItems[0]).toEqual(CART_ITEM_CITYBUMP2);
      expect(cart.citybump.cartItems.length).toBe(1);
    });
  });

  describe('removeCartItem', () => {
    it('should remove item and update total', () => {
      cart.add(CART_ITEM_CITYBUMP, 'citybump');

      cart.removeCartItem(CART_ITEM_CITYBUMP.item.id, 'citybump');

      expect(cart.citybump.cartItems.length).toBe(1);
      expect(cart.citybump.cartItems[0]).toEqual(CART_ITEM_CITYBUMP2);
      expect(cart.citybump.total).toBe(+CART_ITEM_CITYBUMP2.duration.market_code);
      expect(cart.total).toBe(cart.citybump.total + cart.zonebump.total + cart.countrybump.total);
    });
  });

  describe('clean', () => {
    it('should remove all items and reset total', () => {
      cart.clean();

      expect(cart.zonebump.cartItems.length).toBe(0);
      expect(cart.citybump.cartItems.length).toBe(0);
      expect(cart.countrybump.cartItems.length).toBe(0);
      expect(cart.total).toBe(0);
    });
  });

  describe('prepareOrder', () => {
    it('should create order array', () => {
      const order: Order[] = cart.prepareOrder();

      expect(order).toEqual(CART_ORDER);
    });
  });

  describe('getOrderId', () => {
    it('should return uuid', () => {
      const ID = 'UUID';
      spyOn(UUID, 'v4').and.returnValue(ID);

      const uuid = cart.getOrderId();

      expect(uuid).toEqual(ID);
    });
  });

});
