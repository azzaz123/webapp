import { Injectable } from '@angular/core';

import { BuyerRequestsApiService } from '@api/delivery/buyer/requests/buyer-requests-api.service';
import { BuyerRequestsItemsDetails } from '@api/core/model/delivery/buyer-request/buyer-requests-items-details.interface';
import { CardInvalidError } from '@api/core/errors/payments/cards';
import { CreditCard } from '@api/core/model';
import { DeliveryAddress } from '@api/core/model/delivery/address/delivery-address.interface';
import { DeliveryAddressService } from '@private/features/delivery/services/address/delivery-address/delivery-address.service';
import { DeliveryBuyerCalculatorCosts } from '@api/core/model/delivery/buyer/calculator/delivery-buyer-calculator-costs.interface';
import { DeliveryBuyerCalculatorService } from '@api/delivery/buyer/calculator/delivery-buyer-calculator.service';
import { DeliveryBuyerDeliveryMethod, DeliveryBuyerDeliveryMethods } from '@api/core/model/delivery/buyer/delivery-methods';
import { DeliveryBuyerService } from '@api/bff/delivery/buyer/delivery-buyer.service';
import { DeliveryCosts } from '@api/core/model/delivery/costs/delivery-costs.interface';
import { DeliveryCostsService } from '@api/bff/delivery/costs/delivery-costs.service';
import { Item } from '@core/item/item';
import { ItemService } from '@core/item/item.service';
import { mapToDeliveryAddress } from '@private/features/payview/services/payview/payview.mappers';
import { Money } from '@api/core/model/money.interface';
import { PaymentsCreditCardService } from '@api/payments/cards';
import { PaymentsPaymentMethods } from '@api/core/model/payments/interfaces/payments-payment-methods.interface';
import { PaymentsPaymentMethodsService } from '@api/payments/payment-methods/payments-payment-methods.service';
import { PaymentsUserPaymentPreferences } from '@api/core/model/payments/interfaces/payments-user-payment-preferences.interface';
import { PaymentsUserPaymentPreferencesService } from '@api/bff/payments/user-payment-preferences/payments-user-payment-preferences.service';
import { PaymentsWalletsService } from '@api/payments/wallets/payments-wallets.service';
import { PayviewState } from '@private/features/payview/interfaces/payview-state.interface';
import { TOAST_TYPES } from '@layout/toast/core/interfaces/toast.interface';
import { ToastService } from '@layout/toast/core/services/toast.service';

import { catchError, concatMap, filter, map, mergeMap, take } from 'rxjs/operators';
import { forkJoin, Observable, ObservableInput, of, throwError } from 'rxjs';
import { PaymentsClientBrowserInfoApiService } from '@api/payments/users/client-browser-info/payments-client-browser-info-api.service';
import { ContinueDeliveryPaymentService } from '@private/shared/continue-delivery-payment/continue-delivery-payment.service';
import { DeliveryRealTimeService } from '@private/core/services/delivery-real-time/delivery-real-time.service';
import { DELIVERY_MODE } from '@api/core/model/delivery/delivery-mode.type';
import { UserPaymentPreferencesUnknownError } from '@api/core/errors/delivery/payview/user-payment-preferences';
import { WEB_VIEW_MODAL_CLOSURE_METHOD } from '@shared/web-view-modal/enums/web-view-modal-closure-method';
import { PAYMENT_CONTINUED_POST_ACTION } from '@private/shared/continue-delivery-payment/enums/payment-continued-post-action.enum';

@Injectable({
  providedIn: 'root',
})
export class PayviewService {
  private itemHash: string;

