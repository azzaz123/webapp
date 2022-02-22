import { Injectable } from '@angular/core';

import { BuyerRequestsApiService } from '@api/delivery/buyer/requests/buyer-requests-api.service';
import { BuyerRequestsItemsDetails } from '@api/core/model/delivery/buyer-request/buyer-requests-items-details.interface';
import { CreditCard } from '@api/core/model';
import { DeliveryAddress } from '@api/core/model/delivery/address/delivery-address.interface';
import { DeliveryAddressService } from '@private/features/delivery/services/address/delivery-address/delivery-address.service';
import { DeliveryBuyerCalculatorCosts } from '@api/core/model/delivery/buyer/calculator/delivery-buyer-calculator-costs.interface';
import { DeliveryBuyerCalculatorService } from '@api/delivery/buyer/calculator/delivery-buyer-calculator.service';
import { DeliveryBuyerDeliveryMethods } from '@api/core/model/delivery/buyer/delivery-methods';
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
    private walletsService: PaymentsWalletsService
  ) {}

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
          return this.getCosts(state).pipe(
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

  private get address(): Observable<DeliveryAddress> {
    return this.addressService.get(false).pipe(
      map(mapToDeliveryAddress),
      catchError(() => of(null))
    );
  }

  private get card(): Observable<CreditCard> {
    return this.creditCardService.get().pipe(catchError(() => of(null)));
  }

  private getCosts(state: PayviewState): Observable<DeliveryBuyerCalculatorCosts> {
    const method = state.delivery.methods.deliveryMethods[state.delivery.methods.default.index];

    return this.calculatorService.getCosts(state.itemDetails.price, this.itemHash, null, method.method);
  }

  private get deliveryCosts(): Observable<DeliveryCosts> {
    return this.deliveryCostsService.getCosts(this.itemHash);
  }

  private get deliveryMethods(): Observable<DeliveryBuyerDeliveryMethods> {
    return this.deliveryBuyerService.getDeliveryMethods(this.itemHash);
  }

  private get item(): Observable<Item> {
    return this.itemService.get(this.itemHash);
  }

  private get itemDetails(): Observable<BuyerRequestsItemsDetails> {
    return this.buyerRequestService.getRequestsItemsDetails(this.itemHash);
  }

  private get paymentMethods(): Observable<PaymentsPaymentMethods> {
    return this.paymentMethodsService.paymentMethods;
  }

  private get paymentPreferences(): Observable<PaymentsUserPaymentPreferences> {
    return this.paymentPreferencesService.paymentUserPreferences;
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
      this.deliveryCosts,
      this.deliveryMethods,
      this.item,
      this.itemDetails,
      this.paymentMethods,
      this.paymentPreferences,
      this.walletBalance,
    ];
  }

  private get walletBalance(): Observable<Money> {
    return this.walletsService.walletBalance$;
  }
}
