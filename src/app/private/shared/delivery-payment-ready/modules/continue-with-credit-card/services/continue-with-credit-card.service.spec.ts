import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MOCK_BUYER_REQUEST_PAYMENT_READY } from '@api/fixtures/core/model/delivery/buyer-requests/buyer-request.fixtures.spec';
import { DELIVERY_MODAL_CLASSNAME } from '@private/features/delivery/constants/delivery-constants';
import { START_DELIVERY_PAYMENT_URL } from '@private/shared/delivery-payment-ready/constants/continue-delivery-payment.constants';
import { WEB_VIEW_MODAL_CLOSURE_METHOD } from '@shared/web-view-modal/enums/web-view-modal-closure-method';
import { WebViewModalService } from '@shared/web-view-modal/services/web-view-modal.service';
import { ReplaySubject } from 'rxjs';

import { ContinueWithCreditCardService } from './continue-with-credit-card.service';

describe('ContinueWithCreditCardService', () => {
  let service: ContinueWithCreditCardService;
  let webViewModalService: WebViewModalService;

  const MOCK_WEB_VIEW_OPEN_SUBJECT: ReplaySubject<WEB_VIEW_MODAL_CLOSURE_METHOD> = new ReplaySubject<WEB_VIEW_MODAL_CLOSURE_METHOD>(1);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ContinueWithCreditCardService,
        { provide: WebViewModalService, useValue: { open: () => MOCK_WEB_VIEW_OPEN_SUBJECT.asObservable() } },
      ],
    });
    service = TestBed.inject(ContinueWithCreditCardService);
    webViewModalService = TestBed.inject(WebViewModalService);

    spyOn(webViewModalService, 'open').and.callThrough();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when asking to handle a request', () => {
    let result: WEB_VIEW_MODAL_CLOSURE_METHOD;

    beforeEach(fakeAsync(() => {
      service.continue(MOCK_BUYER_REQUEST_PAYMENT_READY).subscribe((data) => (result = data));
      tick();
    }));

    it('should open a web view once', () => {
      expect(webViewModalService.open).toHaveBeenCalledTimes(1);
    });

    it('should open a web view with valid data', () => {
      const expectedUrl: string = START_DELIVERY_PAYMENT_URL(MOCK_BUYER_REQUEST_PAYMENT_READY.id);
      const expectedTitle: string = $localize`:@@checkout_summary_view_buyer_top_bar_title:Make a purchase`;

      expect(webViewModalService.open).toHaveBeenCalledWith(expectedUrl, expectedTitle, DELIVERY_MODAL_CLASSNAME);
    });

    describe('and when modal closes', () => {
      beforeEach(() => {
        MOCK_WEB_VIEW_OPEN_SUBJECT.next(WEB_VIEW_MODAL_CLOSURE_METHOD.MANUAL);
      });

      it('should notify closure method', () => {
        expect(result).toEqual(WEB_VIEW_MODAL_CLOSURE_METHOD.MANUAL);
      });
    });
  });
});
