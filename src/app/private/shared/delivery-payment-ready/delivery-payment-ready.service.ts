import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TransactionTrackingService } from '@api/bff/delivery/transaction-tracking/transaction-tracking.service';
import { BuyerRequest } from '@api/core/model/delivery/buyer-request/buyer-request.interface';
import { BUYER_REQUEST_PAYMENT_STATUS } from '@api/core/model/delivery/buyer-request/status/buyer-payment-status.enum';
import { BuyerRequestsApiService } from '@api/delivery/buyer/requests/buyer-requests-api.service';
import { DeliveryExperimentalFeaturesService } from '@private/core/services/delivery-experimental-features/delivery-experimental-features.service';
import { DELIVERY_PATHS } from '@private/features/delivery/delivery-routing-constants';
import { PRIVATE_PATHS } from '@private/private-routing-constants';
import { WEB_VIEW_MODAL_CLOSURE_METHOD } from '@shared/web-view-modal/enums/web-view-modal-closure-method';
import { Observable, of } from 'rxjs';
import { concatMap, filter, finalize, map } from 'rxjs/operators';
import { PAYMENT_CONTINUED_POST_ACTION } from './enums/payment-continued-post-action.enum';
import { ContinueToPayPalService } from './modules/continue-to-pay-pal/services/continue-to-pay-pal.service';
import { ContinueWithCreditCardService } from './modules/continue-with-credit-card/services/continue-with-credit-card.service';

@Injectable()
export class DeliveryPaymentReadyService {
  constructor(
    private router: Router,
    private buyerRequestsApiService: BuyerRequestsApiService,
    private transactionTrackingService: TransactionTrackingService,
    private deliveryExperimentalFeaturesService: DeliveryExperimentalFeaturesService,
    private continueToPayPalService: ContinueToPayPalService,
    private continueWithCreditCardService: ContinueWithCreditCardService
  ) {}

  public continue(
    requestId: string,
    itemHash: string,
    postAction: PAYMENT_CONTINUED_POST_ACTION = PAYMENT_CONTINUED_POST_ACTION.NONE
  ): Observable<WEB_VIEW_MODAL_CLOSURE_METHOD> {
    return this.isFeatureEnabled().pipe(
      filter((enabled) => enabled),
      concatMap(() =>
        this.checkBuyerRequest(requestId, itemHash).pipe(
          concatMap((request: BuyerRequest) =>
            this.isPayPalRequest(request.id).pipe(
              concatMap((isPayPal: boolean) =>
                this.getContinueFlow(isPayPal, request).pipe(
                  concatMap((closureMethod: WEB_VIEW_MODAL_CLOSURE_METHOD) => this.getCloseFlow(closureMethod, request))
                )
              )
            )
          ),
          finalize(() => this.handleCompletedFlow(postAction, requestId))
        )
      )
    );
  }

  private isFeatureEnabled(): Observable<boolean> {
    return this.deliveryExperimentalFeaturesService.featuresEnabled$;
  }

  private checkBuyerRequest(requestId: string, itemHash: string) {
    return this.buyerRequestsApiService.getRequestsAsBuyerByItemHash(itemHash).pipe(
      filter((requests: BuyerRequest[]) => {
        const request: BuyerRequest = requests.find((r) => r.id === requestId);
        const requestExists: boolean = !!request;
        const isContinueFlowNeeded: boolean = requestExists && request.status.payment === BUYER_REQUEST_PAYMENT_STATUS.READY;

        return requestExists && isContinueFlowNeeded;
      }),
      map((requests) => requests.find((r) => r.id === requestId))
    );
  }

  private isPayPalRequest(id: string) {
    return this.transactionTrackingService.requestWasDoneWithPayPal(id);
  }

  private getContinueFlow(isPayPal: boolean, request: BuyerRequest): Observable<WEB_VIEW_MODAL_CLOSURE_METHOD> {
    const continueFlow = isPayPal ? this.continueToPayPalService.continue(request) : this.continueWithCreditCardService.continue(request);
    return continueFlow;
  }

  private getCloseFlow(closureMethod: WEB_VIEW_MODAL_CLOSURE_METHOD, request: BuyerRequest): Observable<WEB_VIEW_MODAL_CLOSURE_METHOD> {
    const closureFlow = closureMethod === WEB_VIEW_MODAL_CLOSURE_METHOD.MANUAL ? this.cancelRequest(request.id) : of(null);
    return closureFlow.pipe(map(() => closureMethod));
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
