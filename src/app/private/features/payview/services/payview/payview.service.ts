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
import { PaymentMethod } from '@api/core/model/payments/enums/payment-method.enum';
import { PaymentsCreditCardService } from '@api/payments/cards';
import { PaymentService } from '@core/payments/payment.service';
import { PaymentsPaymentMethods } from '@api/core/model/payments/interfaces/payments-payment-methods.interface';
import { PaymentsPaymentMethodsService } from '@api/payments/payment-methods/payments-payment-methods.service';
import { PaymentsUserPaymentPreferences } from '@api/core/model/payments/interfaces/payments-user-payment-preferences.interface';
import { PaymentsUserPaymentPreferencesService } from '@api/bff/payments/user-payment-preferences/payments-user-payment-preferences.service';
import { PaymentsWalletsService } from '@api/payments/wallets/payments-wallets.service';
import { PayviewState } from '@private/features/payview/interfaces/payview-state.interface';
import { TOAST_TYPES } from '@layout/toast/core/interfaces/toast.interface';
import { ToastService } from '@layout/toast/core/services/toast.service';

import { catchError, concatMap, map, mergeMap, take } from 'rxjs/operators';
import { forkJoin, Observable, ObservableInput, of } from 'rxjs';

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
    private paymentMethodsService: PaymentsPaymentMethodsService,
    private paymentPreferencesService: PaymentsUserPaymentPreferencesService,
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

  public getCurrentState(itemHash: string): Observable<PayviewState> {
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
              wallet
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
    return this.paymentPreferencesService.update(preferences);
  }

  private getDefaultCosts(state: PayviewState): Observable<DeliveryBuyerCalculatorCosts> {
    const method = state.delivery.methods.deliveryMethods[state.delivery.methods.default.index];

    return this.calculatorService.getCosts(state.itemDetails.price, this.itemHash, null, method.method).pipe(take(1));
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
    return this.paymentPreferencesService.paymentUserPreferences.pipe(take(1));
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
    wallet: Money
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
