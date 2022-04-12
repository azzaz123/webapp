import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { TransactionTrackingService } from '@api/bff/delivery/transaction-tracking/transaction-tracking.service';
import { PrePaymentError } from '@api/core/errors/delivery/payview/pre-payment';
import { PaymentsError } from '@api/core/errors/payments/payments.error';
import { BuyerRequestsApiService } from '@api/delivery/buyer/requests/buyer-requests-api.service';
import {
  MOCK_BUYER_REQUEST_PAYMENT_READY,
  MOCK_BUYER_REQUEST_REJECTED,
} from '@api/fixtures/core/model/delivery/buyer-requests/buyer-request.fixtures.spec';
import { WINDOW_TOKEN } from '@core/window/window.token';
import { environment } from '@environments/environment';
import { DELIVERY_MODAL_CLASSNAME } from '@private/features/delivery/constants/delivery-constants';
import { WEB_VIEW_MODAL_CLOSURE_METHOD } from '@shared/web-view-modal/enums/web-view-modal-closure-method';
import { WebViewModalService } from '@shared/web-view-modal/services/web-view-modal.service';
import { of, Subject } from 'rxjs';

import { DeliveryPaymentReadyService } from './delivery-payment-ready.service';

describe('DeliveryPaymentReadyService', () => {
  let service: DeliveryPaymentReadyService;
  let transactionTrackingService: TransactionTrackingService;
  let buyerRequestsApiService: BuyerRequestsApiService;
  let webViewModalService: WebViewModalService;

  const MOCK_MODAL_RESULT_SUBJECT: Subject<WEB_VIEW_MODAL_CLOSURE_METHOD> = new Subject<WEB_VIEW_MODAL_CLOSURE_METHOD>();

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DeliveryPaymentReadyService,
        { provide: WINDOW_TOKEN, useValue: { open: () => {} } },
        { provide: WebViewModalService, useValue: { open: () => MOCK_MODAL_RESULT_SUBJECT.asObservable() } },
        { provide: BuyerRequestsApiService, useValue: { cancelRequest: () => of(null) } },
        { provide: TransactionTrackingService, useValue: { requestWasDoneWithPayPal: () => of(false) } },
      ],
    });
    service = TestBed.inject(DeliveryPaymentReadyService);
    transactionTrackingService = TestBed.inject(TransactionTrackingService);
    buyerRequestsApiService = TestBed.inject(BuyerRequestsApiService);
    webViewModalService = TestBed.inject(WebViewModalService);

    spyOn(webViewModalService, 'open').and.callThrough();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when handling a request with credit card as payment method', () => {
    let result: WEB_VIEW_MODAL_CLOSURE_METHOD;

    beforeEach(fakeAsync(() => {
      spyOn(transactionTrackingService, 'requestWasDoneWithPayPal').and.returnValue(of(false));

      service.continueBuyerRequestBuyFlow(MOCK_BUYER_REQUEST_PAYMENT_READY).subscribe((data) => (result = data));
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
  describe('when handling a request with PayPal as payment method', () => {
    beforeEach(() => {
      spyOn(transactionTrackingService, 'requestWasDoneWithPayPal').and.returnValue(of(true));
    });
  });

  describe('when handling a request with payment that is not ready', () => {
    beforeEach(fakeAsync(() => {
      service.continueBuyerRequestBuyFlow(MOCK_BUYER_REQUEST_REJECTED).subscribe();
      tick();
    }));

    it('should NOT open a web view', () => {
      expect(webViewModalService.open).not.toHaveBeenCalled();
    });
  });
});
