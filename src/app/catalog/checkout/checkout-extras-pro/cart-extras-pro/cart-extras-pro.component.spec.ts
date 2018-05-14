import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CartExtrasProComponent } from './cart-extras-pro.component';
import { CartService } from '../../cart/cart.service';
import { PaymentService } from '../../../../core/payments/payment.service';
import { Observable } from 'rxjs/Observable';
import { CartProExtras } from '../../cart/cart-pro-extras';
import { CartChange } from '../../cart/cart-item.interface';
import { PACK_ID, FINANCIAL_CARD, PREPARED_PACKS, ORDER_CART_EXTRAS_PRO } from '../../../../../tests/payments.fixtures.spec';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CustomCurrencyPipe } from '../../../../shared/custom-currency/custom-currency.pipe';
import { DecimalPipe } from '@angular/common';
import { Router } from '@angular/router';
import { TrackingService } from '../../../../core/tracking/tracking.service';
import { ErrorsService } from '../../../../core/errors/errors.service';
import { MockTrackingService } from '../../../../../tests/tracking.fixtures.spec';

describe('CartExtrasProComponent', () => {
  let component: CartExtrasProComponent;
  let fixture: ComponentFixture<CartExtrasProComponent>;
  let cartService: CartService;
  let paymentService: PaymentService;
  let errorsService: ErrorsService;
  let router: Router;
  let trackingService: TrackingService;

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
        {
          provide: CartService, useValue: {
            createInstance() { },
            clean() { },
            removeProExtras() { },
            cart$: Observable.of(CART_CHANGE)
          }
        },
        {
          provide: PaymentService, useValue: {
            getBillingInfo() {
              return Observable.of({});
            },
            getFinancialCard() { },
            pay() {
              return Observable.of('');
            },
            orderExtrasProPack() {
              return Observable.of({});
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
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CartExtrasProComponent);
    component = fixture.componentInstance;
    cartService = TestBed.get(CartService);
    paymentService = TestBed.get(PaymentService);
    errorsService = TestBed.get(ErrorsService);
    router = TestBed.get(Router);
    trackingService = TestBed.get(TrackingService);
    spyOn(paymentService, 'getFinancialCard').and.returnValue(Observable.of(FINANCIAL_CARD));
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

    it('should set card', () => {
      expect(component.financialCard).toEqual(FINANCIAL_CARD);
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
        spyOn(paymentService, 'orderExtrasProPack').and.callThrough();
        spyOn(component.cart, 'prepareOrder').and.returnValue(ORDER_CART_EXTRAS_PRO);
        eventId = null;
        component.sabadellSubmit.subscribe((id: string) => {
          eventId = id;
        });
      });

      it('should call paymentService orderExtrasProPack method to create a pack order', () => {
        component.checkout();

        expect(paymentService.orderExtrasProPack).toHaveBeenCalledWith(ORDER_CART_EXTRAS_PRO);
      });

      describe('if paymentService OrderExtrasProPack is successful', () => {
        beforeEach(() => {
          spyOn(trackingService, 'track');

          component.checkout();
        });

        it('should call track', () => {
          expect(trackingService.track).toHaveBeenCalledWith(TrackingService.PRO_PURCHASE_CHECKOUTPROEXTRACART, {
            selected_packs: ORDER_CART_EXTRAS_PRO.packs
          });
        });

        describe('buy method', () => {
          describe('should call sabadellSubmit emit', () => {
            it('if there is not financial card', () => {
              component.financialCard = null;

              component.checkout();

              expect(eventId).toBe('UUID');
            });

            it('if the cardtype is new', () => {
              component.cardType = 'new';

              component.checkout();

              expect(eventId).toBe('UUID');
            });
          });

          describe('should call paymentService pay method', () => {
            it('if there is a financial card and cartype is old', () => {
              spyOn(paymentService, 'pay').and.callThrough();

              component.checkout();

              expect(paymentService.pay).toHaveBeenCalledWith(ORDER_CART_EXTRAS_PRO.id);
            });

            it('should navigate to catalog with code 200 if the payment was ok', () => {
              spyOn(paymentService, 'pay').and.callThrough();
              spyOn(router, 'navigate').and.callThrough();

              component.checkout();

              expect(router.navigate).toHaveBeenCalledWith(['pro/catalog/list', { code: 200 }]);
            });

            it('should navigate to catalog with code -1 if the payment was ko', () => {
              spyOn(paymentService, 'pay').and.returnValue(Observable.throw(''));
              spyOn(router, 'navigate').and.callThrough();

              component.checkout();

              expect(router.navigate).toHaveBeenCalledWith(['pro/catalog/list', { code: -1 }]);
            });
          });
        });
      });

      describe('error', () => {
        it('should call toastr', () => {
          paymentService.orderExtrasProPack = jasmine.createSpy().and.returnValue(Observable.throw({
            text() {
              return '';
            }
          }));
          spyOn(errorsService, 'i18nError');

          component.checkout();

          expect(errorsService.i18nError).toHaveBeenCalledWith('bumpError');
        });
      });
    });

    it('no billing info', () => {
      spyOn(paymentService, 'getBillingInfo').and.returnValue(Observable.throw({}));
      spyOn(component.billingInfoNeeds, 'emit').and.callThrough();

      component.checkout();

      expect(component.billingInfoNeeds.emit).toHaveBeenCalledWith(true);
    });
  });
});
