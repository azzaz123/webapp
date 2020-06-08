
import {of as observableOf, throwError } from 'rxjs';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CartExtrasProComponent } from './cart-extras-pro.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { CartService } from '../../../shared/catalog/cart/cart.service';
import { PaymentService } from '../../../core/payments/payment.service';
import { ErrorsService } from '../../../core/errors/errors.service';
import { TrackingService } from '../../../core/tracking/tracking.service';
import { CartProExtras } from '../../../shared/catalog/cart/cart-pro-extras';
import { CartChange } from '../../../shared/catalog/cart/cart-item.interface';
import { CustomCurrencyPipe } from '../../../shared/pipes';
import {
  BILLING_INFO_RESPONSE,
  ORDER_CART_EXTRAS_PRO, PACK_ID,
  PREPARED_PACKS
} from '../../../../tests/payments.fixtures.spec';
import { MockTrackingService } from '../../../../tests/tracking.fixtures.spec';
import { StripeService } from '../../../core/stripe/stripe.service';
import { EventService } from '../../../core/event/event.service';
import { STRIPE_CARD_OPTION } from '../../../../tests/stripe.fixtures.spec';

describe('CartExtrasProComponent', () => {
  let component: CartExtrasProComponent;
  let fixture: ComponentFixture<CartExtrasProComponent>;
  let cartService: CartService;
  let paymentService: PaymentService;
  let errorsService: ErrorsService;
  let router: Router;
  let trackingService: TrackingService;
  let stripeService: StripeService;
  let eventService: EventService;

  const CART_PRO_EXTRAS = new CartProExtras();
  const CART_CHANGE: CartChange = {
    action: 'add',
    cart: CART_PRO_EXTRAS,
    packId: PACK_ID,
    type: 'citybump'
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CartExtrasProComponent, CustomCurrencyPipe ],
      providers: [
        DecimalPipe,
        EventService,
        {
          provide: CartService, useValue: {
            createInstance() { },
            clean() { },
            removeProExtras() { },
            cart$: observableOf(CART_CHANGE)
          }
        },
        {
          provide: PaymentService, useValue: {
            getBillingInfo() {
              return observableOf({});
            },
            orderExtrasProPack() {
              return observableOf({});
            },
            updateBillingInfo() {
              return observableOf({});
            }
          },
        },
        {
          provide: TrackingService, useClass: MockTrackingService
        },
        {
          provide: ErrorsService, useValue: {
            i18nError() { },
            show() { }
          }
        },
        {
          provide: Router, useValue: {
            navigate() { }
          }
        },
        {
          provide: StripeService, useValue: {
            buy() {},
            getCards() {
              return observableOf(true);
            }
          }
        },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CartExtrasProComponent);
    component = fixture.componentInstance;
    component.billingInfoForm = new FormGroup({
      cif: new FormControl(),
      city: new FormControl(),
      company_name: new FormControl(),
      country: new FormControl(),
      email: new FormControl(),
      name: new FormControl(),
      postal_code: new FormControl(),
      street: new FormControl(),
      surname: new FormControl(),
      id: new FormControl(),
      type: new FormControl()
    });
    cartService = TestBed.get(CartService);
    paymentService = TestBed.get(PaymentService);
    errorsService = TestBed.get(ErrorsService);
    router = TestBed.get(Router);
    trackingService = TestBed.get(TrackingService);
    stripeService = TestBed.get(StripeService);
    eventService = TestBed.get(EventService);
    fixture.detectChanges();
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      spyOn(cartService, 'createInstance').and.callThrough();

      component.ngOnInit();
    });

    it('should call createInstance cartService method', () => {
      expect(cartService.createInstance).toHaveBeenCalledWith(new CartProExtras());
    });

    it('should set cart pro extras', () => {
      expect(component.cart).toEqual(CART_PRO_EXTRAS);
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
    beforeEach(() => {
      spyOn(cartService, 'clean');

      component.ngOnDestroy();
    });

    it('should set active false', () => {
      expect(component['active']).toBe(false);
    });

    it('should call cartService clean method', () => {
      expect(cartService.clean).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should call cartService removeProExtras method with parameters', () => {
      spyOn(cartService, 'removeProExtras');

      component.remove(PREPARED_PACKS[0].packs[0], 0);

      expect(cartService.removeProExtras).toHaveBeenCalledWith(
        PREPARED_PACKS[0].packs[0].id, PREPARED_PACKS[0].packs[0].name.toLowerCase(), 0
      );
    });
  });

  describe('clear', () => {
    it('should call cartService clean method', () => {
      spyOn(cartService, 'clean');

      component.clean();

      expect(cartService.clean).toHaveBeenCalled();
    });
  });

  describe('checkout', () => {
    let eventId: string;
    it('should call paymentService getBillingInfo method', () => {
      spyOn(paymentService, 'getBillingInfo').and.callThrough();

      component.checkout();

      expect(paymentService.getBillingInfo).toHaveBeenCalled();
    });

    describe('already has billing info', () => {
      beforeEach(() => {
        spyOn(component.cart, 'prepareOrder').and.returnValue(ORDER_CART_EXTRAS_PRO);
        eventId = null;
      });

      it('should call paymentService orderExtrasProPack method to create a pack order', () => {
        spyOn(paymentService, 'orderExtrasProPack').and.callThrough();
        
        component.checkout();

        expect(paymentService.orderExtrasProPack).toHaveBeenCalledWith(ORDER_CART_EXTRAS_PRO);
      });

      describe('when unkown error', () => {
        it('should call toastr with bump error', () => {
          spyOn(paymentService, 'orderExtrasProPack').and.returnValue(throwError('Unknown'));
          spyOn(errorsService, 'i18nError');

          component.checkout();

          expect(errorsService.i18nError).toHaveBeenCalledWith('bumpError');
        });
      });
    });

    describe('no billing info', () => {
      it('should emit a event', () => {
        spyOn(paymentService, 'getBillingInfo').and.returnValue(throwError({}));
        spyOn(component.billingInfoMissing, 'emit').and.callThrough();

        component.checkout();

        expect(component.billingInfoMissing.emit).toHaveBeenCalledWith(true);
      });

      describe('saveAndCheckout', () => {
        describe('form valid', () => {
          beforeEach(() => {
            component.billingInfoForm.setValue(BILLING_INFO_RESPONSE);
          });

          it('should update billing info', () => {
            spyOn(paymentService, 'updateBillingInfo').and.callThrough();

            component.saveAndCheckout();

            expect(paymentService.updateBillingInfo).toHaveBeenCalledWith(component.billingInfoForm.value);
          });

          it('should show error if call fails', () => {
            spyOn(errorsService, 'show');
            spyOn(paymentService, 'updateBillingInfo').and.returnValue(throwError('error'));

            component.saveAndCheckout();

            expect(errorsService.show).toHaveBeenCalledWith('error');
          });
        });
      });
    });
  });
});
