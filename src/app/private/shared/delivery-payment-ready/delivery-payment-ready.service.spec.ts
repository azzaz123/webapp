import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { PrePaymentError } from '@api/core/errors/delivery/payview/pre-payment';
import { PaymentsError } from '@api/core/errors/payments/payments.error';
import { PAYVIEW_PAYMENT_METHOD } from '@api/core/model/payments';
import {
  MOCK_BUYER_REQUEST_PAYMENT_READY,
  MOCK_BUYER_REQUEST_REJECTED,
} from '@api/fixtures/core/model/delivery/buyer-requests/buyer-request.fixtures.spec';
import { WINDOW_TOKEN } from '@core/window/window.token';
import { environment } from '@environments/environment';
import { DELIVERY_MODAL_CLASSNAME } from '@private/features/delivery/constants/delivery-constants';
import { WebViewModalService } from '@shared/web-view-modal/services/web-view-modal.service';
import { of } from 'rxjs';

import { DeliveryPaymentReadyService } from './delivery-payment-ready.service';

describe('DeliveryPaymentReadyService', () => {
  let service: DeliveryPaymentReadyService;
  let webViewModalService: WebViewModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DeliveryPaymentReadyService,
        { provide: WINDOW_TOKEN, useValue: { open: () => {} } },
        { provide: WebViewModalService, useValue: { open: () => of(null) } },
      ],
    });
    service = TestBed.inject(DeliveryPaymentReadyService);
    webViewModalService = TestBed.inject(WebViewModalService);

    spyOn(webViewModalService, 'open').and.callThrough();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when handling a request with credit card as payment method', () => {
    beforeEach(fakeAsync(() => {
      service.continueBuyerRequestBuyFlow(MOCK_BUYER_REQUEST_PAYMENT_READY, PAYVIEW_PAYMENT_METHOD.CREDIT_CARD).subscribe();
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
  });

  //TODO: Implement with PayPal
  xdescribe('when handling a request with PayPal as payment method', () => {});

  describe('when handling a request with payment that is not ready', () => {
    beforeEach(fakeAsync(() => {
      service.continueBuyerRequestBuyFlow(MOCK_BUYER_REQUEST_REJECTED, PAYVIEW_PAYMENT_METHOD.CREDIT_CARD).subscribe();
      tick();
    }));

    it('should NOT open a web view', () => {
      expect(webViewModalService.open).not.toHaveBeenCalled();
    });
  });

  describe('when handling a request with uncontrolled payment method', () => {
    let result: PaymentsError;

    beforeEach(fakeAsync(() => {
      service
        .continueBuyerRequestBuyFlow(MOCK_BUYER_REQUEST_PAYMENT_READY, PAYVIEW_PAYMENT_METHOD.WALLET)
        .subscribe({ error: (data) => (result = data) });
      tick();
    }));

    it('should notify there was an error', () => {
      expect(result instanceof PrePaymentError).toBe(true);
    });
  });
});
