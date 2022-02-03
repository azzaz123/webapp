import { Injectable } from '@angular/core';

import { BuyerRequestsApiService } from '@api/delivery/buyer/requests/buyer-requests-api.service';
import { BuyerRequestsItemsDetails } from '@api/core/model/delivery/buyer-request/buyer-requests-items-details.interface';
import { CreditCard } from '@api/core/model';
import {
  DeliveryAddressApi,
  DeliveryCountryISOCode,
} from '@private/features/delivery/interfaces/delivery-address/delivery-address-api.interface';
import { DeliveryAddressService } from '@private/features/delivery/services/address/delivery-address/delivery-address.service';
import { DeliveryBuyerCalculatorCosts } from '@api/core/model/delivery/buyer/calculator/delivery-buyer-calculator-costs.interface';
import { DeliveryBuyerCalculatorService } from '@api/delivery/buyer/calculator/delivery-buyer-calculator.service';
import { DeliveryBuyerDeliveryMethods } from '@api/core/model/delivery/buyer/delivery-methods';
import { DeliveryBuyerService } from '@api/bff/delivery/buyer/delivery-buyer.service';
import { DeliveryCosts } from '@api/core/model/delivery/costs/delivery-costs.interface';
import { DeliveryCostsService } from '@api/bff/delivery/costs/delivery-costs.service';
import { Item } from '@core/item/item';
import { ItemService } from '@core/item/item.service';
import { Money } from '@api/core/model/money.interface';
import { PaymentsCreditCardService } from '@api/payments/cards';
import { PaymentsPaymentMethods } from '@api/core/model/payments/interfaces/payments-payment-methods.interface';
import { PaymentsPaymentMethodsService } from '@api/payments/payment-methods/payments-payment-methods.service';
import { PaymentsUserPaymentPreferences } from '@api/core/model/payments/interfaces/payments-user-payment-preferences.interface';
import { PaymentsUserPaymentPreferencesService } from '@api/bff/payments/user-payment-preferences/payments-user-payment-preferences.service';
import { PaymentsWalletsService } from '@api/payments/wallets/payments-wallets.service';
import { PayviewCountryIsoCode } from '@private/features/payview/enums/payview-country-iso-code.enum';
import { PayviewDeliveryAddress } from '@private/features/payview/interfaces/payview-delivery-address.interface';
import { PayviewState } from '@private/features/payview/interfaces/payview-state.interface';
import { ToDomainMapper } from '@api/core/utils/types';

import { concatMap, map, mergeMap, take } from 'rxjs/operators';
import { forkJoin, Observable, ObservableInput, of } from 'rxjs';

const countries: Record<DeliveryCountryISOCode, PayviewCountryIsoCode> = {
  ES: PayviewCountryIsoCode.ES,
  IT: PayviewCountryIsoCode.IT,
};

const mapToPayviewDeliveryAddress: ToDomainMapper<DeliveryAddressApi, PayviewDeliveryAddress> = (input: DeliveryAddressApi) => {
  const {
    city,
    country_iso_code: country,
    full_name: fullName,
    flat_and_floor: flatAndFloor,
    id,
    phone_number: phoneNumber,
    postal_code: postalCode,
    region,
    street,
  } = input;

  return {
    city,
    countryIsoCode: mapToCountryIsoCode(country),
    flatAndFloor,
    fullName,
    id,
    phoneNumber,
    postalCode,
    region,
    street,
  };
};

const mapToCountryIsoCode: ToDomainMapper<DeliveryCountryISOCode, PayviewCountryIsoCode> = (input: DeliveryCountryISOCode) => {
  return countries[input];
};

@Injectable()
export class PayviewService {
  private static itemId: string;

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

  public getCurrentState(): Observable<PayviewState> {
    return forkJoin(this.stateSources)
      .pipe(
        mergeMap(
          ([address, card, deliveryCosts, deliveryMethods, item, itemDetails, paymentMethods, paymentPreferences, wallet]: [
            PayviewDeliveryAddress,
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

  public set itemHash(value: string) {
    PayviewService.itemId = value;
  }

  private get address(): Observable<PayviewDeliveryAddress> {
    return this.addressService.get(false).pipe(map(mapToPayviewDeliveryAddress));
  }

  private get card(): Observable<CreditCard> {
    return this.creditCardService.get();
  }

  private getCosts(state: PayviewState): Observable<DeliveryBuyerCalculatorCosts> {
    const method = state.delivery.methods.deliveryMethods[state.delivery.methods.default.index];

    return this.calculatorService.getCosts(state.itemDetails.price, PayviewService.itemId, null, method.method);
  }

  private get deliveryCosts(): Observable<DeliveryCosts> {
    return this.deliveryCostsService.getCosts(PayviewService.itemId);
  }

  private get deliveryMethods(): Observable<DeliveryBuyerDeliveryMethods> {
    return this.deliveryBuyerService.getDeliveryMethods(PayviewService.itemId);
  }

  private get item(): Observable<Item> {
    return this.itemService.get(PayviewService.itemId);
  }

  private get itemDetails(): Observable<BuyerRequestsItemsDetails> {
    return this.buyerRequestService.getRequestsItemsDetails(PayviewService.itemId);
  }

  private get paymentMethods(): Observable<PaymentsPaymentMethods> {
    return this.paymentMethodsService.paymentMethods;
  }

  private get paymentPreferences(): Observable<PaymentsUserPaymentPreferences> {
    return this.paymentPreferencesService.paymentUserPreferences;
  }

  private getState(
    costs: DeliveryBuyerCalculatorCosts,
    address: PayviewDeliveryAddress,
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
      itemDetails: itemDetails,
      payment: {
        card,
        methods: paymentMethods,
        preferences: paymentPreferences,
        wallet,
      },
    });
  }

  private get stateSources(): ObservableInput<unknown>[] {
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
