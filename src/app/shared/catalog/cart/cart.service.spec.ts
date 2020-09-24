import { TestBed } from '@angular/core/testing';

import { CartService } from './cart.service';
import { CART_ITEM_CITYBUMP, ITEM_ID, MOCK_ITEM_V3 } from '../../../../tests/item.fixtures.spec';
import { Cart } from './cart';
import { CartChange, CartProExtrasPack } from './cart-item.interface';
import { CartBase } from './cart-base';
import { CartPro } from './cart-pro';
import { CartProExtras } from './cart-pro-extras';
import { PREPARED_PACKS, PACK_ID } from '../../../../tests/payments.fixtures.spec';

let service: CartService;
let cartChange: CartChange;
const TYPE = 'citybump';

describe('CartService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CartService]
    });
    service = TestBed.inject(CartService);
    service.cart$.subscribe((c: CartChange) => {
      cartChange = c;
    });
  });

  describe('add', () => {
    it('should call add and emit CartChange event if instance of Cart', () => {
      service.createInstance(new Cart());
      spyOn<any>(service['cart'], 'add');

      service.add(CART_ITEM_CITYBUMP, TYPE);

      expect(cartChange.cart instanceof Cart).toBeTruthy();
    });

    it('should call add and emit CartChange event if instance of CartPro', () => {
      service.createInstance(new CartPro());
      spyOn<any>(service['cart'], 'add');

      service.add(CART_ITEM_CITYBUMP, TYPE);

      expect(cartChange.cart instanceof CartPro).toBe(true);
    });

    afterEach(() => {
      expect(cartChange.itemId).toBe(MOCK_ITEM_V3.id);
      expect(cartChange.type).toBe(TYPE);
      expect(cartChange.action).toBe('add');
      expect(service['cart'].add).toHaveBeenCalledWith(CART_ITEM_CITYBUMP, TYPE);
    });
  });

  describe('remove', () => {
    it('should call removeCartItem and emit CartChange event if instance of Cart', () => {
      service.createInstance(new Cart());
      spyOn<any>(service['cart'], 'removeCartItem');

      service.remove(ITEM_ID, TYPE);

      expect(cartChange.cart instanceof Cart).toBe(true);
    });

    it('should call removeCartItem and emit CartChange event if instance of CartPro', () => {
      service.createInstance(new CartPro());
      spyOn<any>(service['cart'], 'removeCartItem');

      service.remove(ITEM_ID, TYPE);

      expect(cartChange.cart instanceof CartPro).toBe(true);
    });

    afterEach(() => {
      expect(cartChange.itemId).toBe(ITEM_ID);
      expect(cartChange.type).toBe(TYPE);
      expect(cartChange.action).toBe('remove');
      expect(service['cart'].removeCartItem).toHaveBeenCalledWith(ITEM_ID, TYPE);
    });
  });

  describe('clean', () => {
    it('should call clean and emit CartChange event if instance of Cart', () => {
      service.createInstance(new Cart());
      spyOn<any>(service['cart'], 'clean');

      service.clean();

      expect(cartChange.cart instanceof Cart).toBe(true);
    });

    it('should call clean and emit CartChange event if instance of CartPro', () => {
      service.createInstance(new CartPro());
      spyOn<any>(service['cart'], 'clean');

      service.clean();

      expect(cartChange.cart instanceof CartPro).toBe(true);
    });

    afterEach(() => {
      expect(cartChange.action).toBe('clean');
      expect(service['cart'].clean).toHaveBeenCalled();
    });
  });


  describe('CartProExtras type events', () => {
    const cart: CartBase = new CartProExtras();

    beforeEach(() => {
      service.createInstance(new CartProExtras());
    });

    it('should create an instance of CartProExtra', () => {
      expect(cart instanceof CartProExtras).toBe(true);
    });

    describe('addProExtras', () => {
      it('should call add method of cart pro extras model with parameters', () => {
        spyOn(service['cart'], 'add');
        const cartProExtrasPack: CartProExtrasPack = {
          pack: PREPARED_PACKS[0].packs[0]
        };

        service.addProExtras(cartProExtrasPack, PREPARED_PACKS[0].packs[0].name.toLowerCase());

        expect(service['cart'].add).toHaveBeenCalledWith(cartProExtrasPack, PREPARED_PACKS[0].packs[0].name.toLowerCase());
        expect(cartChange.cart instanceof CartProExtras).toBe(true);
        expect(cartChange.packId).toBe(PREPARED_PACKS[0].packs[0].id);
        expect(cartChange.type).toBe(PREPARED_PACKS[0].packs[0].name.toLowerCase());
        expect(cartChange.action).toBe('add');
        expect(cartChange.itemId).toBeFalsy();
      });
    });

    describe('removeProExtras', () => {
      it('should call removeCartItem method of cart pro extras model with parameters', () => {
        spyOn(service['cart'], 'removeCartItem');

        service.removeProExtras(PACK_ID, TYPE, 0);

        expect(service['cart'].removeCartItem).toHaveBeenCalledWith(TYPE, PACK_ID, 0);
        expect(cartChange.cart instanceof CartProExtras).toBe(true);
        expect(cartChange.packId).toBe(PACK_ID);
        expect(cartChange.type).toBe(TYPE);
        expect(cartChange.action).toBe('remove');
        expect(cartChange.itemId).toBeFalsy();
      });
    });
  });
});
