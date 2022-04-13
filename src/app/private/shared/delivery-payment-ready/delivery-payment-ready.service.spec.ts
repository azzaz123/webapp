import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TransactionTrackingService } from '@api/bff/delivery/transaction-tracking/transaction-tracking.service';
import { BuyerRequestsApiService } from '@api/delivery/buyer/requests/buyer-requests-api.service';
import {
  MOCK_BUYER_REQUEST_PAYMENT_READY,
  MOCK_BUYER_REQUEST_REJECTED,
} from '@api/fixtures/core/model/delivery/buyer-requests/buyer-request.fixtures.spec';
import { WINDOW_TOKEN } from '@core/window/window.token';
import { environment } from '@environments/environment';
import { DeliveryExperimentalFeaturesService } from '@private/core/services/delivery-experimental-features/delivery-experimental-features.service';
import { DELIVERY_MODAL_CLASSNAME } from '@private/features/delivery/constants/delivery-constants';
import { DELIVERY_PATHS } from '@private/features/delivery/delivery-routing-constants';
import { PRIVATE_PATHS } from '@private/private-routing-constants';
import { WEB_VIEW_MODAL_CLOSURE_METHOD } from '@shared/web-view-modal/enums/web-view-modal-closure-method';
import { WebViewModalService } from '@shared/web-view-modal/services/web-view-modal.service';
import { of, ReplaySubject, Subject } from 'rxjs';

import { DeliveryPaymentReadyService } from './delivery-payment-ready.service';
import { PAYMENT_CONTINUED_POST_ACTION } from './enums/payment-continued-post-action.enum';

