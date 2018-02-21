import { TestBed } from '@angular/core/testing';

import { CartService } from './cart.service';
import { CART_ITEM_CITYBUMP } from '../../../../tests/item.fixtures';
import { Cart } from './cart';

let service: CartService;

describe('CartService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CartService]
    });
    service = TestBed.get(CartService);
  });

  describe('add', () => {

    it('should add cartItem to cart and emit it', () => {
      let cart: Cart;
      service.cart$.subscribe((c: Cart) => {
        cart = c;
      });
      spyOn<any>(service['cart'], 'add');

      service.add(CART_ITEM_CITYBUMP, 'citybump');

      expect(cart instanceof Cart).toBeTruthy();
      expect(service['cart'].add).toHaveBeenCalled();
    });
  });
});
