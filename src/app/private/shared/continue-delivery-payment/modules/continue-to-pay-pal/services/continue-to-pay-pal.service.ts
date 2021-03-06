import { Inject, Injectable } from '@angular/core';
import { BuyerRequest } from '@api/core/model/delivery/buyer-request/buyer-request.interface';
import { PAYVIEW_PAYMENT_METHOD } from '@api/core/model/payments';
import { AVAILABLE_PAYMENT_METHODS } from '@api/core/model/payments/constants/available-payments';
import { WINDOW_TOKEN } from '@core/window/window.token';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { START_DELIVERY_PAYMENT_URL } from '@private/shared/continue-delivery-payment/constants/continue-delivery-payment.constants';
import { CONTINUE_TO_PAYPAL_CLOSURE_REASON } from '@private/shared/continue-delivery-payment/enums/continue-to-paypal-closure-reason.enum';
import { ContinuePaymentService } from '@private/shared/continue-delivery-payment/interfaces/continue-payment-service.interface';
import { WEB_VIEW_MODAL_CLOSURE_METHOD } from '@shared/web-view-modal/enums/web-view-modal-closure-method';
import { Observable, ReplaySubject, timer, from, of } from 'rxjs';
import { concatMap, tap, takeUntil } from 'rxjs/operators';
import { ContinueToPayPalModalComponent } from '../modals/continue-to-paypal/continue-to-paypal-modal.component';

@Injectable()
export class ContinueToPayPalService implements ContinuePaymentService {
  constructor(@Inject(WINDOW_TOKEN) private window: Window, private modalService: NgbModal) {}

  public continue(buyerRequest: BuyerRequest): Observable<WEB_VIEW_MODAL_CLOSURE_METHOD> {
    const subject: ReplaySubject<WEB_VIEW_MODAL_CLOSURE_METHOD> = new ReplaySubject<WEB_VIEW_MODAL_CLOSURE_METHOD>();

    return this.openContinueToPayPal().pipe(
      concatMap((confirmClosureMethod: CONTINUE_TO_PAYPAL_CLOSURE_REASON) => {
        if (confirmClosureMethod === CONTINUE_TO_PAYPAL_CLOSURE_REASON.CANCEL) {
          return of(WEB_VIEW_MODAL_CLOSURE_METHOD.MANUAL);
        }
        const { id } = buyerRequest;
        const externalUrl: string = START_DELIVERY_PAYMENT_URL(id);
        const windowRef: Window = this.window.open(externalUrl, '_blank');

        timer(0, 500)
          .pipe(
            tap(() => {
              if (!windowRef || windowRef.closed) {
                subject.next(WEB_VIEW_MODAL_CLOSURE_METHOD.AUTOMATIC);
                subject.complete();
              }
            }),
            takeUntil(subject)
          )
          .subscribe();

        return subject.asObservable();
      })
    );
  }

  private openContinueToPayPal(): Observable<CONTINUE_TO_PAYPAL_CLOSURE_REASON> {
    const modalRef: NgbModalRef = this.modalService.open(ContinueToPayPalModalComponent, { backdrop: 'static', keyboard: false });
    modalRef.componentInstance.closeCallback = modalRef.close.bind(modalRef);
    return from(modalRef.result);
  }
}
