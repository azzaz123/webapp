
import {throwError as observableThrowError,  Observable, of } from 'rxjs';
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { CartComponent } from './cart.component';
import { CustomCurrencyPipe } from '../../pipes';
import { DecimalPipe } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CartService } from './cart.service';
import { Cart } from './cart';
import { CartChange } from './cart-item.interface';
import {
  CART_ITEM_CITYBUMP,
  CART_ORDER,
  CART_ORDER_TRACK,
  ITEM_ID,
  MOCK_ITEM_V3
} from '../../../../tests/item.fixtures.spec';
import { ItemService } from '../../../core/item/item.service';
import { ErrorsService } from '../../../core/errors/errors.service';
import { TrackingService } from '../../../core/tracking/tracking.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MockTrackingService } from '../../../../tests/tracking.fixtures.spec';
import { NgbButtonsModule } from '@ng-bootstrap/ng-bootstrap';
import { EventService } from '../../../core/event/event.service';
import { StripeService } from '../../../core/stripe/stripe.service';
import { STRIPE_CARD_OPTION } from '../../../../tests/stripe.fixtures.spec';

describe('CartComponent', () => {
  let component: CartComponent;
  let fixture: ComponentFixture<CartComponent>;
  let cartService: CartService;
  let itemService: ItemService;
  let errorService: ErrorsService;
  let router: Router;
  let trackingService: TrackingService;
  let eventService: EventService;
  let stripeService: StripeService;

  const CART = new Cart();
  const CART_CHANGE: CartChange = {
    action: 'add',
    cart: CART,
    itemId: ITEM_ID,
    type: 'citybump'
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, NgbButtonsModule],
      declarations: [CartComponent, CustomCurrencyPipe],
      providers: [
        DecimalPipe,
        EventService,
        {
          provide: TrackingService, useClass: MockTrackingService
        },
        {
          provide: CartService, useValue: {
          cart$: of(CART_CHANGE),
          createInstance() {
          },
          remove() {
          },
          clean() {
          }
        }
        },
        {
          provide: ItemService, useValue: {
          purchaseProducts() {
            return of({});
          },
          deselectItems() {
          },
          purchaseProductsWithCredits() {
            return of({
              payment_needed: true
            });
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
        },
        {
          provide: Router, useValue: {
          navigate() {
          }
        }
        },
        {
          provide: StripeService, useValue: {
            buy() {}
          }
        },
      ],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CartComponent);
    component = fixture.componentInstance;
    cartService = TestBed.get(CartService);
    itemService = TestBed.get(ItemService);
    errorService = TestBed.get(ErrorsService);
    router = TestBed.get(Router);
    trackingService = TestBed.get(TrackingService);
    eventService = TestBed.get(EventService);
    stripeService = TestBed.get(StripeService);
    component.creditInfo = {
      currencyName: 'wallacoins',
      credit: 200,
      factor: 100
    };
    fixture.detectChanges();
  });

  describe('ngOnInit', () => {
    it('should call createInstance cartService method', () => {
      spyOn(cartService, 'createInstance').and.callThrough();

      component.ngOnInit();

      expect(cartService.createInstance).toHaveBeenCalledWith(new Cart());
    });

    it('should set cart', () => {
      expect(component.cart).toEqual(CART);
    });
  });

  describe('hasCard', () => {
    it('should set true if stripe card exists', () => {
      component.hasCard(true);

      expect(component.hasSavedCard).toEqual(true);
    });

    it('should not call addNewCard if stripe card exists', () => {
      spyOn(component, 'addNewCard').and.callThrough();

      component.hasCard(true);

      expect(component.addNewCard).not.toHaveBeenCalled();
    });

    it('should call addNewCard if stripe card does not exist', () => {
      spyOn(component, 'addNewCard').and.callThrough();

      component.hasCard(false);

      expect(component.addNewCard).toHaveBeenCalledTimes(1);
    });
  });

  describe('addNewCard', () => {
    it('should set showCard to true', () => {
      component.addNewCard();

      expect(component.showCard).toEqual(true);
    });
  });

  describe('setSavedCard', () => {
    it('should set showCard to false, savedCard to true and setCardInfo', () => {
      spyOn(component, 'setCardInfo').and.callThrough();

      component.setSavedCard(STRIPE_CARD_OPTION);

      expect(component.showCard).toEqual(false);
      expect(component.savedCard).toEqual(true);
      expect(component.setCardInfo).toHaveBeenCalledWith(STRIPE_CARD_OPTION);
    });
  });

  describe('ngOnDestroy', () => {
    it('should set active false', () => {
      component.ngOnDestroy();

      expect(component['active']).toBeFalsy();
    });

    it('should call clean', () => {
      spyOn(cartService, 'clean');

      component.ngOnDestroy();

      expect(cartService.clean).toHaveBeenCalled();
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

    it('should not proceed if cart is empty or loading', () => {
      spyOn(itemService, 'purchaseProductsWithCredits').and.callThrough();

      component.cart = CART;
      component.cart.total = null;

      expect(itemService.purchaseProductsWithCredits).not.toHaveBeenCalled()
    });

    describe('success', () => {

      beforeEach(() => {
        spyOn(component.cart, 'prepareOrder').and.returnValue(CART_ORDER);
        spyOn(component.cart, 'getOrderId').and.returnValue('UUID');
        spyOn(trackingService, 'track');
        spyOn(localStorage, 'setItem');
        spyOn(eventService, 'emit');

        eventId = null;
        component.cart = CART;
        component.cart.total = 1;
        component.loading = false;
      });

      it('should set localStorage with transaction type', fakeAsync(() => {
        component.creditInfo.credit = 0;
        component.checkout();
        tick(2000);

        expect(localStorage.setItem).toHaveBeenCalledWith('transactionType', 'bump');
      }));

      it('should emit TOTAL_CREDITS_UPDATED event', fakeAsync(() => {
        component.checkout();
        tick(2000);

        expect(eventService.emit).toHaveBeenCalledWith(EventService.TOTAL_CREDITS_UPDATED);
      }));

      describe('with payment_needed true', () => {
        describe('track', () => {
          beforeEach(() => {
            component.creditInfo.credit = 0;
            component.cart = CART;
            component.cart.total = 1;
          });

          describe('Stripe', () => {
            it('should call track of trackingService with valid attributes', () => {
              component.checkout();

              expect(trackingService.track).toHaveBeenCalledWith(TrackingService.MYCATALOG_PURCHASE_CHECKOUTCART, {
                selected_products: CART_ORDER_TRACK,
                payment_method: 'STRIPE'
              });
            });
          });

        });
      });

      describe('with payment_needed false', () => {
        beforeEach(() => {
          spyOn(itemService, 'purchaseProductsWithCredits').and.returnValue(of({
            payment_needed: false,
            items_failed: []
          }));
          spyOn(itemService, 'deselectItems');
          spyOn(router, 'navigate');
          itemService.selectedAction = 'feature';
        });

        it('should redirect to code 200', fakeAsync(() => {
          component.checkout();
          tick(2000);

          expect(router.navigate).toHaveBeenCalledWith(['catalog/list', {code: 200}]);
        }));

        it('should call deselectItems', fakeAsync(() => {
          component.checkout();
          tick(2000);

          expect(itemService.deselectItems).toHaveBeenCalled();
          expect(itemService.selectedAction).toBeNull();
        }));

        it('should call track of trackingService without any payment_method attribute', fakeAsync(() => {
          component.checkout();
          tick(2000);

          expect(trackingService.track).toHaveBeenCalledWith(TrackingService.MYCATALOG_PURCHASE_CHECKOUTCART, {
            selected_products: CART_ORDER_TRACK
          });
        }));

      });

    });

    describe('error', () => {
      it('should call toastr', fakeAsync(() => {
        spyOn(itemService, 'purchaseProductsWithCredits').and.returnValue(observableThrowError({
          text() {
            return '';
          }
        }));
        spyOn(errorService, 'i18nError');

        component.checkout();
        tick(2000);

        expect(errorService.i18nError).toHaveBeenCalledWith('bumpError');
      }));
    });

  });

  describe('totalToPay', () => {

    beforeEach(() => {
      component.cart = null;
    });

    it('should return 0 if no cart', () => {
      expect(component.totalToPay).toBe(0);
    });

    it('should return 0 if credits to pay < user credits', () => {
      component.cart = CART;
      CART.total = 1;

      expect(component.totalToPay).toBe(0);
    });

    it('should return the total to pay otherwise', () => {
      component.cart = CART;
      CART.total = 5;

      expect(component.totalToPay).toBe(3);
    });
  });

  describe('usedCredits', () => {

    beforeEach(() => {
      component.cart = null;
    });

    it('should return 0 if no cart', () => {
      expect(component.usedCredits).toBe(0);
    });

    it('should return -credits if credits to pay < user credits', () => {
      component.cart = CART;
      CART.total = 1;

      expect(component.usedCredits).toBe(-100);
    });

    it('should return -creditInfo.credit otherwise', () => {
      component.cart = CART;
      CART.total = 5;

      expect(component.usedCredits).toBe(-200);
    });
  });
});
