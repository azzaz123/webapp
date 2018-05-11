import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CheckoutProItemComponent } from './checkout-pro-item.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CustomCurrencyPipe } from '../../../../shared/custom-currency/custom-currency.pipe';
import { FormsModule } from '@angular/forms';
import { NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { CartService } from '../../cart/cart.service';
import { Observable } from 'rxjs/Observable';
import { CartChange, CartProItem } from '../../cart/cart-item.interface';
import { ITEM_ID, MOCK_ITEM_V3 } from '../../../../../tests/item.fixtures.spec';
import { DecimalPipe } from '@angular/common';
import { CartPro } from '../../cart/cart-pro';
import * as moment from 'moment';
import { MOCK_SELECTED_DATES, MOCK_DATE2, MOCK_DATE3 } from '../../../../../tests/calendar.fixtures.spec';
import { MOCK_PROITEM } from '../../../../../tests/pro-item.fixtures.spec';
import { CalendarDates } from '../range-datepicker/calendar-dates';

describe('CheckoutProItemComponent', () => {
  let component: CheckoutProItemComponent;
  let fixture: ComponentFixture<CheckoutProItemComponent>;
  let cartService: CartService;
  let calendar: NgbCalendar;

  const CART = new CartPro();
  const TYPE = 'citybump';
  const TYPE2 = 'countrybump';
  const CART_CHANGE: CartChange = {
    action: 'add',
    cart: CART,
    itemId: ITEM_ID,
    type: 'citybump'
  };

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
          },
        }, {
          provide: NgbCalendar, useValue: {
            getToday() {
              return MOCK_DATE2;
            },
            getNext() {
              return MOCK_DATE3;
            }
          }
        }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutProItemComponent);
    component = fixture.componentInstance;
    component.cartProItem = MOCK_PROITEM;
    fixture.detectChanges();
    cartService = TestBed.get(CartService);
    calendar = TestBed.get(NgbCalendar);
  });

  describe('ngOnInit', () => {
    it('should call createInstance cartService method', () => {
      spyOn(cartService, 'createInstance').and.callThrough();

      component.ngOnInit();

      expect(cartService.createInstance).toHaveBeenCalledWith(new CartPro());
    });

    it('should call create instance of CalendarDates with today and tomorrow dates', () => {
      component.todayDate = calendar.getToday();
      component.tomorrowDate = calendar.getNext(component.todayDate);
      component.ngOnInit();

      expect(component.cartProItem.selectedDates instanceof CalendarDates).toBe(true);
      expect(component.cartProItem.selectedDates.fromDate).toBe(component.todayDate);
      expect(component.cartProItem.selectedDates.toDate).toBe(component.tomorrowDate);
    });
  });

  describe('onDateFocus', () => {
    it('should emit dateFocus event with cartProItem', () => {
      spyOn(component.dateFocus, 'emit');

      component.onDateFocus();

      expect(component.dateFocus.emit).toHaveBeenCalledWith(component.cartProItem);
    });
  });

  describe('selectBump', () => {

    beforeEach(() => {
      spyOn(cartService, 'add').and.callThrough();
      spyOn(component, 'removeItem').and.callThrough();

      component.selectBump(TYPE);
    });

    it('should set item bump type and add it to cart', () => {
      expect(component.cartProItem.bumpType).toBe(TYPE);
      expect(cartService.add).toHaveBeenCalledWith(component.cartProItem, component.cartProItem.bumpType);
    });

    it('should remove item from cart if item is already added ', () => {
      component.selectBump(TYPE);

      expect(component.removeItem).toHaveBeenCalled();
    });

    it('should change type of selected bump if selections are different', () => {
      component.selectBump(TYPE2);

      expect(component.cartProItem.bumpType).toBe(TYPE2);
      expect(cartService.add).toHaveBeenCalledWith(component.cartProItem, component.cartProItem.bumpType);
    });
  });

  describe('onRemoveOrClean', () => {

    it('should reset flags, selected type and duration if action remove', () => {
      const cartChange: CartChange = {
        action: 'remove',
        itemId: MOCK_ITEM_V3.id,
        cart: CART
      };
      cartService.cart$ = Observable.of(cartChange);

      component.onRemoveOrClean(cartChange);
    });

    it('should reset flags, selected type and duration if action clean', () => {
      const cartChange: CartChange = {
        action: 'clean',
        cart: CART
      };
      cartService.cart$ = Observable.of(cartChange);

      component.onRemoveOrClean(cartChange);
    });

    afterEach(() => {
      expect(component.cartProItem.bumpType).toBeUndefined();
      expect(component.cartProItem.selectedDates.fromDate).toBe(MOCK_DATE2);
      expect(component.cartProItem.selectedDates.toDate).toBe(MOCK_DATE3);
      expect(component.cartProItem.selectedDates.numberOfDays).toBe(1);
    });
  });

  describe('removeItem', () => {
    it('should call cartService and remove item from cart', () => {
      spyOn(cartService, 'remove').and.callThrough();

      component.removeItem();

      expect(cartService.remove).toHaveBeenCalledWith(component.cartProItem.item.id, component.cartProItem.bumpType);
    });
  });

});
