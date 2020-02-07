import { TestBed } from '@angular/core/testing';
import { Observable, Subject } from 'rxjs';
import { UserService } from '../user/user.service';
import { StripeService, PAYMENTS_API_URL } from './stripe.service';
import { EventService } from '../event/event.service';
import { PaymentService } from '../payments/payment.service';
import { PaymentIntents} from '../payments/payment.interface';
import { Router } from '@angular/router';
import { USER_DATA } from '../../../tests/user.fixtures.spec';
import { FinancialCard } from '../../shared/profile/credit-card-info/financial-card';
import { PAYMENT_METHOD_CARD_RESPONSE, PAYMENT_METHOD_DATA } from '../../../tests/payments.fixtures.spec';
import { createFinancialCardFixture } from '../../../tests/stripe.fixtures.spec';
import { FeatureflagService } from '../user/featureflag.service';
import { environment } from '../../../environments/environment';
import { TestRequest, HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

const MOCK_PAYMENT_METHOD_ID = 'a0b1c2';

describe('StripeService', () => {

  let service: StripeService;
  let paymentService: PaymentService;
  let userService: UserService;
  const routerEvents: Subject<any> = new Subject();
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
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
          paymentIntents() {
            return Observable.of({
              token: 'a1-b2-c3-d4'
            })
          },
          paymentIntentsConfirm() {
            return Observable.of({
              token: 'a1-b2-c3-d4',
              status: 'SUCCEEDED'
            })
          }
        }
        },
        { provide: FeatureflagService, useValue: {
          getFlag() {
            return Observable.of(false);
          }
        }
        }
      ],
      imports: [HttpClientTestingModule]
    });
    service = TestBed.get(StripeService);
    paymentService = TestBed.get(PaymentService);
    userService = TestBed.get(UserService);
    httpMock = TestBed.get(HttpTestingController);
  });

  describe('buy', () => {
    const paymentId = 'a1-b2-c3-d4';
    const orderId = '1';

    it('should call paymentIntents', () => {
      const PAYMENT_INTENT_RESPONSE = {
        token: paymentId,
      };
      let response: PaymentIntents;

      userService.me = jasmine.createSpy().and.returnValue(Observable.of(USER_DATA));
      paymentService.paymentIntents(orderId, paymentId).subscribe((data: PaymentIntents) => {
        response = data;
      });

      expect(response).toEqual(PAYMENT_INTENT_RESPONSE);
    });
  });

  describe('getCards', () => {
    it('should call endpoint and return saved card', () => {
    const expectedUrl = `${environment.baseUrl}${PAYMENTS_API_URL}/c2b/stripe/payment_methods/cards`;
    let response: FinancialCard[];

    service.getCards().subscribe(r => response = r);
    const req: TestRequest = httpMock.expectOne(expectedUrl);
    req.flush(PAYMENT_METHOD_CARD_RESPONSE);

    expect(req.request.urlWithParams).toEqual(expectedUrl);
    expect(response[0]).toEqual(createFinancialCardFixture());
    expect(req.request.method).toBe('GET');
    });
  });

  describe('addNewCard', () => {
    it('should call the endpoint and add a new credit card', () => {
      const expectedUrl = `${environment.baseUrl}${PAYMENTS_API_URL}/c2b/stripe/payment_methods/${MOCK_PAYMENT_METHOD_ID}/attach`;

      service.addNewCard(MOCK_PAYMENT_METHOD_ID).subscribe();
      const req: TestRequest = httpMock.expectOne(expectedUrl);
      req.flush({});

      expect(req.request.url).toBe(expectedUrl);
      expect(req.request.method).toBe('PUT');
    });
  });

  describe('deleteCard', () => {
    it('should call the endpoint and delete the credit card', () => {
      const expectedUrl = `${environment.baseUrl}${PAYMENTS_API_URL}/c2b/stripe/payment_methods/${MOCK_PAYMENT_METHOD_ID}/detach`;

      service.deleteCard(MOCK_PAYMENT_METHOD_ID).subscribe();
      const req: TestRequest = httpMock.expectOne(expectedUrl);
      req.flush({});

      expect(req.request.url).toBe(expectedUrl);
      expect(req.request.method).toBe('POST');
    });
  });

  describe('mapPaymentResponse', () => {
    it('should return a FinancialCard object', () => {
      const financialCard: FinancialCard = service.mapResponse(PAYMENT_METHOD_DATA);

      expect(financialCard).toEqual(createFinancialCardFixture());
    });
  });
  
});


