import { TestBed } from '@angular/core/testing';

import { CartService } from './cart.service';
import { CART_ITEM_CITYBUMP, MOCK_ITEM_V3 } from '../../../../tests/item.fixtures';
import { Cart } from './cart';
import { CartChange } from './cart-item.interface';

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
      let cartChange: CartChange;
      const TYPE = 'citybump';
      service.cart$.subscribe((c: CartChange) => {
        cartChange = c;
      });
      spyOn<any>(service['cart'], 'add');

      service.add(CART_ITEM_CITYBUMP, TYPE);

      expect(cartChange.cart instanceof Cart).toBeTruthy();
      expect(cartChange.itemId).toBe(MOCK_ITEM_V3.id);
      expect(cartChange.type).toBe(TYPE);
      expect(cartChange.action).toBe('add');
      expect(service['cart'].add).toHaveBeenCalled();
    });
  });
});
