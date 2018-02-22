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

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckoutItemComponent, CustomCurrencyPipe ],
      providers: [
        DecimalPipe,
        {
          provide: CartService, useValue: {
          add() {
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
  });

  describe('select', () => {
    it('should set type, duration and call add', () => {
      const TYPE = 'citybump';
      const DURATION = '24';
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
  });
});
