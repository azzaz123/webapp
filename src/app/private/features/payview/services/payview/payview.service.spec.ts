import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { BuyerRequestsApiService } from '@api/delivery/buyer/requests/buyer-requests-api.service';
import { DELIVERY_MODE } from '@api/core/model/delivery/delivery-mode.type';
import { DeliveryAddressService } from '@private/features/delivery/services/address/delivery-address/delivery-address.service';
import { DeliveryBuyerCalculatorService } from '@api/delivery/buyer/calculator/delivery-buyer-calculator.service';
import { DeliveryBuyerService } from '@api/bff/delivery/buyer/delivery-buyer.service';
import { DeliveryCostsService } from '@api/bff/delivery/costs/delivery-costs.service';
import { ItemService } from '@core/item/item.service';
import { Money } from '@api/core/model/money.interface';
import { PaymentsCreditCardService } from '@api/payments/cards';
import { PaymentsPaymentMethodsService } from '@api/payments/payment-methods/payments-payment-methods.service';
import { PaymentsUserPaymentPreferencesService } from '@api/bff/payments/user-payment-preferences/payments-user-payment-preferences.service';
import { PaymentsWalletsService } from '@api/payments/wallets/payments-wallets.service';
import { PayviewService } from '@private/features/payview/services/payview/payview.service';
import { PayviewState } from '@private/features/payview/interfaces/payview-state.interface';

import { of } from 'rxjs';

