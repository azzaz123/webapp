
import {of as observableOf,  Observable } from 'rxjs';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CheckoutProComponent } from './checkout-pro.component';
import { ItemService } from '../../core/item/item.service';
import { ITEMS_WITH_PRODUCTS, ITEM_ID } from '../../../tests/item.fixtures.spec';
import { ActivatedRoute, Router } from '@angular/router';
import { MOCK_PROITEM } from '../../../tests/pro-item.fixtures.spec';
import { MOCK_SELECTED_DATES } from '../../../tests/calendar.fixtures.spec';
import { CartService } from '../../shared/catalog/cart/cart.service';
import { CartPro } from '../../shared/catalog/cart/cart-pro';

describe('CheckoutProComponent', () => {
  let component: CheckoutProComponent;
  let fixture: ComponentFixture<CheckoutProComponent>;
  let cartService: CartService;
  let itemService: ItemService;
  let router: Router;
  let spyCall;
  let route: ActivatedRoute;

  const SELECTED_ITEMS = ['1', '2', '3'];
  const CART = new CartPro();

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

  describe('onDateFocus', () => {
    it('should call createInstance cartService method', () => {
      spyOn(cartService, 'createInstance').and.callThrough();

      component.ngOnInit();

      expect(cartService.createInstance).toHaveBeenCalledWith(new CartPro());
    });

    it('should call getItemsWithAvailableProducts and set it', () => {
      expect(itemService.getItemsWithAvailableProducts).toHaveBeenCalledWith(SELECTED_ITEMS);
      expect(component.itemsWithProducts).toEqual(ITEMS_WITH_PRODUCTS);
    });

    it('should redirect to catalog if no item selected', () => {
      component.onDateFocus(MOCK_PROITEM);

      expect(component.itemSelected).toBe(MOCK_PROITEM);
      expect(component.calendarHidden).toBe(false);
    });

    it('should open calendar', () => {
      component.onDateFocus(MOCK_PROITEM);

      expect(component.calendarHidden).toBe(false);
    });
  });

  describe('onApplyCalendar', () => {
    beforeEach(() => {
      component.onDateFocus(MOCK_PROITEM);
      component.onApplyCalendar(MOCK_SELECTED_DATES);
    });

    it('should set selected dates', () => {
      expect(component.itemSelected.selectedDates).toBe(MOCK_SELECTED_DATES);
    });

    it('should call addToCart', () => {
      spyOn(component, 'addToCart');

      component.addToCart();

      expect(component.addToCart).toHaveBeenCalled();
    });
  });

  describe('addToCart', () => {
    beforeEach(() => {
      component.onDateFocus(MOCK_PROITEM);
      component.onApplyCalendar(MOCK_SELECTED_DATES);
      spyOn(cartService, 'add');
    });

    it('should call cartService add', () => {
      component.addToCart();
      expect(cartService.add).toHaveBeenCalledWith(MOCK_PROITEM, MOCK_PROITEM.bumpType);
    });

    it('should hide calendar', () => {
      expect(component.calendarHidden).toBe(true);
    });
  });

});
