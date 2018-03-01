import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CartComponent } from './cart.component';
import { CustomCurrencyPipe } from '../../../shared/custom-currency/custom-currency.pipe';
import { DecimalPipe } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CartService } from './cart.service';
import { Observable } from 'rxjs/Observable';
import { Cart } from './cart';
import { CartChange } from './cart-item.interface';
import { ITEM_ID, MockTrackingService } from 'shield';
import { CART_ITEM_CITYBUMP, CART_ORDER, MOCK_ITEM_V3 } from '../../../../tests/item.fixtures';
import { ItemService } from '../../../core/item/item.service';
import { ErrorsService } from '../../../core/errors/errors.service';
import { TrackingService } from '../../../core/tracking/tracking.service';

describe('CartComponent', () => {
  let component: CartComponent;
  let fixture: ComponentFixture<CartComponent>;
  let cartService: CartService;
  let itemService: ItemService;
  let errorService: ErrorsService;

  const CART = new Cart();
  const CART_CHANGE: CartChange = {
    action: 'add',
    cart: CART,
    itemId: ITEM_ID,
    type: 'citybump'
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CartComponent, CustomCurrencyPipe],
      providers: [
        DecimalPipe,
        {
          provide: TrackingService, useClass: MockTrackingService
        },
        {
          provide: CartService, useValue: {
          cart$: Observable.of(CART_CHANGE),
          remove() {
          },
          clean() {
          }
        }
        },
        {
          provide: ItemService, useValue: {
          purchaseProducts() {
            return Observable.of({});
          }
        }
        },
        {
          provide: ErrorsService, useValue: {
          i18nError() {
          },
          show() {
          }
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
    cartService = TestBed.get(CartService);
    itemService = TestBed.get(ItemService);
    errorService = TestBed.get(ErrorsService);
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

  describe('remove', () => {
    it('should call remove', () => {
      const TYPE = 'citybump';
      spyOn(cartService, 'remove');

      component.remove(CART_ITEM_CITYBUMP, TYPE);

      expect(cartService.remove).toHaveBeenCalledWith(MOCK_ITEM_V3.id, TYPE);
    });
  });

  describe('clean', () => {
    it('should call clean', () => {
      spyOn(cartService, 'clean');

      component.clean();

      expect(cartService.clean).toHaveBeenCalled();
    });
  });

  describe('checkout', () => {
    let eventId: string;

    describe('success', () => {
      beforeEach(() => {
        spyOn(component.cart, 'prepareOrder').and.returnValue(CART_ORDER);
        spyOn(component.cart, 'getOrderId').and.returnValue('UUID');
        spyOn(itemService, 'purchaseProducts').and.returnValue(Observable.of([]));
        eventId = null;
        component.sabadellSubmit.subscribe((id: string) => {
          eventId = id;
        });

        component.checkout();
      });

      it('should submit sabadell with orderId', () => {
        expect(eventId).toBe('UUID');
      });

      it('should call purchaseProducts', () => {
        expect(itemService.purchaseProducts).toHaveBeenCalledWith(CART_ORDER, 'UUID');
      });
    });


    describe('error', () => {
      it('should call toastr', () => {
        spyOn(itemService, 'purchaseProducts').and.returnValue(Observable.throw({
          text() {
            return '';
          }
        }));
        spyOn(errorService, 'i18nError');

        component.checkout();

        expect(errorService.i18nError).toHaveBeenCalledWith('bumpError');
      });
    });

  });
});