  constructor(
    private addressService: DeliveryAddressService,
    private buyerRequestService: BuyerRequestsApiService,
    private calculatorService: DeliveryBuyerCalculatorService,
    private creditCardService: PaymentsCreditCardService,
    private deliveryBuyerService: DeliveryBuyerService,
    private deliveryCostsService: DeliveryCostsService,
    private itemService: ItemService,
    private paymentsClientBrowserInfoApiService: PaymentsClientBrowserInfoApiService,
    private paymentMethodsService: PaymentsPaymentMethodsService,
    private paymentPreferencesService: PaymentsUserPaymentPreferencesService,
    private continueDeliveryPaymentService: ContinueDeliveryPaymentService,
    private deliveryRealTimeService: DeliveryRealTimeService,
    private toastService: ToastService,
    private walletsService: PaymentsWalletsService
  ) {}

  public get address(): Observable<DeliveryAddress> {
    return this.addressService.get(false).pipe(
      take(1),
      map(mapToDeliveryAddress),
      catchError(() => of(null))
    );
  }

  public get card(): Observable<CreditCard> {
    return this.creditCardService.get().pipe(
      take(1),
      catchError((error) => {
        if (error instanceof CardInvalidError) {
          this.showToast(error.message, TOAST_TYPES.ERROR);
        }
        return of(null);
      })
    );
  }

  public getCosts(
    itemHash: string,
    price: Money,
    promocode: string,
    method: DeliveryBuyerDeliveryMethod
  ): Observable<DeliveryBuyerCalculatorCosts> {
    return this.calculatorService.getCosts(price, itemHash, promocode, method.method).pipe(take(1));
  }

  public getDeliveryCosts(itemHash: string): Observable<DeliveryCosts> {
    return this.deliveryCostsService.getCosts(itemHash).pipe(take(1));
  }

  public getDeliveryMethods(itemHash): Observable<DeliveryBuyerDeliveryMethods> {
    return this.deliveryBuyerService.getDeliveryMethods(itemHash).pipe(take(1));
  }

  public getCurrentState(itemHash: string, buyerRequestId: string): Observable<PayviewState> {
    this.itemHash = itemHash;

    return forkJoin(this.stateSources)
      .pipe(
        mergeMap(
          ([address, card, deliveryCosts, deliveryMethods, item, itemDetails, paymentMethods, paymentPreferences, wallet]: [
            DeliveryAddress,
            CreditCard,
            DeliveryCosts,
            DeliveryBuyerDeliveryMethods,
            Item,
            BuyerRequestsItemsDetails,
            PaymentsPaymentMethods,
            PaymentsUserPaymentPreferences,
            Money
          ]) => {
            return this.getState(
              null,
              address,
              card,
              deliveryCosts,
              deliveryMethods,
              item,
              itemDetails,
              paymentMethods,
              paymentPreferences,
              wallet,
              buyerRequestId
            );
          }
        )
      )
      .pipe(
        concatMap((state: PayviewState) => {
          return this.getDefaultCosts(state).pipe(
            take(1),
            map((costs: DeliveryBuyerCalculatorCosts) => {
              return {
                ...state,
                ...{ costs },
              };
            })
          );
        })
      );
  }

  public setUserPaymentPreferences(preferences: PaymentsUserPaymentPreferences): Observable<void> {
    return this.paymentPreferencesService
      .setUserPaymentPreferences(preferences)
      .pipe(catchError(() => throwError([new UserPaymentPreferencesUnknownError()])));
  }

  public request(state: PayviewState): Observable<WEB_VIEW_MODAL_CLOSURE_METHOD> {
    return this.sendPaymentUserInfo(state.payment.preferences).pipe(concatMap(() => this.buyFlow(state)));
  }

  private sendPaymentUserInfo(paymentPreferences: PaymentsUserPaymentPreferences): Observable<void> {
    return this.paymentsClientBrowserInfoApiService
      .sendBrowserInfo()
      .pipe(concatMap(() => this.setUserPaymentPreferences(paymentPreferences)));
  }