describe('PayviewService', () => {
  let service: PayviewService;
  let buyerRequestsApiService: BuyerRequestsApiService;
  let deliveryAddressService: DeliveryAddressService;
  let deliveryBuyerService: DeliveryBuyerService;
  let deliveryBuyerCalculatorService: DeliveryBuyerCalculatorService;
  let deliveryCostsService: DeliveryCostsService;
  let itemService: ItemService;
  let paymentsCreditCardService: PaymentsCreditCardService;
  let paymentsPaymentMethodsService: PaymentsPaymentMethodsService;
  let paymentsUserPaymentPreferencesService: PaymentsUserPaymentPreferencesService;
  let paymentsWalletsService: PaymentsWalletsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: BuyerRequestsApiService,
          useValue: {
            getRequestsItemsDetails() {
              return of({
                categoryId: 15000,
                itemHash: 'p61v99q1rx65',
                pictureUrl: 'https://cdn-beta.wallapop.com/images/10420/35/ut/__/c10420p191234807/i422318107.jpg?pictureSize=W800',
                price: { amount: { integer: 63, decimals: 0, total: 63 }, currency: { code: 'EUR', symbol: '€' } },
                sellerCountry: 'ES',
                sellerUserHash: 'v4z4rv0lx86y',
                title: 'camiseta de camuflaje2',
              });
            },
          },
        },
        {
          provide: DeliveryAddressService,
          useValue: {
            get() {
              return of({
                city: 'Montserrat',
                countryIsoCode: 0,
                flatAndFloor: '6, 1',
                fullName: 'buyer jtrx.',
                id: 'dedfa0ab-d4bd-48da-acf6-f7976d2877d5',
                phoneNumber: '666666666',
                postalCode: '08199',
                region: 'Barcelona',
                street: 'calle jtrx',
              });
            },
          },
        },
        {
          provide: DeliveryBuyerService,
          useValue: {
            getDeliveryMethods() {
              return of({
                deliveryMethods: [
                  {
                    carrier: 0,
                    deliveryTimes: { from: 3, to: 7 },
                    icon: 'http://prod-delivery-resources.wallapop.com/Correos.png',
                    lastAddressUsed: {
                      id: 'c10c9fa9-9589-4212-991b-43237ac8afd6',
                      label: 'NAVARCLES, CATALUNYA, 13, 08270 Navarcles, Spain',
                    },
                    method: 1,
                  },
                  {
                    carrier: null,
                    deliveryTimes: { from: 3, to: 7 },
                    icon: 'http://prod-delivery-resources.wallapop.com/default_home.png',
                    lastAddressUsed: { id: 'dedfa0ab-d4bd-48da-acf6-f7976d2877d5', label: 'calle jtrx 6, 1, 08199 Montserrat, Spain' },
                    method: 0,
                  },
                ],
                default: { index: 1 },
              });
            },
          },
        },
        {
          provide: DeliveryBuyerCalculatorService,
          useValue: {
            getCosts() {
              return of({
                buyerCost: {
                  deliveryCost: { amount: { integer: 3, decimals: 95, total: 3.95 }, currency: { code: 'EUR', symbol: '€' } },
                  fees: { amount: { integer: 6, decimals: 3, total: 6.03 }, currency: { code: 'EUR', symbol: '€' } },
                  productPrice: { amount: { integer: 63, decimals: 0, total: 63 }, currency: { code: 'EUR', symbol: '€' } },
                  total: { amount: { integer: 72, decimals: 98, total: 72.98 }, currency: { code: 'EUR', symbol: '€' } },
                },
                promotion: null,
              });
            },
          },
        },
        {
          provide: DeliveryCostsService,
          useValue: {
            getCosts() {
              return of({
                buyerAddressCost: { amount: { integer: 3, decimals: 95, total: 3.95 }, currency: { code: 'EUR', symbol: '€' } },
                carrierOfficeCost: { amount: { integer: 2, decimals: 95, total: 2.95 }, currency: { code: 'EUR', symbol: '€' } },
              });
            },
          },
        },
        {
          provide: ItemService,
          useValue: {
            get() {
              return of({
                id: 'p61v99q1rx65',
                legacyId: null,
                owner: 'v4z4rv0lx86y',
                title: 'camiseta de camuflaje2',
                description: 'parece un MacBook pro',
                categoryId: 15000,
                location: null,
                salePrice: 63,
                currencyCode: 'EUR',
                modifiedDate: 1643886629627,
                url: 'https://api.beta.wallapop.com/i/191234807?_pid=wi&_uid=80395038',
                flags: { pending: false, sold: false, reserved: false, banned: false, expired: false, onhold: false },
                actionsAllowed: null,
                saleConditions: { fix_price: false, exchange_allowed: false, shipping_allowed: true, supports_shipping: true },
                mainImage: {
                  id: 'p61o49n27gj5',
                  urls_by_size: {
                    small: 'http://cdn-beta.wallapop.com/images/10420/35/ut/__/c10420p191234807/i422318107.jpg?pictureSize=W320',
                    original: 'http://cdn-beta.wallapop.com/images/10420/35/ut/__/c10420p191234807/i422318107.jpg?pictureSize=W1024',
                    large: 'http://cdn-beta.wallapop.com/images/10420/35/ut/__/c10420p191234807/i422318107.jpg?pictureSize=W800',
                    xlarge: 'http://cdn-beta.wallapop.com/images/10420/35/ut/__/c10420p191234807/i422318107.jpg?pictureSize=W1024',
                    medium: 'http://cdn-beta.wallapop.com/images/10420/35/ut/__/c10420p191234807/i422318107.jpg?pictureSize=W640',
                  },
                  average_hex_color: '5d7f96',
                  original_width: 0,
                  original_height: 0,
                },
                images: [
                  {
                    id: 'p61o49n27gj5',
                    urls_by_size: {
                      small: 'http://cdn-beta.wallapop.com/images/10420/35/ut/__/c10420p191234807/i422318107.jpg?pictureSize=W320',
                      original: 'http://cdn-beta.wallapop.com/images/10420/35/ut/__/c10420p191234807/i422318107.jpg?pictureSize=W1024',
                      large: 'http://cdn-beta.wallapop.com/images/10420/35/ut/__/c10420p191234807/i422318107.jpg?pictureSize=W800',
                      xlarge: 'http://cdn-beta.wallapop.com/images/10420/35/ut/__/c10420p191234807/i422318107.jpg?pictureSize=W1024',
                      medium: 'http://cdn-beta.wallapop.com/images/10420/35/ut/__/c10420p191234807/i422318107.jpg?pictureSize=W640',
                    },
                    average_hex_color: '5d7f96',
                    original_width: 0,
                    original_height: 0,
                  },
                ],
                webSlug: 'camiseta-de-camuflaje-191234807',
                deliveryInfo: { min_weight_kg: 2, max_weight_kg: 5 },
                itemType: 'consumer_goods',
                extraInfo: { object_type: { id: null, name: null }, size: { id: null }, condition: null },
                car_info: null,
                km: null,
                bumpFlags: null,
                hashtags: [],
                selected: false,
              });
            },
          },
        },
        {
          provide: PaymentsCreditCardService,
          useValue: {
            get() {
              return of({
                id: 'eb07a330-f1e6-4816-8e85-9246323fd614',
                brand: 'visa',
                lastFourDigits: '6596',
                ownerFullName: 'test',
                expirationDate: new Date('2025-08-01T00:00:00.000Z'),
                provider: 'mangopay',
              });
            },
          },
        },
        {
          provide: PaymentsPaymentMethodsService,
          useValue: {
            get paymentMethods() {
              return of([{ method: 1 }, { method: 0 }]);
            },
          },
        },
        {
          provide: PaymentsUserPaymentPreferencesService,
          useValue: {
            get paymentUserPreferences() {
              return of({
                defaults: { payment_method: null, use_wallet: true, wallet_blocked: false },
                preferences: {
                  defaults: { paymentMethod: null, useWallet: true, walletBlocked: false },
                  preferences: { id: '46211e5c-5d3c-4794-9f45-c10b5f117860', paymentMethod: 1, useWallet: false, walletBlocked: false },
                },
              });
            },
          },
        },
        {
          provide: PaymentsWalletsService,
          useValue: {
            get walletBalance$() {
              return of({ amount: { integer: 0, decimals: 0, total: 0 }, currency: { code: 'EUR', symbol: '€' } });
            },
          },
        },
        PayviewService,
      ],
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(PayviewService);
    buyerRequestsApiService = TestBed.inject(BuyerRequestsApiService);
    deliveryAddressService = TestBed.inject(DeliveryAddressService);
    deliveryBuyerService = TestBed.inject(DeliveryBuyerService);
    deliveryBuyerCalculatorService = TestBed.inject(DeliveryBuyerCalculatorService);
    deliveryCostsService = TestBed.inject(DeliveryCostsService);
    itemService = TestBed.inject(ItemService);
    paymentsCreditCardService = TestBed.inject(PaymentsCreditCardService);
    paymentsPaymentMethodsService = TestBed.inject(PaymentsPaymentMethodsService);
    paymentsUserPaymentPreferencesService = TestBed.inject(PaymentsUserPaymentPreferencesService);
    paymentsWalletsService = TestBed.inject(PaymentsWalletsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('WHEN asking for the item details', () => {
    const fakeItemHash: string = 'this_is_a_fake_item_hash';
    let payviewState: PayviewState;
    let paymentMethodsSpy;
    let paymentPreferencesSpy;
    let paymentWalletSpy;

    beforeEach(fakeAsync(() => {
      spyOn(buyerRequestsApiService, 'getRequestsItemsDetails').and.callThrough();
      spyOn(deliveryAddressService, 'get').and.callThrough();
      spyOn(deliveryBuyerService, 'getDeliveryMethods').and.callThrough();
      spyOn(deliveryBuyerCalculatorService, 'getCosts').and.callThrough();
      spyOn(deliveryCostsService, 'getCosts').and.callThrough();
      spyOn(itemService, 'get').and.callThrough();
      spyOn(paymentsCreditCardService, 'get').and.callThrough();
      paymentMethodsSpy = jest.spyOn(paymentsPaymentMethodsService, 'paymentMethods', 'get');
      paymentPreferencesSpy = jest.spyOn(paymentsUserPaymentPreferencesService, 'paymentUserPreferences', 'get');
      paymentWalletSpy = jest.spyOn(paymentsWalletsService, 'walletBalance$', 'get');

      service.getCurrentState(fakeItemHash).subscribe((response: PayviewState) => {
        payviewState = response;
      });

      tick();
    }));

    it('should call to the buyer request server to get the corresponding information', () => {
      expect(buyerRequestsApiService.getRequestsItemsDetails).toHaveBeenCalledTimes(1);
      expect(buyerRequestsApiService.getRequestsItemsDetails).toHaveBeenCalledWith(fakeItemHash);
    });

    it('should call to the address server to get the corresponding information', () => {
      expect(deliveryAddressService.get).toHaveBeenCalledTimes(1);
    });

    it('should call to the delivery buyer server to get the corresponding information', () => {
      expect(deliveryBuyerService.getDeliveryMethods).toHaveBeenCalledTimes(1);
      expect(deliveryBuyerService.getDeliveryMethods).toHaveBeenCalledWith(fakeItemHash);
    });

    it('should call to the calculator server to get the corresponding information', () => {
      const expectedAmount: Money = { amount: { decimals: 0, integer: 63, total: 63 }, currency: { code: 'EUR', symbol: '€' } };
      const expectedPromocode: string = null;
      const expectedDeliveryMode: DELIVERY_MODE = DELIVERY_MODE.BUYER_ADDRESS;

      expect(deliveryBuyerCalculatorService.getCosts).toHaveBeenCalledTimes(1);
      expect(deliveryBuyerCalculatorService.getCosts).toHaveBeenCalledWith(
        expectedAmount,
        fakeItemHash,
        expectedPromocode,
        expectedDeliveryMode
      );
    });

    it('should call to the item server to get the corresponding information', () => {
      expect(itemService.get).toHaveBeenCalledTimes(1);
      expect(itemService.get).toHaveBeenCalledWith(fakeItemHash);
    });

    it('should call to the credit card server to get the corresponding information', () => {
      expect(paymentsCreditCardService.get).toHaveBeenCalledTimes(1);
    });

    it('should call to the payment methods server to get the corresponding information', () => {
      expect(paymentMethodsSpy).toHaveBeenCalledTimes(1);
    });

    it('should call to the payment user preferences server to get the corresponding information', () => {
      expect(paymentPreferencesSpy).toHaveBeenCalledTimes(1);
    });

    it('should call to the wallet balance server to get the corresponding information', () => {
      expect(paymentWalletSpy).toHaveBeenCalledTimes(1);
    });
  });
});
