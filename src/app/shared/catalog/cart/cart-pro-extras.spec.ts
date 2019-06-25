import { CartProExtras } from './cart-pro-extras';
import { PREPARED_PACKS, ORDER_CART_EXTRAS_PRO } from '../../../../tests/payments.fixtures.spec';
import { OrderProExtras } from '../../../core/payments/payment.interface';
import { CartProExtrasPack } from './cart-item.interface';

describe('CartProExtras', () => {
  let cart: CartProExtras;
  const cartProExtrasPack1: CartProExtrasPack = {
    pack: PREPARED_PACKS[0].packs[0]
  };
  const cartProExtrasPack2: CartProExtrasPack = {
    pack: PREPARED_PACKS[1].packs[0]
  };
  const cartProExtrasPack3: CartProExtrasPack = {
    pack: PREPARED_PACKS[0].packs[1]
  };
  const cartProExtrasPack4: CartProExtrasPack = {
    pack: PREPARED_PACKS[1].packs[1]
  };

  beforeEach(() => {
    cart = new CartProExtras();
    cart.add(cartProExtrasPack1, 'citybump');
    cart.add(cartProExtrasPack2, 'citybump');
    cart.add(cartProExtrasPack3, 'countrybump');
    cart.add(cartProExtrasPack4, 'countrybump');
  });

  it('cart should be an instance of CartProExtras', () => {
    expect(cart instanceof CartProExtras).toBe(true);
  });

  describe('add', () => {
    it('should add cartItems to array', () => {
      expect(cart.citybump.cartItems[0]).toEqual(cartProExtrasPack1);
      expect(cart.citybump.cartItems[1]).toEqual(cartProExtrasPack2);
      expect(cart.countrybump.cartItems[0]).toEqual(cartProExtrasPack3);
      expect(cart.countrybump.cartItems[1]).toEqual(cartProExtrasPack4);
    });

    it('should calculate totals', () => {
      expect(cart.citybump.total).toBe(
        +PREPARED_PACKS[0].packs[0].price + +PREPARED_PACKS[1].packs[0].price
      );
      expect(cart.countrybump.total).toBe(
        +PREPARED_PACKS[0].packs[1].price + +PREPARED_PACKS[1].packs[1].price
      );
      expect(cart.total).toBe(cart.citybump.total + cart.countrybump.total);
    });
  });

  describe('removeCartItem', () => {
    it('should remove item and update total', () => {
      cart.removeCartItem('citybump', PREPARED_PACKS[0].packs[0].id, 0);

      expect(cart.citybump.cartItems.length).toBe(1);
      expect(cart.citybump.cartItems[0]).toEqual(cartProExtrasPack2);
      expect(cart.citybump.total).toBe(+PREPARED_PACKS[1].packs[0].price);
      expect(cart.total).toBe(cart.citybump.total + cart.countrybump.total);
    });
  });

  describe('clean', () => {
    it('should remove all items and reset total', () => {
      cart.clean();

      expect(cart.citybump.cartItems.length).toBe(0);
      expect(cart.countrybump.cartItems.length).toBe(0);
      expect(cart.total).toBe(0);
    });
  });

  describe('prepareOrder', () => {
    it('should create order array', () => {
      spyOn(cart, 'getOrderId').and.returnValue('UUID');

      const order: OrderProExtras = cart.prepareOrder();

      expect(order.id).toEqual(ORDER_CART_EXTRAS_PRO.id);
    });
  });
});
