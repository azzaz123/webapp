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

  it('should set cart', () => {
    expect(service.cart instanceof Cart).toBeTruthy();
  });
});
