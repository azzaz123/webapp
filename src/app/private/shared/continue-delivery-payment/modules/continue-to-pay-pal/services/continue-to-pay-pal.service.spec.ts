import { fakeAsync, TestBed, tick } from '@angular/core/testing';

import { ContinueToPayPalService } from './continue-to-pay-pal.service';

import { WINDOW_TOKEN } from '@core/window/window.token';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { MOCK_BUYER_REQUEST_PAYMENT_READY } from '@api/fixtures/core/model/delivery/buyer-requests/buyer-request.fixtures.spec';
import { ContinueToPayPalModalComponent } from '../modals/continue-to-paypal/continue-to-paypal-modal.component';
import { START_DELIVERY_PAYMENT_URL } from '@private/shared/continue-delivery-payment/constants/continue-delivery-payment.constants';
import { WEB_VIEW_MODAL_CLOSURE_METHOD } from '@shared/web-view-modal/enums/web-view-modal-closure-method';
import { of } from 'rxjs';

describe('ContinueToPayPalService', () => {
  let service: ContinueToPayPalService;
  let modalService: NgbModal;
  let windowRef: Window;
  let openModalSpy: jasmine.Spy;

  const MOCK_WINDOW: Window = { open: () => {}, closed: false } as Window;
  const MOCK_MODAL_REF: NgbModalRef = {
    close: () => {},
    componentInstance: {},
    result: of(WEB_VIEW_MODAL_CLOSURE_METHOD.AUTOMATIC).toPromise(),
  } as NgbModalRef;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ContinueToPayPalService,
        { provide: WINDOW_TOKEN, useValue: MOCK_WINDOW },
        {
          provide: NgbModal,
          useValue: {
            open: () => MOCK_MODAL_REF,
          },
        },
      ],
    });
    service = TestBed.inject(ContinueToPayPalService);
    modalService = TestBed.inject(NgbModal);
    windowRef = TestBed.inject(WINDOW_TOKEN);
    openModalSpy = spyOn(modalService, 'open').and.callThrough();
    spyOn(windowRef, 'open').and.callThrough();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when handling request that needs PayPal', () => {
    let result: WEB_VIEW_MODAL_CLOSURE_METHOD;

    beforeEach(fakeAsync(() => {
      service.continue(MOCK_BUYER_REQUEST_PAYMENT_READY).subscribe((data) => (result = data));
      tick();
    }));

    it('should open an explanatory modal to the user once', () => {
      expect(modalService.open).toHaveBeenCalledTimes(1);
    });

    it('should open an explanatory modal to the user with valid information', () => {
      expect(modalService.open).toHaveBeenCalledWith(ContinueToPayPalModalComponent, { backdrop: 'static', keyboard: false });
    });

    describe('and when user wants to continue the flow', () => {
      it('should open one new tab', () => {
        expect(windowRef.open).toHaveBeenCalledTimes(1);
      });

      it('should open the PayPal tab', () => {
        expect(windowRef.open).toHaveBeenCalledWith(START_DELIVERY_PAYMENT_URL(MOCK_BUYER_REQUEST_PAYMENT_READY.id), '_blank');
      });

      describe('when PayPal tab is closed', () => {
        beforeEach(fakeAsync(() => {
          spyOn(MOCK_WINDOW, 'closed').and.returnValue(true);
          tick(1000);
        }));

        it('should assume it was done automatically', () => {
          expect(result).toBe(WEB_VIEW_MODAL_CLOSURE_METHOD.AUTOMATIC);
        });
      });
    });
  });
});
