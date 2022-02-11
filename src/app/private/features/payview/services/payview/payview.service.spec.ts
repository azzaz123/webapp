import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { BuyerRequestsApiService } from '@api/delivery/buyer/requests/buyer-requests-api.service';
import { DELIVERY_MODE } from '@api/core/model/delivery/delivery-mode.type';
import { DeliveryAddressService } from '@private/features/delivery/services/address/delivery-address/delivery-address.service';
import { DeliveryBuyerCalculatorService } from '@api/delivery/buyer/calculator/delivery-buyer-calculator.service';
import { DeliveryBuyerService } from '@api/bff/delivery/buyer/delivery-buyer.service';
import { DeliveryCostsService } from '@api/bff/delivery/costs/delivery-costs.service';
import { ItemService } from '@core/item/item.service';
import { MOCK_BUYER_REQUESTS_ITEMS_DETAILS_2 } from '@api/fixtures/delivery/buyer/requests/buyer-requests-items-details-dto.fixtures.spec';
import { MOCK_CREDIT_CARD } from '@api/fixtures/payments/cards/credit-card.fixtures.spec';
import { MOCK_DELIVERY_ADDRESS_API } from '@api/fixtures/delivery/address/delivery-address.fixtures.spec';
import { MOCK_DELIVERY_BUYER_CALCULATOR_COSTS } from '@api/fixtures/delivery/buyer/delivery-buyer-calculator-costs-dto.fixtures.spec';
import { MOCK_DELIVERY_BUYER_DELIVERY_METHODS } from '@api/fixtures/bff/delivery/buyer/delivery-buyer.fixtures.spec';
import { MOCK_DELIVERY_COSTS_ITEM } from '@api/fixtures/bff/delivery/costs/delivery-costs.fixtures.spec';
import { MOCK_PAYMENTS_PAYMENT_METHODS } from '@api/fixtures/payments/payment-methods/payments-payment-methods-dto.fixtures.spec';
import { MOCK_PAYMENTS_USER_PAYMENT_PREFERENCES } from '@api/fixtures/bff/payments/user-payment-preferences/payments-user-payment-preferences-dto.fixtures.spec';
import { MOCK_PAYMENTS_WALLET_MAPPED_WITHOUT_MONEY } from '@api/fixtures/payments/wallets/payments-wallets.fixtures.spec';
import { MOCK_PAYVIEW_ITEM } from '@fixtures/private/delivery/payview/payview-item.fixtures.spec';
import { MOCK_PAYVIEW_STATE } from '@fixtures/private/delivery/payview/payview-state.fixtures.spec';
import { Money } from '@api/core/model/money.interface';
import { PaymentsCreditCardService } from '@api/payments/cards';
import { PaymentsPaymentMethodsService } from '@api/payments/payment-methods/payments-payment-methods.service';
import { PaymentsUserPaymentPreferencesService } from '@api/bff/payments/user-payment-preferences/payments-user-payment-preferences.service';
import { PaymentsWalletsService } from '@api/payments/wallets/payments-wallets.service';
import { PayviewService } from '@private/features/payview/services/payview/payview.service';
import { PayviewState } from '@private/features/payview/interfaces/payview-state.interface';

import { of, throwError } from 'rxjs';

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
              return of(MOCK_BUYER_REQUESTS_ITEMS_DETAILS_2);
            },
          },
        },
        {
          provide: DeliveryAddressService,
          useValue: {
            get() {
              return of(MOCK_DELIVERY_ADDRESS_API);
            },
          },
        },
        {
          provide: DeliveryBuyerService,
          useValue: {
            getDeliveryMethods() {
              return of(MOCK_DELIVERY_BUYER_DELIVERY_METHODS);
            },
          },
        },
        {
          provide: DeliveryBuyerCalculatorService,
          useValue: {
            getCosts() {
              return of(MOCK_DELIVERY_BUYER_CALCULATOR_COSTS);
            },
          },
        },
        {
          provide: DeliveryCostsService,
          useValue: {
            getCosts() {
              return of(MOCK_DELIVERY_COSTS_ITEM);
            },
          },
        },
        {
          provide: ItemService,
          useValue: {
            get() {
              return of(MOCK_PAYVIEW_ITEM);
            },
          },
        },
        {
          provide: PaymentsCreditCardService,
          useValue: {
            get() {
              return of(MOCK_CREDIT_CARD);
            },
          },
        },
        {
          provide: PaymentsPaymentMethodsService,
          useValue: {
            get paymentMethods() {
              return of(MOCK_PAYMENTS_PAYMENT_METHODS);
            },
          },
        },
        {
          provide: PaymentsUserPaymentPreferencesService,
          useValue: {
            get paymentUserPreferences() {
              return of(MOCK_PAYMENTS_USER_PAYMENT_PREFERENCES);
            },
          },
        },
        {
          provide: PaymentsWalletsService,
          useValue: {
            get walletBalance$() {
              return of(MOCK_PAYMENTS_WALLET_MAPPED_WITHOUT_MONEY);
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

    it('should get a valid payview state', () => {
      expect(payviewState).toMatchObject(MOCK_PAYVIEW_STATE);
    });
  });

  describe('WHEN the address service returns an error', () => {
    const fakeItemHash: string = 'this_is_a_fake_item_hash';
    let payviewState: PayviewState;
    let paymentMethodsSpy;
    let paymentPreferencesSpy;
    let paymentWalletSpy;

    beforeEach(fakeAsync(() => {
      spyOn(buyerRequestsApiService, 'getRequestsItemsDetails').and.callThrough();
      spyOn(deliveryAddressService, 'get').and.returnValue(throwError('The server is broken'));
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

    it('should get a valid payview state', () => {
      const expected: PayviewState = MOCK_PAYVIEW_STATE;
      expected.delivery.address = null;

      expect(payviewState).toMatchObject(expected);
    });
  });
});