import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TransactionTrackingService } from '@api/bff/delivery/transaction-tracking/transaction-tracking.service';
import { BuyerRequest } from '@api/core/model/delivery/buyer-request/buyer-request.interface';
import { BUYER_REQUEST_PAYMENT_STATUS } from '@api/core/model/delivery/buyer-request/status/buyer-payment-status.enum';
import { BuyerRequestsApiService } from '@api/delivery/buyer/requests/buyer-requests-api.service';
import { environment } from '@environments/environment';
import { DeliveryExperimentalFeaturesService } from '@private/core/services/delivery-experimental-features/delivery-experimental-features.service';
import { DELIVERY_MODAL_CLASSNAME } from '@private/features/delivery/constants/delivery-constants';
import { DELIVERY_PATHS } from '@private/features/delivery/delivery-routing-constants';
import { PRIVATE_PATHS } from '@private/private-routing-constants';
import { WEB_VIEW_MODAL_CLOSURE_METHOD } from '@shared/web-view-modal/enums/web-view-modal-closure-method';
import { WebViewModalService } from '@shared/web-view-modal/services/web-view-modal.service';
import { Observable, of } from 'rxjs';
import { concatMap, finalize } from 'rxjs/operators';
import { PAYMENT_CONTINUED_POST_ACTION } from './enums/payment-continued-post-action.enum';
import { ContinueToPayPalService } from './modules/continue-to-pay-pal/services/continue-to-pay-pal.service';

@Injectable()
export class DeliveryPaymentReadyService {
  constructor(
    private router: Router,
    private webViewModalService: WebViewModalService,
    private buyerRequestsApiService: BuyerRequestsApiService,
    private transactionTrackingService: TransactionTrackingService,
    private deliveryExperimentalFeaturesService: DeliveryExperimentalFeaturesService,
    private continueToPayPalService: ContinueToPayPalService
  ) {}

  public continueBuyerRequestBuyFlow(
    requestId: string,
    itemHash: string,
    postAction: PAYMENT_CONTINUED_POST_ACTION = PAYMENT_CONTINUED_POST_ACTION.NONE
  ): Observable<WEB_VIEW_MODAL_CLOSURE_METHOD> {
    return this.buyerRequestsApiService.getRequestsAsBuyerByItemHash(itemHash).pipe(
      concatMap((requests: BuyerRequest[]) => {
        const request: BuyerRequest = requests.find((r) => r.id === requestId);
        if (!request) {
          return of(null);
        }

        const isContinueFlowNotNeeded: boolean = request.status.payment !== BUYER_REQUEST_PAYMENT_STATUS.READY;
        if (isContinueFlowNotNeeded) {
          return of(null);
        }

        return this.deliveryExperimentalFeaturesService.featuresEnabled$.pipe(
          concatMap((enabled: boolean) => {
            if (enabled) {
              return this.transactionTrackingService.requestWasDoneWithPayPal(request.id).pipe(
                concatMap((isPayPal) => {
                  const continueFlow = isPayPal ? this.continueToPayPalService.continue(request) : this.continueCreditCardFlow(request);
                  return continueFlow.pipe(
                    concatMap((closureMethod) =>
                      closureMethod === WEB_VIEW_MODAL_CLOSURE_METHOD.MANUAL ? this.cancelRequest(request.id) : of(null)
                    )
                  );
                })
              );
            }
            return of(null);
          })
        );
      }),
      finalize(() => this.handleCompletedFlow(postAction, requestId))
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

    return this.webViewModalService.open(externalUrl, this.title, DELIVERY_MODAL_CLASSNAME);
  }

  private cancelRequest(id: string): Observable<void> {
    return this.buyerRequestsApiService.cancelRequest(id);
  }

  private redirectToTTS(id: string): void {
    const route: string = `${PRIVATE_PATHS.DELIVERY}/${DELIVERY_PATHS.TRACKING}/${id}`;
    this.router.navigate([route]);
  }

  private handleCompletedFlow(action: PAYMENT_CONTINUED_POST_ACTION, id: string): void {
    if (action === PAYMENT_CONTINUED_POST_ACTION.NONE) {
      return;
    }

    if (action === PAYMENT_CONTINUED_POST_ACTION.REDIRECT_TTS) {
      return this.redirectToTTS(id);
    }
  }
}
