import { Inject, Injectable } from '@angular/core';
import { TransactionTrackingService } from '@api/bff/delivery/transaction-tracking/transaction-tracking.service';
import { BuyerRequest } from '@api/core/model/delivery/buyer-request/buyer-request.interface';
import { BUYER_REQUEST_PAYMENT_STATUS } from '@api/core/model/delivery/buyer-request/status/buyer-payment-status.enum';
import { PAYVIEW_PAYMENT_METHOD } from '@api/core/model/payments';
import { AVAILABLE_PAYMENT_METHODS } from '@api/core/model/payments/constants/available-payments';
import { BuyerRequestsApiService } from '@api/delivery/buyer/requests/buyer-requests-api.service';
import { WINDOW_TOKEN } from '@core/window/window.token';
import { environment } from '@environments/environment';
import { DeliveryExperimentalFeaturesService } from '@private/core/services/delivery-experimental-features/delivery-experimental-features.service';
import { DELIVERY_MODAL_CLASSNAME } from '@private/features/delivery/constants/delivery-constants';
import { WEB_VIEW_MODAL_CLOSURE_METHOD } from '@shared/web-view-modal/enums/web-view-modal-closure-method';
import { WebViewModalService } from '@shared/web-view-modal/services/web-view-modal.service';
import { Observable, of, ReplaySubject, timer } from 'rxjs';
import { tap, takeUntil, concatMap, map } from 'rxjs/operators';

@Injectable()
export class DeliveryPaymentReadyService {
  constructor(
    @Inject(WINDOW_TOKEN) private window: Window,
    private webViewModalService: WebViewModalService,
    private buyerRequestsApiService: BuyerRequestsApiService,
    private transactionTrackingService: TransactionTrackingService,
    private deliveryExperimentalFeaturesService: DeliveryExperimentalFeaturesService
  ) {}

  public continueBuyerRequestBuyFlow(request: BuyerRequest): Observable<WEB_VIEW_MODAL_CLOSURE_METHOD> {
    const isContinueFlowNotNeeded: boolean = request.status.payment !== BUYER_REQUEST_PAYMENT_STATUS.READY;
    if (isContinueFlowNotNeeded) {
      return of(null);
    }

    return this.deliveryExperimentalFeaturesService.featuresEnabled$.pipe(
      concatMap((enabled) => {
        if (enabled) {
          return this.transactionTrackingService
            .requestWasDoneWithPayPal(request.id)
            .pipe(concatMap((isPayPal) => (isPayPal ? this.continuePayPalFlow(request) : this.continueCreditCardFlow(request))));
        }
        return of(null);
      })
    );
  }

  private get title(): string {
    return $localize`:@@checkout_summary_view_buyer_top_bar_title:Make a purchase`;
  }

  private getExternalUrl(id: string): string {
    return `${environment.baseUrl}api/v3/delivery/request/payment/start/${id}`;
  }

  private continueCreditCardFlow(buyerRequest: BuyerRequest): Observable<WEB_VIEW_MODAL_CLOSURE_METHOD> {
    const { id } = buyerRequest;
    const externalUrl: string = this.getExternalUrl(id);

    return this.webViewModalService.open(externalUrl, this.title, DELIVERY_MODAL_CLASSNAME).pipe(
      concatMap((closureMethod: WEB_VIEW_MODAL_CLOSURE_METHOD) => {
        return closureMethod === WEB_VIEW_MODAL_CLOSURE_METHOD.MANUAL
          ? this.cancelRequest(id).pipe(map(() => closureMethod))
          : of(closureMethod);
      })
    );
  }

  private continuePayPalFlow(buyerRequest: BuyerRequest): Observable<WEB_VIEW_MODAL_CLOSURE_METHOD> {
    const { id } = buyerRequest;
    const externalUrl: string = this.getExternalUrl(id);

    const subject: ReplaySubject<WEB_VIEW_MODAL_CLOSURE_METHOD> = new ReplaySubject<WEB_VIEW_MODAL_CLOSURE_METHOD>();
    const completeCurrentFlow = () => {
      subject.next(WEB_VIEW_MODAL_CLOSURE_METHOD.AUTOMATIC);
      subject.complete();
    };

    const isPayPalNotAvailable: boolean = !(
      AVAILABLE_PAYMENT_METHODS.includes(PAYVIEW_PAYMENT_METHOD.PAYPAL) ||
      AVAILABLE_PAYMENT_METHODS.includes(PAYVIEW_PAYMENT_METHOD.WALLET_AND_PAYPAL)
    );
    if (isPayPalNotAvailable) {
      subject.error(null);
      return subject.asObservable();
    }

    const windowRef: Window = this.window.open(externalUrl, '_blank');

    timer(0, 500)
      .pipe(
        tap(() => {
          if (!windowRef || windowRef.closed) {
            return completeCurrentFlow();
          }
        }),
        takeUntil(subject)
      )
      .subscribe();

    return subject.asObservable();
  }

  private cancelRequest(id: string): Observable<void> {
    return this.buyerRequestsApiService.cancelRequest(id);
  }
}
