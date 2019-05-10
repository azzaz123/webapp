import { fakeAsync, TestBed } from '@angular/core/testing';
import { Response, ResponseOptions } from '@angular/http';
import { Observable, Subject } from 'rxjs';
import { HttpService } from '../http/http.service';
import { TEST_HTTP_PROVIDERS } from '../../../tests/utils.spec';
import { UserService } from '../user/user.service';
import { StripeService } from './stripe.service';
import { EventService } from '../event/event.service';
import { PaymentService } from '../payments/payment.service';
import { PaymentIntents } from '../payments/payment.interface';
import { Router, ActivatedRoute } from '@angular/router';
import { USER_DATA } from '../../../tests/user.fixtures.spec';


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
  
  describe('set payment method to stripe', () => {
    service.isPaymentMethodStripe();
    expect(service.PAYMENT_PROVIDER_STRIPE).toEqual(true);
  });

});


