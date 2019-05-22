import { fakeAsync, TestBed } from '@angular/core/testing';
import { Observable, Subject } from 'rxjs';
import { HttpService } from '../http/http.service';
import { TEST_HTTP_PROVIDERS } from '../../../tests/utils.spec';
import { UserService } from '../user/user.service';
import { StripeService } from './stripe.service';
import { EventService } from '../event/event.service';
import { PaymentService } from '../payments/payment.service';
import { PaymentIntents, PaymentMethodCardResponse, PaymentMethodResponse } from '../payments/payment.interface';
import { Router } from '@angular/router';
import { USER_DATA } from '../../../tests/user.fixtures.spec';
import { FinancialCard } from '../../shared/profile/credit-card-info/financial-card';
import { PAYMENT_METHOD_CARD_RESPONSE, PAYMENT_METHOD_DATA } from '../../../tests/payments.fixtures.spec';
import { ResponseOptions, Response } from '@angular/http';
import { createFinancialCardFixture } from '../../../tests/stripe.fixtures.spec';


describe('StripeService', () => {

  let service: StripeService;
  let http: HttpService;
  let eventService: EventService;
  let paymentService: PaymentService;
  let userService: UserService;
  let router: Router;
  const routerEvents: Subject<any> = new Subject();

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ...TEST_HTTP_PROVIDERS,
        EventService,
        StripeService,
        {
          provide: UserService, useValue: {
          hasPerm() {
            return Observable.of(true);
          }
        }
        },
        {
          provide: Router, useValue: {
          navigate() {
          },
          events: routerEvents
        }
        },
        {
          provide: UserService, useValue: {
          me() {
            return Observable.of(USER_DATA);
          }
        }
        },
        {
          provide: PaymentService, useValue: {
          paymentIntent() {
            return Observable.of({
              token: 'a1-b2-c3-d4'
            })
          }
        }
        }
      ]
    });
    service = TestBed.get(StripeService);
    http = TestBed.get(HttpService);
    eventService = TestBed.get(EventService);
    paymentService = TestBed.get(PaymentService);
    userService = TestBed.get(UserService);
    router = TestBed.get(Router);
  });

  describe('buy', () => {
    const paymentId = 'a1-b2-c3-d4';
    const orderId = '1';
    it('should call paymentIntent', () => {
      const PAYMENT_INTENT_RESPONSE = {
        token: paymentId,
      };
      let response: any;

      userService.me = jasmine.createSpy().and.returnValue(Observable.of(USER_DATA));
      paymentService.paymentIntent(orderId, paymentId).subscribe((data: PaymentIntents) => {
        response = data;
      });

      expect(response).toEqual(PAYMENT_INTENT_RESPONSE);
    });
  });

  describe('isPaymentMethodStripe', () => {
    it('should set stripe to true if PAYMENT_PROVIDER_STRIPE is true', () => {
      service.PAYMENT_PROVIDER_STRIPE = true;
      const isStripe = service.isPaymentMethodStripe();

      expect(isStripe).toBe(true);
    });

    it('should set stripe to false if PAYMENT_PROVIDER_STRIPE is false', () => {
      service.PAYMENT_PROVIDER_STRIPE = false;
      const isStripe = service.isPaymentMethodStripe();

      expect(isStripe).toBe(false);
    });
  });

  describe('getCards', () => {
    let response: FinancialCard[];

    beforeEach(fakeAsync(() => {
      const res: ResponseOptions = new ResponseOptions({body: JSON.stringify(PAYMENT_METHOD_CARD_RESPONSE)});
      spyOn(http, 'get').and.returnValue(Observable.of(new Response(res)));
      service.getCards().subscribe((data: FinancialCard[]) => {
        response = data;
      });
    }));

    it('should return an array of financial cards', () => {
      expect(response[0]).toEqual(createFinancialCardFixture());
    });
  });

  describe('addNewCrd', () => {
    it('should call the endpoint with post', fakeAsync(() => {
      const paymentMethodId = 'a0b1c2';
      spyOn(http, 'put').and.returnValue(Observable.of({}));

      service.addNewCard(paymentMethodId).subscribe();

      expect(http.put).toHaveBeenCalledWith(`api/v3/payments/c2b/stripe/payment_methods/${paymentMethodId}/attach`);
    }));
  });

  describe('mapPaymentResponse', () => {
    it('should return a FinancialCard object', () => {
      const financialCard: FinancialCard = service.mapResponse(PAYMENT_METHOD_DATA);

      expect(financialCard).toEqual(createFinancialCardFixture());
    });
  });
  
});


