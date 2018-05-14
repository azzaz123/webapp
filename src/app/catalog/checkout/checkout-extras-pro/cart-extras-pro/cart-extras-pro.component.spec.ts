import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CartExtrasProComponent } from './cart-extras-pro.component';
import { CartService } from '../../cart/cart.service';
import { PaymentService } from '../../../../core/payments/payment.service';
import { Observable } from 'rxjs/Observable';
import { CartProExtras } from '../../cart/cart-pro-extras';
import { CartChange } from '../../cart/cart-item.interface';
import { PACK_ID, FINANCIAL_CARD, PREPARED_PACKS } from '../../../../../tests/payments.fixtures.spec';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CustomCurrencyPipe } from '../../../../shared/custom-currency/custom-currency.pipe';
import { DecimalPipe } from '@angular/common';
import { Router } from '@angular/router';
import { TrackingService } from '../../../../core/tracking/tracking.service';
import { ErrorsService } from '../../../../core/errors/errors.service';
import { MockTrackingService } from '../../../../../tests/tracking.fixtures.spec';

fdescribe('CartExtrasProComponent', () => {
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
    describe('already has billing info', () => {
      it('should call paymentService getBillingInfo method', () => {
        spyOn(paymentService, 'getBillingInfo').and.callThrough();

        component.checkout();

        expect(paymentService.getBillingInfo).toHaveBeenCalled();
      });
    });
  });
});
