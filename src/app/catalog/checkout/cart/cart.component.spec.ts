import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CartComponent } from './cart.component';
import { CustomCurrencyPipe } from '../../../shared/custom-currency/custom-currency.pipe';
import { DecimalPipe } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CartService } from './cart.service';
import { Observable } from 'rxjs/Observable';
import { Cart } from './cart';

describe('CartComponent', () => {
  let component: CartComponent;
  let fixture: ComponentFixture<CartComponent>;

  const CART = new Cart();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CartComponent, CustomCurrencyPipe],
      providers: [
        DecimalPipe,
        {
          provide: CartService, useValue: {
          cart$: Observable.of(CART)
        }
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('ngOnInit', () => {
    it('should set cart', () => {
      expect(component.cart).toEqual(CART);
    });
  });

  describe('ngOnDestroy', () => {
    it('should set active false', () => {
      component.ngOnDestroy();

      expect(component['active']).toBeFalsy();
    });
  });
});
