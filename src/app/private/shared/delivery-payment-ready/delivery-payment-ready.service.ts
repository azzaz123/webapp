import { Inject, Injectable } from '@angular/core';
import { PrePaymentUnknownError } from '@api/core/errors/delivery/payview/pre-payment';
import { BuyerRequest } from '@api/core/model/delivery/buyer-request/buyer-request.interface';
import { BUYER_REQUEST_PAYMENT_STATUS } from '@api/core/model/delivery/buyer-request/status/buyer-payment-status.enum';
import { PAYVIEW_PAYMENT_METHOD } from '@api/core/model/payments';
import { BuyerRequestsApiService } from '@api/delivery/buyer/requests/buyer-requests-api.service';
import { WINDOW_TOKEN } from '@core/window/window.token';
import { environment } from '@environments/environment';
import { DELIVERY_MODAL_CLASSNAME } from '@private/features/delivery/constants/delivery-constants';
import { WEB_VIEW_MODAL_CLOSURE_METHOD } from '@shared/web-view-modal/enums/web-view-modal-closure-method';
import { WebViewModalService } from '@shared/web-view-modal/services/web-view-modal.service';
import { Observable, of, ReplaySubject, throwError, timer } from 'rxjs';
import { tap, takeUntil, concatMap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class DeliveryPaymentReadyService {
  constructor(
    @Inject(WINDOW_TOKEN) private window: Window,
    private webViewModalService: WebViewModalService,
    private buyerRequestsApiService: BuyerRequestsApiService
  ) {}

  public continueBuyerRequestBuyFlow(buyerRequest: BuyerRequest, paymentMethod: PAYVIEW_PAYMENT_METHOD): Observable<void> {
    const isContinueFlowNotNeeded: boolean = buyerRequest.status.payment !== BUYER_REQUEST_PAYMENT_STATUS.READY;
    if (isContinueFlowNotNeeded) {
      return of(null);
    }

    if (paymentMethod === PAYVIEW_PAYMENT_METHOD.CREDIT_CARD) {
      return this.continueCreditCardFlow(buyerRequest);
    }

    if (paymentMethod === PAYVIEW_PAYMENT_METHOD.PAYPAL) {
      return this.continuePayPalFlow(buyerRequest);
    }

    return throwError(new PrePaymentUnknownError());
  }

  private get title(): string {
    return $localize`:@@checkout_summary_view_buyer_top_bar_title:Make a purchase`;
  }

  private getExternalUrl(id: string): string {
    return `${environment.baseUrl}api/v3/delivery/request/payment/start/${id}`;
  }

  private continueCreditCardFlow(buyerRequest: BuyerRequest): Observable<void> {
    const { id } = buyerRequest;
    const externalUrl: string = this.getExternalUrl(id);

    return this.webViewModalService.open(externalUrl, this.title, DELIVERY_MODAL_CLASSNAME).pipe(
      concatMap((closureMethod: WEB_VIEW_MODAL_CLOSURE_METHOD) => {
        return closureMethod === WEB_VIEW_MODAL_CLOSURE_METHOD.MANUAL ? this.cancelRequest(id) : of(null);
      })
    );
  }

  //TODO: This needs to be reviewed, from both technical and legal POVs
  private continuePayPalFlow(buyerRequest: BuyerRequest): Observable<void> {
    const { id } = buyerRequest;
    const externalUrl: string = this.getExternalUrl(id);

    const subject: ReplaySubject<void> = new ReplaySubject<void>();
    const windowRef: Window = this.window.open(externalUrl, '_blank');

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

  private cancelRequest(id: string): Observable<void> {
    return this.buyerRequestsApiService.cancelRequest(id);
  }
}
