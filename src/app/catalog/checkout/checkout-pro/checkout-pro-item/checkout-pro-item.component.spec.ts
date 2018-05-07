import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutProItemComponent } from './checkout-pro-item.component';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CartService } from '../../cart/cart.service';
import { CustomCurrencyPipe } from '../../../../shared/custom-currency/custom-currency.pipe';
import { NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { CartPro } from '../../cart/cart-pro';
import { Observable } from 'rxjs/Observable';
import { ITEM_ID } from '../../../../../tests/item.fixtures.spec';
import { CartChange } from '../../cart/cart-item.interface';
import { DecimalPipe } from '@angular/common';

fdescribe('CheckoutProItemComponent', () => {
  let component: CheckoutProItemComponent;
  let fixture: ComponentFixture<CheckoutProItemComponent>;

  const CART = new CartPro();
  const CART_CHANGE: CartChange = {
    action: 'add',
    cart: CART,
    itemId: ITEM_ID,
    type: 'citybump'
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CheckoutProItemComponent, CustomCurrencyPipe],
      providers: [
        NgbCalendar,
        DecimalPipe,
        {
          provide: CartService, useValue: {
            createInstance() {
              return new CartPro();
            },
            add() {
            },
            remove() {
            },
            cart$: Observable.of(CART_CHANGE)
          }
        }],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutProItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
});
