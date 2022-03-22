import { fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { BuyerRequestsApiService } from '@api/delivery/buyer/requests/buyer-requests-api.service';
import { DELIVERY_MODE } from '@api/core/model/delivery/delivery-mode.type';
import { DeliveryAddress } from '@api/core/model/delivery/address/delivery-address.interface';
import { DeliveryAddressService } from '@private/features/delivery/services/address/delivery-address/delivery-address.service';
import { DeliveryBuyerCalculatorCosts } from '@api/core/model/delivery/buyer/calculator/delivery-buyer-calculator-costs.interface';
import { DeliveryBuyerCalculatorService } from '@api/delivery/buyer/calculator/delivery-buyer-calculator.service';
import { DeliveryBuyerDeliveryMethod, DeliveryBuyerDeliveryMethods } from '@api/core/model/delivery/buyer/delivery-methods';
import { DeliveryBuyerService } from '@api/bff/delivery/buyer/delivery-buyer.service';
import { DeliveryCosts } from '@api/core/model/delivery/costs/delivery-costs.interface';
import { DeliveryCostsService } from '@api/bff/delivery/costs/delivery-costs.service';
import { ItemService } from '@core/item/item.service';
import { MOCK_BUYER_REQUESTS_ITEMS_DETAILS_2 } from '@api/fixtures/delivery/buyer/requests/buyer-requests-items-details-dto.fixtures.spec';
import { MOCK_CREDIT_CARD } from '@api/fixtures/payments/cards/credit-card.fixtures.spec';
import { MOCK_DELIVERY_ADDRESS, MOCK_DELIVERY_ADDRESS_API } from '@api/fixtures/delivery/address/delivery-address.fixtures.spec';
import { MOCK_DELIVERY_BUYER_CALCULATOR_COSTS } from '@api/fixtures/delivery/buyer/delivery-buyer-calculator-costs-dto.fixtures.spec';
import { MOCK_DELIVERY_BUYER_DELIVERY_METHODS } from '@api/fixtures/bff/delivery/buyer/delivery-buyer.fixtures.spec';
import { MOCK_DELIVERY_COSTS_ITEM } from '@api/fixtures/bff/delivery/costs/delivery-costs.fixtures.spec';
import { MOCK_PAYMENTS_PAYMENT_METHODS } from '@api/fixtures/payments/payment-methods/payments-payment-methods-dto.fixtures.spec';
import { MOCK_PAYMENTS_USER_PAYMENT_PREFERENCES } from '@api/fixtures/bff/payments/user-payment-preferences/payments-user-payment-preferences-dto.fixtures.spec';
import { MOCK_PAYMENTS_WALLET_MAPPED_WITHOUT_MONEY } from '@api/fixtures/payments/wallets/payments-wallets.fixtures.spec';
import { MOCK_PAYVIEW_ITEM } from '@fixtures/private/delivery/payview/payview-item.fixtures.spec';
import { MOCK_PAYVIEW_STATE } from '@fixtures/private/delivery/payview/payview-state.fixtures.spec';
import { Money } from '@api/core/model/money.interface';
import { PaymentMethod } from '@api/core/model/payments/enums/payment-method.enum';
import { PaymentsCreditCardService } from '@api/payments/cards';
import { PaymentService } from '@core/payments/payment.service';
import { PaymentsPaymentMethodsService } from '@api/payments/payment-methods/payments-payment-methods.service';
import { PaymentsUserPaymentPreferencesService } from '@api/bff/payments/user-payment-preferences/payments-user-payment-preferences.service';
import { PaymentsWalletsService } from '@api/payments/wallets/payments-wallets.service';
import { PayviewService } from '@private/features/payview/services/payview/payview.service';
import { PayviewState } from '@private/features/payview/interfaces/payview-state.interface';

import { delay } from 'rxjs/operators';
import { of, throwError } from 'rxjs';
import { CreditCard } from '@api/core/model';

describe('PayviewService', () => {
  const fakeItemHash: string = 'this_is_a_fake_item_hash';

  let service: PayviewService;
  let buyerRequestsApiService: BuyerRequestsApiService;
  let deliveryAddressService: DeliveryAddressService;
  let deliveryBuyerService: DeliveryBuyerService;
  let deliveryBuyerCalculatorService: DeliveryBuyerCalculatorService;
  let deliveryCostsService: DeliveryCostsService;
  let itemService: ItemService;
  let paymentService: PaymentService;
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
          provide: PaymentService,
          useValue: {
            updateUserPreferences() {
              return of(null);
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
    paymentService = TestBed.inject(PaymentService);
    paymentsCreditCardService = TestBed.inject(PaymentsCreditCardService);
    paymentsPaymentMethodsService = TestBed.inject(PaymentsPaymentMethodsService);
    paymentsUserPaymentPreferencesService = TestBed.inject(PaymentsUserPaymentPreferencesService);
    paymentsWalletsService = TestBed.inject(PaymentsWalletsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('WHEN asking for the item details', () => {
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
      const expected: PayviewState = { ...MOCK_PAYVIEW_STATE };
      expected.delivery.address = null;

      expect(payviewState).toMatchObject(expected);
    });
  });

  describe('WHEN the card service returns an error', () => {
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
      spyOn(paymentsCreditCardService, 'get').and.returnValue(throwError('The server is broken'));
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

    it('should get a valid payview state', fakeAsync(() => {
      const expected: PayviewState = { ...MOCK_PAYVIEW_STATE };
      expected.payment.card = null;

      expect(payviewState).toMatchObject(expected);
    }));
  });

  describe('WHEN retrieving the costs', () => {
    beforeEach(() => {
      spyOn(deliveryBuyerCalculatorService, 'getCosts').and.callThrough();
    });

    it('should call to the calculator server to get the corresponding information', fakeAsync(() => {
      const fakeAmount: Money = { amount: { decimals: 0, integer: 63, total: 63 }, currency: { code: 'EUR', symbol: '€' } };
      const fakeDeliveryMethod: DeliveryBuyerDeliveryMethod = MOCK_DELIVERY_BUYER_DELIVERY_METHODS.current;
      const fakeDeliveryMode: DELIVERY_MODE = fakeDeliveryMethod.method;
      const fakePromocode: string = 'this_is_a_fake_procode';
      let result: DeliveryBuyerCalculatorCosts;

      const subscription = service
        .getCosts(fakeItemHash, fakeAmount, fakePromocode, fakeDeliveryMethod)
        .pipe(delay(1))
        .subscribe((response: DeliveryBuyerCalculatorCosts) => {
          subscription.unsubscribe();
          result = response;
        });

      tick(1);

      expect(result).toBe(MOCK_DELIVERY_BUYER_CALCULATOR_COSTS);
      expect(deliveryBuyerCalculatorService.getCosts).toHaveBeenCalledTimes(1);
      expect(deliveryBuyerCalculatorService.getCosts).toHaveBeenCalledWith(fakeAmount, fakeItemHash, fakePromocode, fakeDeliveryMode);
    }));
  });

  describe('WHEN retrieving the address', () => {
    beforeEach(() => {
      spyOn(deliveryAddressService, 'get').and.callThrough();
    });

    it('should call to the delivery address server to get the corresponding information', fakeAsync(() => {
      let result: DeliveryAddress;

      const subscription = service.address.pipe(delay(1)).subscribe((response: DeliveryAddress) => {
        subscription.unsubscribe();
        result = response;
      });
      tick(1);

      expect(result).toEqual(MOCK_DELIVERY_ADDRESS);
      expect(deliveryAddressService.get).toHaveBeenCalledTimes(1);
      expect(deliveryAddressService.get).toHaveBeenCalledWith(false);
    }));
  });

  describe('WHEN retrieving the delivery costs', () => {
    beforeEach(() => {
      spyOn(deliveryCostsService, 'getCosts').and.callThrough();
    });

    it('should call to the delivery costs server to get the corresponding information', fakeAsync(() => {
      let result: DeliveryCosts;

      const subscription = service
        .getDeliveryCosts(fakeItemHash)
        .pipe(delay(1))
        .subscribe((response: DeliveryCosts) => {
          subscription.unsubscribe();
          result = response;
        });
      tick(1);

      expect(result).toEqual(MOCK_DELIVERY_COSTS_ITEM);
      expect(deliveryCostsService.getCosts).toHaveBeenCalledTimes(1);
      expect(deliveryCostsService.getCosts).toHaveBeenCalledWith(fakeItemHash);
    }));
  });

  describe('WHEN retrieving the delivery methods', () => {
    beforeEach(() => {
      spyOn(deliveryBuyerService, 'getDeliveryMethods').and.callThrough();
    });

    it('should call to the delivery methods server to get the corresponding information', fakeAsync(() => {
      let result: DeliveryBuyerDeliveryMethods;

      const subscription = service
        .getDeliveryMethods(fakeItemHash)
        .pipe(delay(1))
        .subscribe((response: DeliveryBuyerDeliveryMethods) => {
          subscription.unsubscribe();
          result = response;
        });
      tick(1);

      expect(result).toEqual(MOCK_DELIVERY_BUYER_DELIVERY_METHODS);
      expect(deliveryBuyerService.getDeliveryMethods).toHaveBeenCalledTimes(1);
      expect(deliveryBuyerService.getDeliveryMethods).toHaveBeenCalledWith(fakeItemHash);
    }));
  });

  describe('WHEN updating the user payment preferences', () => {
    beforeEach(() => {
      spyOn(paymentService, 'updateUserPreferences').and.callThrough();
    });

    it('should call to the payment server to update the corresponding preferences', fakeAsync(() => {
      const fakePaymentId: string = '0123-4567-8901';
      const fakePaymentMethod: PaymentMethod = PaymentMethod.CREDIT_CARD;
      let result: number = 0;

      const subscription = service
        .setUserPaymentPreferences(fakePaymentId, fakePaymentMethod, false)
        .pipe(delay(1))
        .subscribe(() => {
          subscription.unsubscribe();
          result++;
        });
      tick(1);

      expect(result).toEqual(1);
      expect(paymentService.updateUserPreferences).toHaveBeenCalledTimes(1);
      expect(paymentService.updateUserPreferences).toHaveBeenCalledWith(fakePaymentId, fakePaymentMethod, false);
    }));
  });

  describe('WHEN retrieving the card', () => {
    beforeEach(() => {
      spyOn(paymentsCreditCardService, 'get').and.callThrough();
    });

    it('should call to the server to get the corresponding information', fakeAsync(() => {
      const fakeCreditCard: CreditCard = MOCK_CREDIT_CARD;
      let result: CreditCard;

      const subscription = service.card.pipe(delay(1)).subscribe((response: CreditCard) => {
        subscription.unsubscribe();
        result = response;
      });

      tick(1);

      expect(result).toBe(MOCK_CREDIT_CARD);
      expect(paymentsCreditCardService.get).toHaveBeenCalledTimes(1);
    }));
  });
});
