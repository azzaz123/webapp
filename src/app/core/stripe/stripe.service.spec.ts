import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Subject, of } from 'rxjs';
import { UserService } from '../user/user.service';
import { StripeService, PAYMENTS_API_URL, STRIPE_PAYMENT_RESPONSE_EVENT_KEY } from './stripe.service';
import { EventService } from '../event/event.service';
import { PaymentService, PAYMENT_RESPONSE_STATUS } from '../payments/payment.service';
import { PaymentIntents } from '../payments/payment.interface';
import { Router } from '@angular/router';
import { FinancialCard } from '@shared/payments-card-info/financial-card';
import { PAYMENT_METHOD_CARD_RESPONSE, PAYMENT_METHOD_DATA } from '../../../tests/payments.fixtures.spec';
import { createFinancialCardFixture } from '../../../tests/stripe.fixtures.spec';
import { FeatureFlagService } from '../user/featureflag.service';
import { environment } from '../../../environments/environment';
import { TestRequest, HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ErrorsService } from '../errors/errors.service';
import { I18nService } from '../i18n/i18n.service';
import { ToastService } from '@layout/toast/core/services/toast.service';

const MOCK_PAYMENT_METHOD_ID = 'a0b1c2';

describe('StripeService', () => {
  let service: StripeService;
  let paymentService: PaymentService;
  let userService: UserService;
  let eventService: EventService;
  const routerEvents: Subject<any> = new Subject();
  let httpMock: HttpTestingController;
  let errorService: ErrorsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        EventService,
        StripeService,
        {
          provide: UserService,
          useValue: {
            hasPerm() {
              return of(true);
            },
          },
        },
        {
          provide: Router,
          useValue: {
            navigate() {},
            events: routerEvents,
          },
        },
        {
          provide: PaymentService,
          useValue: {
            paymentIntents() {
              return of({
                token: 'a1-b2-c3-d4',
              });
            },
            paymentIntentsConfirm() {
              return of({
                token: 'a1-b2-c3-d4',
                status: 'SUCCEEDED',
              });
            },
          },
        },
        {
          provide: FeatureFlagService,
          useValue: {
            getFlag() {
              return of(false);
            },
          },
        },
        ErrorsService,
        I18nService,
        ToastService,
      ],
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(StripeService);
    paymentService = TestBed.inject(PaymentService);
    userService = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
    eventService = TestBed.inject(EventService);
    errorService = TestBed.inject(ErrorsService);
  });

  describe('buy', () => {
    const paymentId = 'a1-b2-c3-d4';
    const orderId = '1';

    it('should call paymentIntents', () => {
      const PAYMENT_INTENT_RESPONSE = {
        token: paymentId,
      };
      let response: PaymentIntents;

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

      service.getCards().subscribe((r) => (response = r));
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

  describe('when creating a new card with the Stripe SDK', () => {
    it('should emit an error if response from backend has error', fakeAsync(() => {
      spyOn(eventService, 'emit').and.callThrough();
      spyOn(service, 'createStripePaymentMethod').and.returnValue(Promise.resolve({ error: { message: 'The man in the chair' } }));

      service.createStripeCard({});
      tick();

      expect(eventService.emit).toHaveBeenCalledTimes(1);
      expect(eventService.emit).toHaveBeenCalledWith(STRIPE_PAYMENT_RESPONSE_EVENT_KEY, PAYMENT_RESPONSE_STATUS.FAILED);
    }));
  });

  describe('createDefaultCard', () => {
    it('should call stripeSetupIntent', fakeAsync(() => {
      spyOn(service, 'stripeSetupIntent').and.returnValue(Promise.resolve({ error: { message: 'Payment error' } }));

      service.createDefaultCard('abc', {});
      tick();

      expect(service.stripeSetupIntent).toHaveBeenCalledTimes(1);
    }));
  });

  describe('setDefaultCard', () => {
    it('should call the endpoint', () => {
      const expectedUrl = `${environment.baseUrl}${PAYMENTS_API_URL}/c2b/stripe/payment_methods/${MOCK_PAYMENT_METHOD_ID}/default`;
      service.setDefaultCard(MOCK_PAYMENT_METHOD_ID).subscribe();
      const req: TestRequest = httpMock.expectOne(expectedUrl);
      req.flush({});

      expect(req.request.url).toBe(expectedUrl);
      expect(req.request.method).toBe('PUT');
    });
  });

  describe('getSetupIntent', () => {
    it('should call the endpoint', () => {
      const expectedUrl = `${environment.baseUrl}${PAYMENTS_API_URL}/c2b/stripe/setup_intent_secret`;
      service.getSetupIntent().subscribe();
      const req: TestRequest = httpMock.expectOne(expectedUrl);
      req.flush({});

      expect(req.request.url).toBe(expectedUrl);
      expect(req.request.method).toBe('GET');
    });
  });
});