  private buyFlow(state: PayviewState): Observable<WEB_VIEW_MODAL_CLOSURE_METHOD> {
    return this.buyerRequestService
      .buyRequest(state)
      .pipe(
        concatMap(() =>
          this.listenToThreeDomainNotification().pipe(
            concatMap(() =>
              this.continueDeliveryPaymentService.continue(
                state.buyerRequestId,
                state.itemDetails.itemHash,
                PAYMENT_CONTINUED_POST_ACTION.NONE
              )
            )
          )
        )
      );
  }

  private listenToThreeDomainNotification(): Observable<void> {
    return this.deliveryRealTimeService.deliveryRealTimeNotifications$.pipe(
      filter((notification) => notification.id.endsWith('3ds_ready')),
      map(() => {})
    );
  }

  private getDefaultCosts(state: PayviewState): Observable<DeliveryBuyerCalculatorCosts> {
    const isThereAnyDeliveryMethod: boolean = !!state.delivery.methods.deliveryMethods.length;
    const deliveryMode: DELIVERY_MODE = isThereAnyDeliveryMethod
      ? state.delivery.methods.deliveryMethods[state.delivery.methods.default.index].method
      : null;

    return this.calculatorService.getCosts(state.itemDetails.price, this.itemHash, null, deliveryMode).pipe(take(1));
  }

  private get defaultDeliveryCosts(): Observable<DeliveryCosts> {
    return this.deliveryCostsService.getCosts(this.itemHash).pipe(take(1));
  }

  private get defaultDeliveryMethods(): Observable<DeliveryBuyerDeliveryMethods> {
    return this.deliveryBuyerService.getDeliveryMethods(this.itemHash).pipe(take(1));
  }

  private get item(): Observable<Item> {
    return this.itemService.get(this.itemHash).pipe(take(1));
  }

  private get itemDetails(): Observable<BuyerRequestsItemsDetails> {
    return this.buyerRequestService.getRequestsItemsDetails(this.itemHash).pipe(take(1));
  }

  private get paymentMethods(): Observable<PaymentsPaymentMethods> {
    return this.paymentMethodsService.paymentMethods.pipe(take(1));
  }

  private get paymentPreferences(): Observable<PaymentsUserPaymentPreferences> {
    return this.paymentPreferencesService.get().pipe(take(1));
  }

  private getState(
    costs: DeliveryBuyerCalculatorCosts,
    address: DeliveryAddress,
    card: CreditCard,
    deliveryCosts: DeliveryCosts,
    deliveryMethods: DeliveryBuyerDeliveryMethods,
    item: Item,
    itemDetails: BuyerRequestsItemsDetails,
    paymentMethods: PaymentsPaymentMethods,
    paymentPreferences: PaymentsUserPaymentPreferences,
    wallet: Money,
    buyerRequestId: string
  ): Observable<PayviewState> {
    return of({
      costs,
      delivery: {
        address,
        costs: deliveryCosts,
        methods: deliveryMethods,
      },
      item,
      itemDetails,
      payment: {
        card,
        methods: paymentMethods,
        preferences: paymentPreferences,
        wallet,
      },
      buyerRequestId,
    });
  }

  private showToast(text: string, type: TOAST_TYPES): void {
    this.toastService.show({
      text,
      type,
    });
  }

  private get stateSources(): [
    ObservableInput<DeliveryAddress>,
    ObservableInput<CreditCard>,
    ObservableInput<DeliveryCosts>,
    ObservableInput<DeliveryBuyerDeliveryMethods>,
    ObservableInput<Item>,
    ObservableInput<BuyerRequestsItemsDetails>,
    ObservableInput<PaymentsPaymentMethods>,
    ObservableInput<PaymentsUserPaymentPreferences>,
    ObservableInput<Money>
  ] {
    return [
      this.address,
      this.card,
      this.defaultDeliveryCosts,
      this.defaultDeliveryMethods,
      this.item,
      this.itemDetails,
      this.paymentMethods,
      this.paymentPreferences,
      this.walletBalance,
    ];
  }

  private get walletBalance(): Observable<Money> {
    return this.walletsService.walletBalance$.pipe(take(1));
  }
}
