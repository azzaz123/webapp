import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TransactionTrackingService } from '@api/bff/delivery/transaction-tracking/transaction-tracking.service';
import { BuyerRequest } from '@api/core/model/delivery/buyer-request/buyer-request.interface';
import { BuyerRequestsApiService } from '@api/delivery/buyer/requests/buyer-requests-api.service';
import {
  MOCK_BUYER_REQUEST_PAYMENT_READY,
  MOCK_BUYER_REQUEST_REJECTED,
} from '@api/fixtures/core/model/delivery/buyer-requests/buyer-request.fixtures.spec';
import { WINDOW_TOKEN } from '@core/window/window.token';
import { DeliveryExperimentalFeaturesService } from '@private/core/services/delivery-experimental-features/delivery-experimental-features.service';
import { DELIVERY_PATHS } from '@private/features/delivery/delivery-routing-constants';
import { PRIVATE_PATHS } from '@private/private-routing-constants';
import { WEB_VIEW_MODAL_CLOSURE_METHOD } from '@shared/web-view-modal/enums/web-view-modal-closure-method';
import { WebViewModalService } from '@shared/web-view-modal/services/web-view-modal.service';
import { of } from 'rxjs';

import { ContinueDeliveryPaymentService } from './continue-delivery-payment.service';
import { PAYMENT_CONTINUED_POST_ACTION } from './enums/payment-continued-post-action.enum';
import { ContinueToPayPalService } from './modules/continue-to-pay-pal/services/continue-to-pay-pal.service';
import { ContinueWithCreditCardService } from './modules/continue-with-credit-card/services/continue-with-credit-card.service';

