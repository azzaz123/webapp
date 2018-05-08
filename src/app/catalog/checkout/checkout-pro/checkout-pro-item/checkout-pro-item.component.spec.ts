import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutProItemComponent } from './checkout-pro-item.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CustomCurrencyPipe } from '../../../../shared/custom-currency/custom-currency.pipe';
import { FormsModule } from '@angular/forms';
import { NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { CartService } from '../../cart/cart.service';
import { Observable } from 'rxjs/Observable';
import { CartChange } from '../../cart/cart-item.interface';
import { ITEM_ID } from '../../../../../tests/item.fixtures.spec';
import { DecimalPipe } from '@angular/common';
import { CartPro } from '../../cart/cart-pro';

fdescribe('CheckoutProItemComponent', () => {
  let component: CheckoutProItemComponent;
  let fixture: ComponentFixture<CheckoutProItemComponent>;
  let cartService: CartService;

  const CART = new CartPro();
  const CART_CHANGE: CartChange = {
    action: 'add',
    cart: CART,
    itemId: ITEM_ID,
    type: 'citybump'
  };
  const TYPE = 'citybump';
  const TYPE2 = 'countrybump';

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [CheckoutProItemComponent, CustomCurrencyPipe],
      providers: [
        NgbCalendar,
        DecimalPipe,
        {
          provide: CartService, useValue: {
            createInstance() {
            },
            add() {
            },
            remove() {
            },
            cart$: Observable.of(CART_CHANGE)
          }
        }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutProItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    cartService = TestBed.get(CartService);
  });

  describe('ngOnInit', () => {
    it('should call createInstance cartService method', () => {
      spyOn(cartService, 'createInstance').and.callThrough();

      component.ngOnInit();

      expect(cartService.createInstance).toHaveBeenCalledWith(CART);
    });
  });

  describe('onDateFocus', () => {
    it('should emit dateFocus event', () => {
      spyOn(component.dateFocus, 'emit');

      component.onDateFocus();

      expect(component.dateFocus.emit).toHaveBeenCalled();
    });
  });
});
