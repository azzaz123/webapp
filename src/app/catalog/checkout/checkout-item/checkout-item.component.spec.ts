import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutItemComponent } from './checkout-item.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CustomCurrencyPipe } from '../../../shared/custom-currency/custom-currency.pipe';
import { DecimalPipe } from '@angular/common';
import { CITYBUMP_DURATIONS, ITEMS_WITH_PRODUCTS, MOCK_ITEM_V3 } from '../../../../tests/item.fixtures';
import { CartService } from '../cart/cart.service';
import { Cart } from '../cart/cart';
import { CartChange } from '../cart/cart-item.interface';
import { Observable } from 'rxjs/Observable';
import { ITEM_ID } from 'shield';

describe('CheckoutItemComponent', () => {
  let component: CheckoutItemComponent;
  let fixture: ComponentFixture<CheckoutItemComponent>;
  let cartService: CartService;

  const CART = new Cart();
  const CART_CHANGE: CartChange = {
    action: 'add',
    cart: CART,
    itemId: ITEM_ID,
    type: 'citybump'
  };
  const TYPE = 'citybump';
  const DURATION = '24';

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckoutItemComponent, CustomCurrencyPipe ],
      providers: [
        DecimalPipe,
        {
          provide: CartService, useValue: {
          add() {
          },
          remove() {
          },
          cart$: Observable.of(CART_CHANGE)
        }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutItemComponent);
    component = fixture.componentInstance;
    component.itemWithProducts = ITEMS_WITH_PRODUCTS[0];
    fixture.detectChanges();
    cartService = TestBed.get(CartService);
  });

  describe('ngOnInit', () => {
    it('should set durations and default duration', () => {
      expect(component.durations).toEqual(['24', '72', '168']);
      expect(component.duration).toEqual('72');
    });

    it('should reset selected type and duration if action remove', () => {
      component.selectedType = TYPE;
      component.selectedDuration = DURATION;
      const cartChange: CartChange = {
        action: 'remove',
        itemId: MOCK_ITEM_V3.id,
        cart: CART
      };
      cartService.cart$ = Observable.of(cartChange);

      component.ngOnInit();

      expect(component.selectedType).toBeNull();
      expect(component.selectedDuration).toBeNull();
    });

    it('should reset selected type and duration if action clean', () => {
      component.selectedType = TYPE;
      component.selectedDuration = DURATION;
      const cartChange: CartChange = {
        action: 'clean',
        cart: CART
      };
      cartService.cart$ = Observable.of(cartChange);

      component.ngOnInit();

      expect(component.selectedType).toBeNull();
      expect(component.selectedDuration).toBeNull();
    });
  });

  describe('ngOnDestroy', () => {
    it('should set active to false', () => {
      component.ngOnDestroy();

      expect(component['active']).toBeFalsy();
    });
  });

  describe('select', () => {
    it('should set type, duration and call add', () => {
      component.duration = DURATION;
      spyOn(cartService, 'add');

      component.select(TYPE);

      expect(component.selectedType).toBe(TYPE);
      expect(component.selectedDuration).toBe(DURATION);
      expect(cartService.add).toHaveBeenCalledWith({
        item: MOCK_ITEM_V3,
        duration: CITYBUMP_DURATIONS[0]
      }, TYPE);
    });

    it('should call remove if selected twice', () => {
      spyOn(cartService, 'remove');

      component.select(TYPE);
      component.select(TYPE);

      expect(cartService.remove).toHaveBeenCalledWith(MOCK_ITEM_V3.id, TYPE);
    });
  });
});
