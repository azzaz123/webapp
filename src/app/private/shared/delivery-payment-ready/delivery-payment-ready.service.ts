import { Inject, Injectable } from '@angular/core';
import { PrePaymentUnknownError } from '@api/core/errors/delivery/payview/pre-payment';
import { BuyerRequest } from '@api/core/model/delivery/buyer-request/buyer-request.interface';
import { BUYER_REQUEST_PAYMENT_STATUS } from '@api/core/model/delivery/buyer-request/status/buyer-payment-status.enum';
import { PAYVIEW_PAYMENT_METHOD } from '@api/core/model/payments';
import { WINDOW_TOKEN } from '@core/window/window.token';
import { environment } from '@environments/environment';
import { DELIVERY_MODAL_CLASSNAME } from '@private/features/delivery/constants/delivery-constants';
import { WebViewModalService } from '@shared/web-view-modal/services/web-view-modal.service';
import { Observable, of, ReplaySubject, throwError, timer } from 'rxjs';
import { tap, takeUntil, map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class DeliveryPaymentReadyService {
  constructor(@Inject(WINDOW_TOKEN) private window: Window, private webViewModalService: WebViewModalService) {}

  public continueBuyerRequestBuyFlow(buyerRequest: BuyerRequest, paymentMethod: PAYVIEW_PAYMENT_METHOD): Observable<void> {
    const isContinueFlowNotNeeded: boolean = buyerRequest.status.payment !== BUYER_REQUEST_PAYMENT_STATUS.READY;
    if (isContinueFlowNotNeeded) {
      return of(null);
    }

    const { id } = buyerRequest;
    const externalUrl: string = this.getExternalUrl(id);

    if (paymentMethod === PAYVIEW_PAYMENT_METHOD.CREDIT_CARD) {
      return this.continueCreditCardFlow(externalUrl);
    }

    // if (paymentMethod === PAYVIEW_PAYMENT_METHOD.PAYPAL) {
    //   return this.continuePayPalFlow(externalUrl);
    // }

    return throwError(new PrePaymentUnknownError());
  }

  private get title(): string {
    return $localize`:@@checkout_summary_view_buyer_top_bar_title:Make a purchase`;
  }

  private getExternalUrl(id: string): string {
    return `${environment.baseUrl}api/v3/delivery/request/payment/start/${id}`;
  }

  private continueCreditCardFlow(externalCardFlowUrl: string): Observable<void> {
    return this.webViewModalService.open(externalCardFlowUrl, this.title, DELIVERY_MODAL_CLASSNAME).pipe(map(() => {}));
  }

  //TODO: This needs to be reviewed, from both technical and legal POVs
  private continuePayPalFlow(externalPayPalFlowUrl: string): Observable<void> {
    const subject: ReplaySubject<void> = new ReplaySubject<void>();
    const windowRef: Window = this.window.open(externalPayPalFlowUrl, '_blank');

    const completeCurrentFlow = () => {
      subject.next();
      subject.complete();
    };

    timer(0, 1000).pipe(
      tap(() => {
        if (!windowRef || windowRef.closed) {
          return completeCurrentFlow();
        }
      }),
      takeUntil(subject)
    );

    return subject.asObservable();
  }
}