describe('DeliveryPaymentReadyService', () => {
  let service: DeliveryPaymentReadyService;
  let router: Router;
  let windowRef: Window;
  let transactionTrackingService: TransactionTrackingService;
  let buyerRequestsApiService: BuyerRequestsApiService;
  let webViewModalService: WebViewModalService;

  const MOCK_MODAL_RESULT_SUBJECT: Subject<WEB_VIEW_MODAL_CLOSURE_METHOD> = new Subject<WEB_VIEW_MODAL_CLOSURE_METHOD>();
  const MOCK_DELIVERY_FEATURE_FLAG_SUBJECT: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        DeliveryPaymentReadyService,
        { provide: WINDOW_TOKEN, useValue: { open: () => {} } },
        { provide: WebViewModalService, useValue: { open: () => MOCK_MODAL_RESULT_SUBJECT.asObservable() } },
        {
          provide: BuyerRequestsApiService,
          useValue: { cancelRequest: () => of(null), getRequestsAsBuyerByItemHash: () => of([MOCK_BUYER_REQUEST_PAYMENT_READY]) },
        },
        { provide: TransactionTrackingService, useValue: { requestWasDoneWithPayPal: () => of(false) } },
        {
          provide: DeliveryExperimentalFeaturesService,
          useValue: {
            get featuresEnabled$() {
              return MOCK_DELIVERY_FEATURE_FLAG_SUBJECT.asObservable();
            },
          },
        },
      ],
    });
    service = TestBed.inject(DeliveryPaymentReadyService);
    router = TestBed.inject(Router);
    windowRef = TestBed.inject(WINDOW_TOKEN);
    transactionTrackingService = TestBed.inject(TransactionTrackingService);
    buyerRequestsApiService = TestBed.inject(BuyerRequestsApiService);
    webViewModalService = TestBed.inject(WebViewModalService);

    spyOn(webViewModalService, 'open').and.callThrough();
    spyOn(windowRef, 'open').and.callThrough();
    spyOn(router, 'navigate');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when delivery feature flag is NOT enabled', () => {
    let result: WEB_VIEW_MODAL_CLOSURE_METHOD;

    beforeEach(() => {
      MOCK_DELIVERY_FEATURE_FLAG_SUBJECT.next(false);
    });

    describe('and when payment method used was PayPal', () => {
      beforeEach(fakeAsync(() => {
        spyOn(transactionTrackingService, 'requestWasDoneWithPayPal').and.returnValue(of(true));

        service
          .continueBuyerRequestBuyFlow(MOCK_BUYER_REQUEST_PAYMENT_READY.id, MOCK_BUYER_REQUEST_PAYMENT_READY.itemHash)
          .subscribe((data) => (result = data));
        tick();
      }));

      it('should NOT open a new window', () => {
        expect(windowRef.open).not.toHaveBeenCalled();
      });
    });

    describe('and when payment method used was NOT PayPal', () => {
      beforeEach(fakeAsync(() => {
        spyOn(transactionTrackingService, 'requestWasDoneWithPayPal').and.returnValue(of(false));

        service
          .continueBuyerRequestBuyFlow(MOCK_BUYER_REQUEST_PAYMENT_READY.id, MOCK_BUYER_REQUEST_PAYMENT_READY.itemHash)
          .subscribe((data) => (result = data));
        tick();
      }));

      it('should NOT open a web view', () => {
        expect(webViewModalService.open).not.toHaveBeenCalled();
      });
    });
  });

  describe('when handling a request with credit card as payment method with delivery feature flag', () => {
    let result: WEB_VIEW_MODAL_CLOSURE_METHOD;

    beforeEach(fakeAsync(() => {
      MOCK_DELIVERY_FEATURE_FLAG_SUBJECT.next(true);
      spyOn(transactionTrackingService, 'requestWasDoneWithPayPal').and.returnValue(of(false));

      service
        .continueBuyerRequestBuyFlow(MOCK_BUYER_REQUEST_PAYMENT_READY.id, MOCK_BUYER_REQUEST_PAYMENT_READY.itemHash)
        .subscribe((data) => (result = data));
      tick();
    }));

    it('should open a web view only once', () => {
      expect(webViewModalService.open).toHaveBeenCalledTimes(1);
    });

    it('should open a web view with valid values', () => {
      const expectedUrl: string = `${environment.baseUrl}api/v3/delivery/request/payment/start/${MOCK_BUYER_REQUEST_PAYMENT_READY.id}`;
      const expectedTitle: string = $localize`:@@checkout_summary_view_buyer_top_bar_title:Make a purchase`;
      expect(webViewModalService.open).toHaveBeenCalledWith(expectedUrl, expectedTitle, DELIVERY_MODAL_CLASSNAME);
    });

    describe('and when user closes the modal manually', () => {
      const MOCK_ID: string = MOCK_BUYER_REQUEST_PAYMENT_READY.id;

      beforeEach(fakeAsync(() => {
        spyOn(buyerRequestsApiService, 'cancelRequest').and.callThrough();

        MOCK_MODAL_RESULT_SUBJECT.next(WEB_VIEW_MODAL_CLOSURE_METHOD.MANUAL);
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

        MOCK_MODAL_RESULT_SUBJECT.next(WEB_VIEW_MODAL_CLOSURE_METHOD.AUTOMATIC);
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

  //TODO: Implement with PayPal
  describe('when handling a request with PayPal as payment method with delivery feature flag', () => {
    beforeEach(() => {
      MOCK_DELIVERY_FEATURE_FLAG_SUBJECT.next(true);
      spyOn(transactionTrackingService, 'requestWasDoneWithPayPal').and.returnValue(of(true));
    });
  });

  describe('when handling a request with payment that is not ready', () => {
    beforeEach(fakeAsync(() => {
      spyOn(buyerRequestsApiService, 'getRequestsAsBuyerByItemHash').and.returnValue(of([MOCK_BUYER_REQUEST_REJECTED]));
      service.continueBuyerRequestBuyFlow(MOCK_BUYER_REQUEST_REJECTED.id, MOCK_BUYER_REQUEST_REJECTED.itemHash).subscribe();

      tick();
    }));

    it('should NOT open a web view', () => {
      expect(webViewModalService.open).not.toHaveBeenCalled();
    });
  });

  describe('when asking the process to redirect to TTS once done', () => {
    const MOCK_TTS_URL: string = `${PRIVATE_PATHS.DELIVERY}/${DELIVERY_PATHS.TRACKING}/${MOCK_BUYER_REQUEST_PAYMENT_READY.id}`;

    beforeEach(fakeAsync(() => {
      MOCK_DELIVERY_FEATURE_FLAG_SUBJECT.next(true);
      MOCK_DELIVERY_FEATURE_FLAG_SUBJECT.complete();
      MOCK_MODAL_RESULT_SUBJECT.next(WEB_VIEW_MODAL_CLOSURE_METHOD.AUTOMATIC);
      MOCK_MODAL_RESULT_SUBJECT.complete();

      service
        .continueBuyerRequestBuyFlow(
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

    it('should NOT open a web view', () => {
      expect(webViewModalService.open).not.toHaveBeenCalled();
    });
  });
});