describe('ContinueDeliveryPaymentService', () => {
  let service: ContinueDeliveryPaymentService;
  let router: Router;
  let windowRef: Window;
  let transactionTrackingService: TransactionTrackingService;
  let buyerRequestsApiService: BuyerRequestsApiService;
  let webViewModalService: WebViewModalService;
  let continueToPayPalService: ContinueToPayPalService;
  let continueWithCreditCardService: ContinueWithCreditCardService;
  let deliveryExperimentalFeaturesService: DeliveryExperimentalFeaturesService;

  let payPalContinueSpy: jasmine.Spy;
  let creditCardContinueSpy: jasmine.Spy;
  let enabledFeatureFlagSpy: jest.SpyInstance;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        ContinueDeliveryPaymentService,
        { provide: WINDOW_TOKEN, useValue: { open: () => {} } },
        {
          provide: BuyerRequestsApiService,
          useValue: { cancelRequest: () => of(null), getRequestsAsBuyerByItemHash: () => of([MOCK_BUYER_REQUEST_PAYMENT_READY]) },
        },
        { provide: TransactionTrackingService, useValue: { requestWasDoneWithPayPal: () => of(false) } },
        {
          provide: DeliveryExperimentalFeaturesService,
          useValue: {
            get featuresEnabled$() {
              return of(true);
            },
          },
        },
        {
          provide: ContinueToPayPalService,
          useValue: {
            continue: (_request: BuyerRequest) => of(WEB_VIEW_MODAL_CLOSURE_METHOD.AUTOMATIC),
          },
        },
        {
          provide: ContinueWithCreditCardService,
          useVale: {
            continue: (_request: BuyerRequest) => of(WEB_VIEW_MODAL_CLOSURE_METHOD.AUTOMATIC),
          },
        },
      ],
    });
    service = TestBed.inject(ContinueDeliveryPaymentService);
    router = TestBed.inject(Router);
    windowRef = TestBed.inject(WINDOW_TOKEN);
    transactionTrackingService = TestBed.inject(TransactionTrackingService);
    buyerRequestsApiService = TestBed.inject(BuyerRequestsApiService);
    webViewModalService = TestBed.inject(WebViewModalService);
    continueToPayPalService = TestBed.inject(ContinueToPayPalService);
    continueWithCreditCardService = TestBed.inject(ContinueWithCreditCardService);
    deliveryExperimentalFeaturesService = TestBed.inject(DeliveryExperimentalFeaturesService);

    spyOn(webViewModalService, 'open').and.callThrough();
    spyOn(windowRef, 'open').and.callThrough();
    spyOn(router, 'navigate');
    payPalContinueSpy = spyOn(continueToPayPalService, 'continue').and.callThrough();
    creditCardContinueSpy = spyOn(continueWithCreditCardService, 'continue').and.callThrough();
    enabledFeatureFlagSpy = jest.spyOn(deliveryExperimentalFeaturesService, 'featuresEnabled$', 'get');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when delivery feature flag is NOT enabled', () => {
    beforeEach(fakeAsync(() => {
      enabledFeatureFlagSpy.mockReturnValue(of(false));

      service
        .continue(MOCK_BUYER_REQUEST_PAYMENT_READY.id, MOCK_BUYER_REQUEST_PAYMENT_READY.itemHash, PAYMENT_CONTINUED_POST_ACTION.NONE)
        .subscribe();
      tick();
    }));

    it('should NOT ask to continue payment with PayPal', () => {
      expect(continueToPayPalService.continue).not.toHaveBeenCalled();
    });

    it('should NOT ask to continue payment with credit card', () => {
      expect(continueWithCreditCardService.continue).not.toHaveBeenCalled();
    });
  });

  describe('when handling a request with credit card as payment method with delivery feature flag', () => {
    let result: WEB_VIEW_MODAL_CLOSURE_METHOD;

    beforeEach(fakeAsync(() => {
      enabledFeatureFlagSpy.mockReturnValue(of(true));
      spyOn(transactionTrackingService, 'requestWasDoneWithPayPal').and.returnValue(of(false));

      service
        .continue(MOCK_BUYER_REQUEST_PAYMENT_READY.id, MOCK_BUYER_REQUEST_PAYMENT_READY.itemHash, PAYMENT_CONTINUED_POST_ACTION.NONE)
        .subscribe((data) => (result = data));
      tick();
    }));

    it('should NOT ask to continue payment with PayPal', () => {
      expect(continueToPayPalService.continue).not.toHaveBeenCalled();
    });

    it('should ask to continue payment with credit card', () => {
      expect(continueWithCreditCardService.continue).toHaveBeenCalledTimes(1);
    });

    describe('and when user closes the modal manually', () => {
      const MOCK_ID: string = MOCK_BUYER_REQUEST_PAYMENT_READY.id;

      beforeEach(fakeAsync(() => {
        spyOn(buyerRequestsApiService, 'cancelRequest').and.callThrough();

        creditCardContinueSpy.and.returnValue(of(WEB_VIEW_MODAL_CLOSURE_METHOD.MANUAL));
        service
          .continue(MOCK_BUYER_REQUEST_PAYMENT_READY.id, MOCK_BUYER_REQUEST_PAYMENT_READY.itemHash, PAYMENT_CONTINUED_POST_ACTION.NONE)
          .subscribe((data) => (result = data));
        tick();
      }));

      it('should cancel the request once', () => {
        expect(buyerRequestsApiService.cancelRequest).toHaveBeenCalledTimes(1);
      });

      it('should cancel the request with the buyer request identifier', () => {
        expect(buyerRequestsApiService.cancelRequest).toHaveBeenCalledWith(MOCK_ID);
      });

      it('should notify the request was cancelled manually', () => {
        expect(result).toEqual(WEB_VIEW_MODAL_CLOSURE_METHOD.MANUAL);
      });
    });

    describe('and when the modal is closed automatically', () => {
      beforeEach(fakeAsync(() => {
        spyOn(buyerRequestsApiService, 'cancelRequest').and.callThrough();
        creditCardContinueSpy.and.returnValue(of(WEB_VIEW_MODAL_CLOSURE_METHOD.AUTOMATIC));

        service
          .continue(MOCK_BUYER_REQUEST_PAYMENT_READY.id, MOCK_BUYER_REQUEST_PAYMENT_READY.itemHash, PAYMENT_CONTINUED_POST_ACTION.NONE)
          .subscribe((data) => (result = data));
        tick();
      }));

      it('should NOT cancel the request', () => {
        expect(buyerRequestsApiService.cancelRequest).not.toHaveBeenCalled();
      });

      it('should notify modal was closed automatically', () => {
        expect(result).toEqual(WEB_VIEW_MODAL_CLOSURE_METHOD.AUTOMATIC);
      });
    });
  });

  describe('when handling a request with PayPal as payment method with delivery feature flag', () => {
    beforeEach(fakeAsync(() => {
      enabledFeatureFlagSpy.mockReturnValue(of(true));

      spyOn(transactionTrackingService, 'requestWasDoneWithPayPal').and.returnValue(of(true));

      service
        .continue(MOCK_BUYER_REQUEST_PAYMENT_READY.id, MOCK_BUYER_REQUEST_PAYMENT_READY.itemHash, PAYMENT_CONTINUED_POST_ACTION.NONE)
        .subscribe();
      tick();
    }));

    it('should delegate logic to PayPal continue payment handler once', () => {
      expect(continueToPayPalService.continue).toHaveBeenCalledTimes(1);
    });

    it('should delegate logic to PayPal continue payment handler with buyer request', () => {
      expect(continueToPayPalService.continue).toHaveBeenCalledWith(MOCK_BUYER_REQUEST_PAYMENT_READY);
    });
  });

  describe('when handling a request with payment that is not ready', () => {
    beforeEach(fakeAsync(() => {
      spyOn(buyerRequestsApiService, 'getRequestsAsBuyerByItemHash').and.returnValue(of([MOCK_BUYER_REQUEST_REJECTED]));
      service
        .continue(MOCK_BUYER_REQUEST_REJECTED.id, MOCK_BUYER_REQUEST_REJECTED.itemHash, PAYMENT_CONTINUED_POST_ACTION.NONE)
        .subscribe();

      tick();
    }));

    it('should NOT ask to continue payment with PayPal', () => {
      expect(continueToPayPalService.continue).not.toHaveBeenCalled();
    });

    it('should NOT ask to continue payment with credit card', () => {
      expect(continueWithCreditCardService.continue).not.toHaveBeenCalled();
    });
  });

  describe('when asking the process to redirect to TTS once done', () => {
    const MOCK_TTS_URL: string = `${PRIVATE_PATHS.DELIVERY}/${DELIVERY_PATHS.TRACKING}/${MOCK_BUYER_REQUEST_PAYMENT_READY.id}`;

    beforeEach(fakeAsync(() => {
      creditCardContinueSpy.and.returnValue(of(WEB_VIEW_MODAL_CLOSURE_METHOD.AUTOMATIC));

      service
        .continue(
          MOCK_BUYER_REQUEST_PAYMENT_READY.id,
          MOCK_BUYER_REQUEST_PAYMENT_READY.itemHash,
          PAYMENT_CONTINUED_POST_ACTION.REDIRECT_TTS
        )
        .subscribe();
      tick();
    }));

    it('should go to TTS only once', () => {
      expect(router.navigate).toBeCalledTimes(1);
    });

    it('should go to TTS URL', () => {
      expect(router.navigate).toHaveBeenCalledWith([MOCK_TTS_URL]);
    });
  });

  describe('when asking to continue the payment to a non existing buyer request for that item', () => {
    beforeEach(() => {
      spyOn(buyerRequestsApiService, 'getRequestsAsBuyerByItemHash').and.returnValue(of([]));
    });

    it('should NOT ask to continue payment with PayPal', () => {
      expect(continueToPayPalService.continue).not.toHaveBeenCalled();
    });

    it('should NOT ask to continue payment with credit card', () => {
      expect(continueWithCreditCardService.continue).not.toHaveBeenCalled();
    });
  });
});
