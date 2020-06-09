
import {of as observableOf } from 'rxjs';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CheckoutProComponent, BUMPS } from './checkout-pro.component';
import { ItemService } from '../../core/item/item.service';
import { ITEMS_WITH_PRODUCTS, ITEM_ID } from '../../../tests/item.fixtures.spec';
import { ActivatedRoute, Router } from '@angular/router';
import { MOCK_SELECTED_DATES, MOCK_DATE, MOCK_DATE2 } from '../../../tests/calendar.fixtures.spec';
import { CartService } from '../../shared/catalog/cart/cart.service';
import { CartPro } from '../../shared/catalog/cart/cart-pro';
import { NgbDatepickerConfig, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { CalendarDates } from './range-datepicker/calendar-dates';

describe('CheckoutProComponent', () => {
  let component: CheckoutProComponent;
  let fixture: ComponentFixture<CheckoutProComponent>;
  let cartService: CartService;
  let itemService: ItemService;
  let calendar: NgbCalendar;
  let router: Router;
  let spyCall;
  let route: ActivatedRoute;
  const SELECTED_ITEMS = ['1', '2', '3'];
  const MOCK_CALENDAR_DATE = new CalendarDates(MOCK_DATE, MOCK_DATE2);
  const EVENT_DATA = {type: BUMPS.CITY, allSelected: false, dates: MOCK_CALENDAR_DATE };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CheckoutProComponent],
      providers: [
        {
          provide: ItemService, useValue: {
            selectedItems: SELECTED_ITEMS,
            getItemsWithAvailableProducts() {
              return observableOf(ITEMS_WITH_PRODUCTS);
            }
          }
        },
        {
          provide: Router, useValue: {
            navigate() {
            }
          }
        },
        {
          provide: CartService, useValue: {
            createInstance() {
            },
            add() {
            }
          }
        },
        {
          provide: ActivatedRoute, useValue: {
          params: observableOf({})
        }
        },
        NgbDatepickerConfig,
        {
          provide: NgbCalendar, useValue: {
            getToday() {
              return MOCK_DATE;
            },
            getNext() {
              return MOCK_DATE;
            }
          }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutProComponent);
    component = fixture.componentInstance;
    cartService = TestBed.get(CartService);
    calendar = TestBed.get(NgbCalendar);
    itemService = TestBed.get(ItemService);
    router = TestBed.get(Router);
    route = TestBed.get(ActivatedRoute);
    spyCall = spyOn(itemService, 'getItemsWithAvailableProducts').and.callThrough();
    fixture.detectChanges();
  });

  describe('ngOnInit', () => {
    it('should call createInstance cartService method', () => {
      spyOn(cartService, 'createInstance').and.callThrough();

      component.ngOnInit();

      expect(cartService.createInstance).toHaveBeenCalledWith(new CartPro());
    });

    describe('no params', () => {

      it('should call getItemsWithAvailableProducts and set it', () => {
        expect(itemService.getItemsWithAvailableProducts).toHaveBeenCalledWith(SELECTED_ITEMS);
        expect(component.itemsWithProducts).toEqual(ITEMS_WITH_PRODUCTS);
      });

      it('should redirect to catalog if no item selected', () => {
        spyOn(router, 'navigate');
        itemService.selectedItems = [];

        component.ngOnInit();

        expect(router.navigate).toHaveBeenCalledWith(['pro/catalog/list']);
      });

    });

    describe('with params', () => {

      beforeEach(() => {
        route.params = observableOf({
          itemId: ITEM_ID
        });
      });

      it('should call getItemsWithAvailableProducts and set it', () => {
        component.ngOnInit();

        expect(itemService.getItemsWithAvailableProducts).toHaveBeenCalledWith([ITEM_ID]);
        expect(component.itemsWithProducts).toEqual(ITEMS_WITH_PRODUCTS);
      });

      it('should redirect if no products available', () => {
        spyCall.and.returnValue(observableOf([]));
        spyOn(router, 'navigate');

        component.ngOnInit();

        expect(itemService.getItemsWithAvailableProducts).toHaveBeenCalledWith([ITEM_ID]);
        expect(router.navigate).toHaveBeenCalledWith(['pro/catalog/list', {alreadyFeatured: true}])
      });

    });
  });

  describe('onApplyCalendar', () => {
    beforeEach(() => {
      component.onApplyCalendar(MOCK_SELECTED_DATES);
    });

    describe('Apply for all Planning', () => {
      beforeEach(() => {
        component.calendarType = BUMPS.PLANNING;
      });

      it('should set allSelected.planning to false', () => {
        expect(component.allSelected.planning).toBe(false);
      });

      it('should call event emitter with parameters', () => {
        component.selectAllEventSubject.subscribe(eventData => {
          expect(eventData).toEqual(EVENT_DATA);
        })
      });
    });

    describe('Apply for City/Country', () => {
      beforeEach(() => {
        component.calendarType = BUMPS.CITY;
      });
  
      it('should hide the calendar', () => {
        expect(component.calendarHidden).toBe(false);
      });
    });

    it('should set the calendarType to null', () => {
      expect(component.calendarType).toBe(null);
    });
  });

  describe('selectAll', () => {
    beforeEach(() => {
      component.allSelected[BUMPS.CITY] = true;
      component.selectAll(BUMPS.CITY);
    });

    it('should set the calendarType to the bump selected', () => {
      expect(component.calendarType).toEqual(BUMPS.CITY);
    });
    
    describe('bump is different than planning', () => {
      it('should set allSelected', () => {
        expect(component.allSelected[BUMPS.CITY]).toBe(false);
      });

      it('should call event emitter with parameters', () => {
        component.selectAllEventSubject.subscribe(EVENT_DATA => {
          expect(EVENT_DATA).toEqual({a:'a',b:'b',c:'c'});
        })
      });

      it('should set allSelected for countrybump to false', () => {
        expect(component.allSelected.countrybump).toBe(false);
      });      
    });

    describe('bump is planning', () => {
      beforeEach(() => {
        component.newSelectedDates = null;
        component.selectAll(BUMPS.PLANNING);
      })
      it('should set the default dates', () => {
        component.todayDate = calendar.getToday();
        component.tomorrowDate = calendar.getNext(component.todayDate);
        expect(component.newSelectedDates).toEqual(new CalendarDates(component.todayDate, component.tomorrowDate));
      });
  
      it('should hide the calendar', () => {
        expect(component.calendarHidden).toBe(false);
      });
    });
    
  });

});
