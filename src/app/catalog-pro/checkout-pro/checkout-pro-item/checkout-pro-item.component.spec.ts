
import {of as observableOf } from 'rxjs';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CheckoutProItemComponent } from './checkout-pro-item.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { DecimalPipe } from '@angular/common';
import { CalendarDates } from '../range-datepicker/calendar-dates';
import { CartService } from '../../../shared/catalog/cart/cart.service';
import { CartPro } from '../../../shared/catalog/cart/cart-pro';
import { CartChange } from '../../../shared/catalog/cart/cart-item.interface';
import { ITEM_ID, MOCK_ITEM_V3 } from '../../../../tests/item.fixtures.spec';
import { CustomCurrencyPipe } from '../../../shared/pipes';
import { MOCK_DATE2, MOCK_DATE3, MOCK_DATE } from '../../../../tests/calendar.fixtures.spec';
import { MOCK_PROITEM3 } from '../../../../tests/pro-item.fixtures.spec';

describe('CheckoutProItemComponent', () => {
  let component: CheckoutProItemComponent;
  let fixture: ComponentFixture<CheckoutProItemComponent>;
  let cartService: CartService;
  let calendar: NgbCalendar;
  let fb: FormBuilder;
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
      imports: [FormsModule, ReactiveFormsModule],
      declarations: [CheckoutProItemComponent, CustomCurrencyPipe],
      providers: [
        DecimalPipe,
        FormBuilder,
        {
          provide: CartService, useValue: {
            createInstance() {
            },
            add() {
            },
            remove() {
            },
            cart$: observableOf(CART_CHANGE)
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
    component.cartProItem = MOCK_PROITEM3;
    component.selectAllEvent = observableOf(1);
    fb = TestBed.inject(FormBuilder);
    fixture.detectChanges();
    cartService = TestBed.inject(CartService);
    calendar = TestBed.inject(NgbCalendar);
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
    it('should set the bumptype and toggle the calendar', () => {
      component.onDateFocus();

      expect(component.calendarType).toBe(null);
      expect(component.newBumpType).toEqual(component.cartProItem.bumpType);
      expect(component.calendarHidden).toBe(false);
    });
  });

  describe('onApplyCalendar', () => {
    let newDates: CalendarDates;
    beforeEach(() => {
      const todayDate = calendar.getToday();
      const tomorrowDate = calendar.getNext(todayDate);
      newDates = new CalendarDates(todayDate, tomorrowDate);
      spyOn(cartService, 'add').and.callThrough();

      component.onApplyCalendar(newDates);
    });
    it('should set the bumptype and toggle the calendar', () => {
      expect(component.calendarType).toBe(null);
      expect(component.cartProItem.selectedDates).toEqual(newDates);
    });

    it('should add the item to the cart', () => {
      expect(cartService.add).toHaveBeenCalledWith(component.cartProItem, component.cartProItem.bumpType);
    })

    it('should toggle the calendar view', () => {
      expect(component.calendarHidden).toBe(false);
    })

    it('should update the form\'s values', () => {
      expect(component.datesForm.value.fromDate).toEqual(newDates.formattedFromDate);
      expect(component.datesForm.value.toDate).toEqual(newDates.formattedToDate);
    });
  });

  describe('selectBump', () => {

    beforeEach(() => {
      spyOn(cartService, 'add').and.callThrough();
      spyOn(component, 'removeItem').and.callThrough();
    });

    it('should set item bump type and add it to cart', () => {
      component.cartProItem.bumpType = TYPE2;
      component.selectBump(TYPE);

      expect(cartService.add).toHaveBeenCalledWith(component.cartProItem, component.cartProItem.bumpType);
    });

    it('should remove item from cart if item is already added ', () => {
      component.cartProItem.bumpType = TYPE;
      component.selectBump(TYPE);

      expect(component.removeItem).toHaveBeenCalled();
    });

    it('should change type of selected bump if selections are different', () => {
      component.selectBump(TYPE2);

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
      cartService.cart$ = observableOf(cartChange);

      component.onRemoveOrClean(cartChange);
    });

    it('should reset flags, selected type and duration if action clean', () => {
      const cartChange: CartChange = {
        action: 'clean',
        cart: CART
      };
      cartService.cart$ = observableOf(cartChange);

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
