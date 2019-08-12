import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CartComponent } from './cart.component';
import { CustomCurrencyPipe } from '../../custom-currency/custom-currency.pipe';
import { DecimalPipe } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CartService } from './cart.service';
import { Observable } from 'rxjs';
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
import { PaymentService } from '../../../core/payments/payment.service';
import { MockTrackingService } from '../../../../tests/tracking.fixtures.spec';
import { FINANCIAL_CARD } from '../../../../tests/payments.fixtures.spec';
import { CardSelectionComponent } from '../../payments/card-selection/card-selection.component';
import { NgbButtonsModule } from '@ng-bootstrap/ng-bootstrap';
import { EventService } from '../../../core/event/event.service';
import { StripeService } from '../../../core/stripe/stripe.service';
import { FINANCIAL_CARD_OPTION, STRIPE_CARD_OPTION } from '../../../../tests/stripe.fixtures.spec';

describe('CartComponent', () => {
  let component: CartComponent;
  let fixture: ComponentFixture<CartComponent>;
  let cartService: CartService;
  let itemService: ItemService;
  let errorService: ErrorsService;
  let paymentService: PaymentService;
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
      declarations: [CartComponent, CustomCurrencyPipe, CardSelectionComponent],
      providers: [
        DecimalPipe,
        EventService,
        {
          provide: TrackingService, useClass: MockTrackingService
        },
        {
          provide: CartService, useValue: {
          cart$: Observable.of(CART_CHANGE),
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
            return Observable.of({});
          },
          deselectItems() {
          },
          purchaseProductsWithCredits() {
            return Observable.of({
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
          provide: PaymentService, useValue: {
          getFinancialCard() {
          },
          pay() {
            return Observable.of('');
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
          buy() {},
          isPaymentMethodStripe$() {
            return Observable.of(true);
          },
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
    paymentService = TestBed.get(PaymentService);
    router = TestBed.get(Router);
    trackingService = TestBed.get(TrackingService);
    eventService = TestBed.get(EventService);
    stripeService = TestBed.get(StripeService);
    spyOn(paymentService, 'getFinancialCard').and.returnValue(Observable.of(FINANCIAL_CARD));
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

    it('should call stripeService.isPaymentMethodStripe$', () => {
      spyOn(stripeService, 'isPaymentMethodStripe$').and.callThrough();

      component.ngOnInit();

      expect(stripeService.isPaymentMethodStripe$).toHaveBeenCalled();
    });

    it('should set isStripe to the value returned by stripeService.isPaymentMethodStripe$', () => {
      const expectedValue = true;
      spyOn(stripeService, 'isPaymentMethodStripe$').and.returnValue(Observable.of(expectedValue));

      component.ngOnInit();

      expect(component.isStripe).toBe(expectedValue);
    });
  });

  describe('hasCard', () => {
    it('should set true if card exists', () => {
      component.hasCard(true);

      expect(component.hasFinancialCard).toEqual(true);
    });
  });

  describe('hasStripeCard', () => {
    it('should set true if stripe card exists', () => {
      component.hasStripeCard(true);

      expect(component.isStripeCard).toEqual(true);
    });

    it('should not call addNewCard if stripe card exists', () => {
      spyOn(component, 'addNewCard').and.callThrough();

      component.hasStripeCard(true);

      expect(component.addNewCard).not.toHaveBeenCalled();
    });

    it('should call addNewCard if stripe card does not exist', () => {
      spyOn(component, 'addNewCard').and.callThrough();

      component.hasStripeCard(false);

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

    describe('success', () => {

      beforeEach(() => {
        spyOn(component.cart, 'prepareOrder').and.returnValue(CART_ORDER);
        spyOn(component.cart, 'getOrderId').and.returnValue('UUID');
        spyOn(trackingService, 'track');
        spyOn(localStorage, 'setItem');
        spyOn(eventService, 'emit');
        eventId = null;
        component.sabadellSubmit.subscribe((id: string) => {
          eventId = id;
        });
        component.isStripe = false;
      });

      it('should set localStorage with transaction type', () => {
        component.checkout();

        expect(localStorage.setItem).toHaveBeenCalledWith('transactionType', 'bump');
      });

      it('should emit TOTAL_CREDITS_UPDATED event', () => {
        component.checkout();

        expect(eventService.emit).toHaveBeenCalledWith(EventService.TOTAL_CREDITS_UPDATED);
      });

      describe('with payment_needed true', () => {

        describe('without credit card', () => {
          it('should submit sabadell with orderId', () => {
            component.hasFinancialCard = false;

            component.checkout();

            expect(eventId).toBe('UUID');
          });
        });

        describe('with credit card', () => {

          beforeEach(() => {
            component.hasFinancialCard = true;
          });

          describe('user wants new one', () => {

            it('should submit sabadell with orderId', () => {
              component.cardType = 'new';

              component.checkout();

              expect(eventId).toBe('UUID');
            });
          });

          describe('user wants old one', () => {
            beforeEach(() => {
              spyOn(router, 'navigate');
            });

            describe('payment ok', () => {
              beforeEach(() => {
                spyOn(paymentService, 'pay').and.callThrough();
                spyOn(itemService, 'deselectItems');
                itemService.selectedAction = 'feature';

                component.checkout();
              });

              it('should redirect to code 200', () => {
                expect(router.navigate).toHaveBeenCalledWith(['catalog/list', {code: 200}]);
                expect(paymentService.pay).toHaveBeenCalledWith('UUID');
              });

              it('should call deselectItems', () => {
                expect(itemService.deselectItems).toHaveBeenCalled();
                expect(itemService.selectedAction).toBeNull();
                expect(paymentService.pay).toHaveBeenCalledWith('UUID');
              });
            });

            describe('payment ko', () => {
              beforeEach(() => {
                spyOn(paymentService, 'pay').and.returnValue(Observable.throw(''));

                component.checkout();
              });

              it('should redirect to code -1', () => {
                expect(router.navigate).toHaveBeenCalledWith(['catalog/list', {code: -1}]);
                expect(paymentService.pay).toHaveBeenCalledWith('UUID');
              });
            });
          });
        });

        describe('track', () => {

          beforeEach(() => {
            component.creditInfo.credit = 0;
            component.cart = CART;
            component.cart.total = 1;
          });

          describe('Sabadell', () => {

            it('should call track of trackingService with valid attributes', () => {
              component.checkout();

              expect(trackingService.track).toHaveBeenCalledWith(TrackingService.MYCATALOG_PURCHASE_CHECKOUTCART, {
                selected_products: CART_ORDER_TRACK,
                payment_method: 'SABADELL'
              });
            });

          });

          describe('Stripe', () => {
            it('should call track of trackingService with valid attributes', () => {
              component.isStripe = true;

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
          spyOn(itemService, 'purchaseProductsWithCredits').and.returnValue(Observable.of({
            payment_needed: false,
            items_failed: []
          }));
          spyOn(paymentService, 'pay').and.callThrough();
          spyOn(itemService, 'deselectItems');
          spyOn(router, 'navigate');
          itemService.selectedAction = 'feature';

          component.checkout();
        });

        it('should redirect to code 200', () => {
          expect(router.navigate).toHaveBeenCalledWith(['catalog/list', {code: 200}]);
        });

        it('should call deselectItems', () => {
          expect(itemService.deselectItems).toHaveBeenCalled();
          expect(itemService.selectedAction).toBeNull();
        });

        it('should call track of trackingService without any payment_method attribute', () => {
          expect(trackingService.track).toHaveBeenCalledWith(TrackingService.MYCATALOG_PURCHASE_CHECKOUTCART, {
            selected_products: CART_ORDER_TRACK
          });
        });

      });

    });

    describe('error', () => {
      it('should call toastr', () => {
        spyOn(itemService, 'purchaseProductsWithCredits').and.returnValue(Observable.throw({
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
