import { fakeAsync, TestBed, tick } from '@angular/core/testing';

import { DeliveryBuyerCalculatorCosts } from '@api/core/model/delivery/buyer/calculator/delivery-buyer-calculator-costs.interface';
import { DeliveryBuyerCalculatorPromotionCost } from '@api/core/model/delivery/buyer/calculator/delivery-buyer-calculator-promotion-cost.interface';
import {
  DeliveryBuyerDefaultDeliveryMethod,
  DeliveryBuyerDeliveryMethod,
  DeliveryBuyerDeliveryMethods,
} from '@api/core/model/delivery/buyer/delivery-methods';
import { DeliveryCosts } from '@api/core/model/delivery/costs/delivery-costs.interface';
import {
  MOCK_DELIVERY_BUYER_CALCULATOR_COSTS,
  MOCK_DELIVERY_BUYER_CALCULATOR_COSTS_WITH_PROMOTION,
} from '@api/fixtures/delivery/buyer/delivery-buyer-calculator-costs-dto.fixtures.spec';
import { MOCK_DELIVERY_BUYER_DELIVERY_METHODS } from '@api/fixtures/bff/delivery/buyer/delivery-buyer.fixtures.spec';
import { MOCK_PAYMENTS_PAYMENT_METHODS } from '@api/fixtures/payments/payment-methods/payments-payment-methods-dto.fixtures.spec';
import { MOCK_PAYVIEW_STATE } from '@fixtures/private/delivery/payview/payview-state.fixtures.spec';
import { PaymentsPaymentMethod } from '@api/core/model/payments/interfaces/payments-payment-method.interface';
import { PAYVIEW_EVENT_TYPE } from '@private/features/payview/enums/payview-event-type.enum';
import { PayviewError } from '@private/features/payview/interfaces/payview-error.interface';
import { PayviewService } from '@private/features/payview/services/payview/payview.service';
import { PayviewState } from '@private/features/payview/interfaces/payview-state.interface';
import { PayviewStateManagementService } from '@private/features/payview/services/state-management/payview-state-management.service';

import { delay, mergeMap } from 'rxjs/operators';
import { Observable, of, throwError } from 'rxjs';
import { CreditCard } from '@api/core/model';
import { MOCK_CREDIT_CARD } from '@api/fixtures/payments/cards/credit-card.fixtures.spec';
import { PayviewTrackingEventsService } from '../payview-tracking-events/payview-tracking-events.service';

describe('PayviewStateManagementService', () => {
  const fakeItemHash: string = 'this_is_a_fake_item_hash';
  const mockUuid: string = '1234-abcd';
  const mockBuyerRequestId: string = 'abc-123';

  let service: PayviewStateManagementService;
  let payviewService: PayviewService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PayviewStateManagementService,
        {
          provide: PayviewService,
          useValue: {
            request() {
              return of(null);
            },
            get card() {
              return of(MOCK_CREDIT_CARD);
            },
            getCosts() {},
            getDeliveryCosts() {},
            getDeliveryMethods() {},
            getCurrentState(value: string): Observable<PayviewState> {
              return of(MOCK_PAYVIEW_STATE);
            },
            setUserPaymentPreferences() {},
          },
        },
        {
          provide: PayviewTrackingEventsService,
          useValue: {
            trackTransactionPaymentError() {},
          },
        },
      ],
    });
    payviewService = TestBed.inject(PayviewService);
    service = TestBed.inject(PayviewStateManagementService);
    service.buyerRequestId = mockUuid;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('WHEN the item is reported', () => {
    let getCurrentStateSpy;
    let itemHash: string;
    let payviewState: PayviewState;
    let result: number;

    beforeEach(fakeAsync(() => {
      getCurrentStateSpy = spyOn(payviewService, 'getCurrentState').and.returnValue(of(MOCK_PAYVIEW_STATE).pipe(delay(1)));
      service.payViewState$.subscribe((result: PayviewState) => {
        payviewState = result;
      });
      service.itemHash$.subscribe((result: string) => {
        itemHash = result;
      });
      const actionSubscription = service.on(PAYVIEW_EVENT_TYPE.SUCCESS_ON_GET_CURRENT_STATE, () => {
        actionSubscription.unsubscribe();
        result++;
      });
      result = 0;

      service.itemHash = fakeItemHash;
      tick(1);
    }));

    it('should request the payview state', fakeAsync(() => {
      expect(getCurrentStateSpy).toHaveBeenCalledTimes(1);
      expect(getCurrentStateSpy).toHaveBeenCalledWith(fakeItemHash, mockUuid);
    }));

    it('should update the payview state ', fakeAsync(() => {
      expect(payviewState).toStrictEqual(MOCK_PAYVIEW_STATE);
    }));

    it('should update the item hash ', fakeAsync(() => {
      expect(itemHash).toBe(fakeItemHash);
    }));

    it('should send a success message ', fakeAsync(() => {
      expect(result).toBe(1);
    }));

    describe('WHEN selecting the delivery method', () => {
      let costsSpy;
      const selectedIndex: number = 1;
      const selectedDefault: DeliveryBuyerDefaultDeliveryMethod = { index: selectedIndex };
      const selectedDeliveryMethod: DeliveryBuyerDeliveryMethod = {
        ...MOCK_DELIVERY_BUYER_DELIVERY_METHODS.deliveryMethods[selectedIndex],
      };

      beforeEach(fakeAsync(() => {
        const fakeCosts = { ...MOCK_PAYVIEW_STATE.costs };
        costsSpy = spyOn(payviewService, 'getCosts').and.returnValue(of(fakeCosts).pipe(delay(1)));

        service.setDeliveryMethod(selectedDeliveryMethod);

        tick(1);
      }));

      it('should call to payview service', fakeAsync(() => {
        payviewState.costs = null;

        expect(costsSpy).toHaveBeenCalledTimes(1);
        expect(costsSpy).toHaveBeenCalledWith(
          payviewState.itemDetails.itemHash,
          payviewState.itemDetails.price,
          undefined,
          selectedDeliveryMethod
        );
      }));

      it('should update the delivery method of the payview state', fakeAsync(() => {
        expect(payviewState.delivery.methods.current).toStrictEqual(selectedDeliveryMethod);
      }));

      it('should update the default delivery method of the payview state', fakeAsync(() => {
        expect(payviewState.delivery.methods.default).toStrictEqual(selectedDefault);
      }));
    });

    describe('WHEN retrieving the costs', () => {
      let costsSpy;
      let fakeCosts: DeliveryBuyerCalculatorCosts;

      beforeEach(fakeAsync(() => {
        fakeCosts = { ...MOCK_PAYVIEW_STATE.costs };
        const fakePromocode: Partial<DeliveryBuyerCalculatorPromotionCost> = { promocode: 'this_is_a_fake_promocode' };
        fakeCosts.promotion = fakePromocode as DeliveryBuyerCalculatorPromotionCost;
        costsSpy = spyOn(payviewService, 'getCosts').and.returnValue(of(fakeCosts).pipe(delay(1)));

        service.setDeliveryMethod(MOCK_DELIVERY_BUYER_DELIVERY_METHODS.deliveryMethods[1]);

        tick(1);
      }));

      it('should call to payview service', fakeAsync(() => {
        payviewState.costs = null;

        expect(costsSpy).toHaveBeenCalledTimes(1);
        expect(costsSpy).toHaveBeenCalledWith(
          payviewState.itemDetails.itemHash,
          payviewState.itemDetails.price,
          payviewState.costs?.promotion?.promocode,
          MOCK_DELIVERY_BUYER_DELIVERY_METHODS.deliveryMethods[1]
        );
      }));

      it('should update the payview state ', fakeAsync(() => {
        const expectedPayviewState = { ...MOCK_PAYVIEW_STATE };
        expectedPayviewState.costs = fakeCosts;

        expect(payviewState).toStrictEqual(expectedPayviewState);
      }));
    });

    describe('WHEN retrieving the costs without promotion', () => {
      let costsSpy;
      let fakeCosts: DeliveryBuyerCalculatorCosts;

      beforeEach(fakeAsync(() => {
        fakeCosts = { ...MOCK_PAYVIEW_STATE.costs };
        costsSpy = spyOn(payviewService, 'getCosts').and.returnValue(of(fakeCosts).pipe(delay(1)));

        service.setDeliveryMethod(MOCK_DELIVERY_BUYER_DELIVERY_METHODS.deliveryMethods[1]);

        tick(1);
      }));

      it('should call to payview service', fakeAsync(() => {
        expect(costsSpy).toHaveBeenCalledTimes(1);
        expect(costsSpy).toHaveBeenCalledWith(
          payviewState.itemDetails.itemHash,
          payviewState.itemDetails.price,
          undefined,
          MOCK_DELIVERY_BUYER_DELIVERY_METHODS.deliveryMethods[1]
        );
      }));

      it('should update the payview state ', fakeAsync(() => {
        const expectedPayviewState = { ...MOCK_PAYVIEW_STATE };
        expectedPayviewState.costs = fakeCosts;

        expect(payviewState).toStrictEqual(expectedPayviewState);
      }));
    });

    describe('WHEN retrieving the costs with promotion', () => {
      let costsSpy;
      let fakeCosts: DeliveryBuyerCalculatorCosts;
      const fakePromocode = 'This_is_a_fake_promocode';

      beforeEach(fakeAsync(() => {
        fakeCosts = { ...MOCK_DELIVERY_BUYER_CALCULATOR_COSTS_WITH_PROMOTION };
        fakeCosts.promotion.promocode = fakePromocode;
        payviewState.costs = fakeCosts;
        costsSpy = spyOn(payviewService, 'getCosts').and.returnValue(of(fakeCosts).pipe(delay(1)));

        service.setDeliveryMethod(MOCK_DELIVERY_BUYER_DELIVERY_METHODS.deliveryMethods[1]);

        tick(1);
      }));

      it('should call to payview service', fakeAsync(() => {
        payviewState.costs = null;

        expect(costsSpy).toHaveBeenCalledTimes(1);
        expect(costsSpy).toHaveBeenCalledWith(
          payviewState.itemDetails.itemHash,
          payviewState.itemDetails.price,
          fakePromocode,
          MOCK_DELIVERY_BUYER_DELIVERY_METHODS.deliveryMethods[1]
        );
      }));

      it('should update the payview state ', fakeAsync(() => {
        const expectedPayviewState = { ...MOCK_PAYVIEW_STATE };
        expectedPayviewState.costs = fakeCosts;

        expect(payviewState).toStrictEqual(expectedPayviewState);
      }));
    });

    describe('WHEN the promotion promocode does not exist', () => {
      let costsSpy;
      let fakeCosts: DeliveryBuyerCalculatorCosts;
      const fakePromocode = undefined;

      beforeEach(fakeAsync(() => {
        fakeCosts = { ...MOCK_DELIVERY_BUYER_CALCULATOR_COSTS_WITH_PROMOTION };
        fakeCosts.promotion.promocode = fakePromocode;
        payviewState.costs = fakeCosts;
        costsSpy = spyOn(payviewService, 'getCosts').and.returnValue(of(fakeCosts).pipe(delay(1)));

        service.setDeliveryMethod(MOCK_DELIVERY_BUYER_DELIVERY_METHODS.deliveryMethods[1]);

        tick(1);
      }));

      it('should call to payview service', fakeAsync(() => {
        payviewState.costs = null;

        expect(costsSpy).toHaveBeenCalledTimes(1);
        expect(costsSpy).toHaveBeenCalledWith(
          payviewState.itemDetails.itemHash,
          payviewState.itemDetails.price,
          undefined,
          MOCK_DELIVERY_BUYER_DELIVERY_METHODS.deliveryMethods[1]
        );
      }));

      it('should update the payview state ', fakeAsync(() => {
        const expectedPayviewState = { ...MOCK_PAYVIEW_STATE };
        expectedPayviewState.costs = fakeCosts;

        expect(payviewState).toStrictEqual(expectedPayviewState);
      }));
    });

    describe('WHEN there is an error when retrieving costs', () => {
      let payviewState: PayviewState;

      beforeEach(fakeAsync(() => {
        spyOn(payviewService, 'getCosts').and.returnValue(
          of(MOCK_DELIVERY_BUYER_CALCULATOR_COSTS).pipe(
            delay(1),
            mergeMap((e) => throwError('The server is broken'))
          )
        );
        service.payViewState$.subscribe((result: PayviewState) => {
          payviewState = result;
        });
        service.setDeliveryMethod(MOCK_DELIVERY_BUYER_DELIVERY_METHODS.deliveryMethods[0]);
        tick(1);
      }));

      it('should request the payview state', fakeAsync(() => {
        expect(payviewService.getCosts).toHaveBeenCalledTimes(1);
        expect(payviewService.getCosts).toHaveBeenCalledWith(
          MOCK_PAYVIEW_STATE.itemDetails.itemHash,
          MOCK_PAYVIEW_STATE.itemDetails.price,
          MOCK_PAYVIEW_STATE.costs.promotion?.promocode,
          MOCK_DELIVERY_BUYER_DELIVERY_METHODS.deliveryMethods[0]
        );
      }));

      it('should not update the payview state ', fakeAsync(() => {
        expect(payviewState).toEqual(MOCK_PAYVIEW_STATE);
      }));
    });

    describe('WHEN refreshing the payview state', () => {
      beforeEach(fakeAsync(() => {
        payviewState = null;
        getCurrentStateSpy.calls.reset();

        service.refreshPayviewState();

        tick(1);
      }));

      it('should call to payview service', fakeAsync(() => {
        expect(payviewService.getCurrentState).toHaveBeenCalledTimes(1);
        expect(payviewService.getCurrentState).toHaveBeenCalledWith(fakeItemHash, mockUuid);
      }));

      it('should update the payview state ', fakeAsync(() => {
        const expectedPayviewState = { ...MOCK_PAYVIEW_STATE };

        expect(payviewState).toStrictEqual(expectedPayviewState);
      }));
    });

    describe('WHEN refreshing by delivery', () => {
      let fakeCosts: DeliveryBuyerCalculatorCosts;
      let fakeDeliveryCosts: DeliveryCosts;
      let fakeDeliveryMethods: DeliveryBuyerDeliveryMethods;
      let fakePayviewState: PayviewState;

      beforeEach(fakeAsync(() => {
        fakeCosts = { ...MOCK_PAYVIEW_STATE.costs };
        fakeDeliveryCosts = { ...MOCK_PAYVIEW_STATE.delivery.costs };
        fakeDeliveryMethods = { ...MOCK_DELIVERY_BUYER_DELIVERY_METHODS };
        fakePayviewState = { ...MOCK_PAYVIEW_STATE };
        fakePayviewState.delivery.methods.current = fakeDeliveryMethods.deliveryMethods[1];
        payviewState = null;

        spyOn(payviewService, 'getCosts').and.returnValue(of(fakeCosts).pipe(delay(1)));
        spyOn(payviewService, 'getDeliveryCosts').and.returnValue(of(fakeDeliveryCosts).pipe(delay(1)));
        spyOn(payviewService, 'getDeliveryMethods').and.returnValue(of(fakeDeliveryMethods).pipe(delay(1)));

        service.refreshByDelivery();

        tick(1);
      }));

      it('should call to payview service in order to refresh costs', fakeAsync(() => {
        expect(payviewService.getCosts).toHaveBeenCalledTimes(1);
        expect(payviewService.getCosts).toHaveBeenCalledWith(
          fakePayviewState.itemDetails.itemHash,
          fakePayviewState.itemDetails.price,
          fakePayviewState.costs.promotion?.promocode,
          fakePayviewState.delivery.methods.deliveryMethods[1]
        );
      }));

      it('should call to payview service in order to refresh the delivery costs', fakeAsync(() => {
        expect(payviewService.getDeliveryCosts).toHaveBeenCalledTimes(1);
        expect(payviewService.getDeliveryCosts).toHaveBeenCalledWith(fakePayviewState.itemDetails.itemHash);
      }));

      it('should call to payview service in order to refresh the delivery methods', fakeAsync(() => {
        expect(payviewService.getDeliveryMethods).toHaveBeenCalledTimes(1);
        expect(payviewService.getDeliveryMethods).toHaveBeenCalledWith(fakePayviewState.itemDetails.itemHash);
      }));

      it('should update the payview state ', fakeAsync(() => {
        const expectedPayviewState = { ...MOCK_PAYVIEW_STATE };

        expect(payviewState).toStrictEqual(expectedPayviewState);
      }));
    });

    describe('WHEN refreshing by credit card', () => {
      let fakeCreditCard: CreditCard;
      let creditCardSpy: jest.SpyInstance;

      beforeEach(fakeAsync(() => {
        fakeCreditCard = { ...MOCK_CREDIT_CARD };
        payviewState = null;

        creditCardSpy = jest.spyOn(payviewService, 'card', 'get').mockReturnValue(of(fakeCreditCard).pipe(delay(1)));

        service.refreshByCreditCard();

        tick(1);
      }));

      it('should call to payview service in order to refresh the credit card information', fakeAsync(() => {
        expect(creditCardSpy).toHaveBeenCalledTimes(1);
      }));

      it('should update the payview state ', fakeAsync(() => {
        const expectedPayviewState = { ...MOCK_PAYVIEW_STATE };

        expect(payviewState).toStrictEqual(expectedPayviewState);
      }));
    });

    describe('WHEN there is an error refreshing the credit card', () => {
      const fakeCreditCard: CreditCard = { ...MOCK_CREDIT_CARD };
      const fakeError: Error = new Error('The server is broken');
      const fakePayviewState: PayviewState = { ...MOCK_PAYVIEW_STATE };
      let creditCardSpy: jest.SpyInstance;
      let result: PayviewError;

      beforeEach(fakeAsync(() => {
        payviewState = null;
        const subscription = service.on(PAYVIEW_EVENT_TYPE.ERROR_ON_REFRESH_CREDIT_CARD, (payload: PayviewError) => {
          subscription.unsubscribe();
          result = payload;
        });
        creditCardSpy = jest.spyOn(payviewService, 'card', 'get').mockReturnValue(
          of(fakeCreditCard).pipe(
            delay(1),
            mergeMap((e) => throwError(fakeError))
          )
        );

        service.refreshByCreditCard();
        tick(1);
      }));

      it('should call to payview service in order to refresh the credit card information', fakeAsync(() => {
        expect(creditCardSpy).toHaveBeenCalledTimes(1);
      }));

      it('should send a error event', fakeAsync(() => {
        const expected: PayviewError = { code: null, message: fakeError.message };

        expect(result).toEqual(expected);
      }));
    });

    describe('WHEN there is an error retrieving delivery costs', () => {
      const fakeError: Error = new Error('The server is broken');

      let fakeCosts: DeliveryCosts;
      let fakePayviewState: PayviewState;
      let result: PayviewError;

      beforeEach(fakeAsync(() => {
        fakeCosts = { ...MOCK_PAYVIEW_STATE.delivery.costs };
        fakePayviewState = { ...MOCK_PAYVIEW_STATE };
        payviewState = null;
        const subscription = service.on(PAYVIEW_EVENT_TYPE.ERROR_ON_REFRESH_DELIVERY_COSTS, (payload: PayviewError) => {
          subscription.unsubscribe();
          result = payload;
        });
        spyOn(payviewService, 'getCosts').and.returnValue(of(MOCK_PAYVIEW_STATE.costs).pipe(delay(1)));
        spyOn(payviewService, 'getDeliveryMethods').and.returnValue(of(MOCK_PAYVIEW_STATE.delivery.methods).pipe(delay(1)));
        spyOn(payviewService, 'getDeliveryCosts').and.returnValue(
          of(fakeCosts).pipe(
            delay(1),
            mergeMap((e) => throwError(fakeError))
          )
        );

        service.refreshByDelivery();
        tick(1);
      }));

      it('should call to payview service in order to refresh delivery costs', fakeAsync(() => {
        expect(payviewService.getDeliveryCosts).toHaveBeenCalledTimes(1);
        expect(payviewService.getDeliveryCosts).toHaveBeenCalledWith(fakePayviewState.itemDetails.itemHash);
      }));

      it('should send a error event', fakeAsync(() => {
        const expected: PayviewError = { code: null, message: fakeError.message };

        expect(result).toEqual(expected);
      }));
    });

    describe('WHEN there is an error retrieving delivery method', () => {
      const fakeError: Error = new Error('The server is broken');

      let fakeMethods: DeliveryBuyerDeliveryMethods;
      let fakePayviewState: PayviewState;
      let result: PayviewError;

      beforeEach(fakeAsync(() => {
        fakeMethods = { ...MOCK_PAYVIEW_STATE.delivery.methods };
        fakePayviewState = { ...MOCK_PAYVIEW_STATE };
        payviewState = null;
        const subscription = service.on(PAYVIEW_EVENT_TYPE.ERROR_ON_REFRESH_DELIVERY_METHODS, (payload: PayviewError) => {
          subscription.unsubscribe();
          result = payload;
        });
        spyOn(payviewService, 'getDeliveryCosts').and.returnValue(of(MOCK_PAYVIEW_STATE.delivery.costs).pipe(delay(1)));
        spyOn(payviewService, 'getCosts').and.returnValue(of(MOCK_PAYVIEW_STATE.costs).pipe(delay(1)));
        spyOn(payviewService, 'getDeliveryMethods').and.returnValue(
          of(fakeMethods).pipe(
            delay(1),
            mergeMap((e) => throwError(fakeError))
          )
        );

        service.refreshByDelivery();
        tick(1);
      }));

      it('should call to payview service in order to refresh delivery methods', fakeAsync(() => {
        expect(payviewService.getDeliveryMethods).toHaveBeenCalledTimes(1);
        expect(payviewService.getDeliveryMethods).toHaveBeenCalledWith(fakePayviewState.itemDetails.itemHash);
      }));

      it('should send a error event', fakeAsync(() => {
        const expected: PayviewError = { code: null, message: fakeError.message };

        expect(result).toEqual(expected);
      }));
    });

    describe('WHEN apply a promocode', () => {
      const fakePromocode: string = 'This_is_a_fake_promocode';
      let fakeCosts: DeliveryBuyerCalculatorCosts;
      let fakePayviewState: PayviewState;
      let result: number = 0;

      beforeEach(fakeAsync(() => {
        result = 0;
        fakeCosts = { ...MOCK_PAYVIEW_STATE.costs };
        fakePayviewState = { ...MOCK_PAYVIEW_STATE };
        payviewState = null;
        const subscription = service.on(PAYVIEW_EVENT_TYPE.SUCCESS_ON_REFRESH_COSTS, () => {
          subscription.unsubscribe();
          result++;
        });
        spyOn(payviewService, 'getCosts').and.returnValue(of(fakeCosts).pipe(delay(1)));

        service.applyPromocode(fakePromocode);

        tick(1);
      }));

      it('should call to payview service in order to refresh costs', fakeAsync(() => {
        expect(payviewService.getCosts).toHaveBeenCalledTimes(1);
        expect(payviewService.getCosts).toHaveBeenCalledWith(
          fakePayviewState.itemDetails.itemHash,
          fakePayviewState.itemDetails.price,
          fakePromocode,
          fakePayviewState.delivery.methods.deliveryMethods[1]
        );
      }));

      it('should update the payview state ', fakeAsync(() => {
        const expectedPayviewState = { ...MOCK_PAYVIEW_STATE };

        expect(payviewState).toStrictEqual(expectedPayviewState);
      }));

      it('should send a success event', fakeAsync(() => {
        expect(result).toBe(1);
      }));
    });

    describe('WHEN there is an error applying a promocode', () => {
      const fakeError: Error = new Error('The server is broken');
      const fakePromocode: string = 'This_is_a_fake_promocode';

      let fakeCosts: DeliveryBuyerCalculatorCosts;
      let fakePayviewState: PayviewState;
      let result: PayviewError;

      beforeEach(fakeAsync(() => {
        fakeCosts = { ...MOCK_PAYVIEW_STATE.costs };
        fakePayviewState = { ...MOCK_PAYVIEW_STATE };
        payviewState = null;
        const subscription = service.on(PAYVIEW_EVENT_TYPE.ERROR_ON_REFRESH_COSTS, (payload: PayviewError) => {
          subscription.unsubscribe();
          result = payload;
        });
        spyOn(payviewService, 'getCosts').and.returnValue(
          of(fakeCosts).pipe(
            delay(1),
            mergeMap((e) => throwError(fakeError))
          )
        );

        service.applyPromocode(fakePromocode);
        tick(1);
      }));

      it('should call to payview service in order to refresh costs', fakeAsync(() => {
        expect(payviewService.getCosts).toHaveBeenCalledTimes(1);
        expect(payviewService.getCosts).toHaveBeenCalledWith(
          fakePayviewState.itemDetails.itemHash,
          fakePayviewState.itemDetails.price,
          fakePromocode,
          fakePayviewState.delivery.methods.deliveryMethods[1]
        );
      }));

      it('should not update the payview state ', fakeAsync(() => {
        expect(payviewState).toBeFalsy();
      }));

      it('should send a success event', fakeAsync(() => {
        const expected: PayviewError = { code: null, message: fakeError.message };

        expect(result).toEqual(expected);
      }));
    });

    describe('WHEN remove a promocode', () => {
      let fakeCosts: DeliveryBuyerCalculatorCosts;
      let fakePayviewState: PayviewState;
      let result: number = 0;

      beforeEach(fakeAsync(() => {
        result = 0;
        fakeCosts = { ...MOCK_PAYVIEW_STATE.costs };
        fakePayviewState = { ...MOCK_PAYVIEW_STATE };
        payviewState = null;
        const subscription = service.on(PAYVIEW_EVENT_TYPE.SUCCESS_ON_REFRESH_COSTS, () => {
          subscription.unsubscribe();
          result++;
        });
        spyOn(payviewService, 'getCosts').and.returnValue(of(fakeCosts).pipe(delay(1)));

        service.removePromocode();

        tick(1);
      }));

      it('should call to payview service in order to refresh costs', fakeAsync(() => {
        expect(payviewService.getCosts).toHaveBeenCalledTimes(1);
        expect(payviewService.getCosts).toHaveBeenCalledWith(
          fakePayviewState.itemDetails.itemHash,
          fakePayviewState.itemDetails.price,
          undefined,
          fakePayviewState.delivery.methods.deliveryMethods[1]
        );
      }));

      it('should update the payview state ', fakeAsync(() => {
        const expectedPayviewState = { ...MOCK_PAYVIEW_STATE };

        expect(payviewState).toStrictEqual(expectedPayviewState);
      }));

      it('should send a success event', fakeAsync(() => {
        expect(result).toBe(1);
      }));
    });

    describe('WHEN there is an error removing a promocode', () => {
      const fakeError: Error = new Error('The server is broken');
      let fakeCosts: DeliveryBuyerCalculatorCosts;

      let fakePayviewState: PayviewState;
      let result: PayviewError;

      beforeEach(fakeAsync(() => {
        fakeCosts = { ...MOCK_PAYVIEW_STATE.costs };
        fakePayviewState = { ...MOCK_PAYVIEW_STATE };
        payviewState = null;
        const subscription = service.on(PAYVIEW_EVENT_TYPE.ERROR_ON_REFRESH_COSTS, (payload: PayviewError) => {
          subscription.unsubscribe();
          result = payload;
        });
        spyOn(payviewService, 'getCosts').and.returnValue(
          of(fakeCosts).pipe(
            delay(1),
            mergeMap((e) => throwError(fakeError))
          )
        );

        service.removePromocode();

        tick(1);
      }));

      it('should call to payview service in order to refresh costs', fakeAsync(() => {
        expect(payviewService.getCosts).toHaveBeenCalledTimes(1);
        expect(payviewService.getCosts).toHaveBeenCalledWith(
          fakePayviewState.itemDetails.itemHash,
          fakePayviewState.itemDetails.price,
          undefined,
          fakePayviewState.delivery.methods.deliveryMethods[1]
        );
      }));

      it('should not update the payview state ', fakeAsync(() => {
        expect(payviewState).toBeFalsy();
      }));

      it('should send a success event', fakeAsync(() => {
        const expected: PayviewError = { code: null, message: fakeError.message };

        expect(result).toEqual(expected);
      }));
    });

    describe('WHEN selecting the payment method', () => {
      const fakeCosts: DeliveryBuyerCalculatorCosts = { ...MOCK_PAYVIEW_STATE.costs };
      const selectedPaymentMethod: PaymentsPaymentMethod = {
        ...MOCK_PAYMENTS_PAYMENT_METHODS.paymentMethods[0],
      };
      let userPreferencesSpy;

      beforeEach(fakeAsync(() => {
        userPreferencesSpy = spyOn(payviewService, 'setUserPaymentPreferences').and.returnValue(of(null).pipe(delay(1)));
        spyOn(payviewService, 'getCosts').and.returnValue(of(fakeCosts).pipe(delay(1)));

        service.setPaymentMethod(selectedPaymentMethod);

        tick(1);
      }));

      it('should call to payview service in order to save the payment method', fakeAsync(() => {
        expect(userPreferencesSpy).toHaveBeenCalledTimes(1);
        expect(userPreferencesSpy).toHaveBeenCalledWith(payviewState.payment.preferences);
      }));

      it('should call to payview service in order to refresh costs', fakeAsync(() => {
        expect(payviewService.getCosts).toHaveBeenCalledTimes(1);
        expect(payviewService.getCosts).toHaveBeenCalledWith(
          payviewState.itemDetails.itemHash,
          payviewState.itemDetails.price,
          undefined,
          payviewState.delivery.methods.deliveryMethods[1]
        );
      }));

      it('should update the payment method of the payview state', fakeAsync(() => {
        expect(payviewState.payment.preferences.preferences.paymentMethod).toStrictEqual(selectedPaymentMethod.method);
      }));
    });

    describe('WHEN there is an error setting the payment method', () => {
      const fakeCosts: DeliveryBuyerCalculatorCosts = { ...MOCK_PAYVIEW_STATE.costs };
      const fakeError: Error = new Error('The server is broken');
      const fakePaymentMethod: PaymentsPaymentMethod = MOCK_PAYMENTS_PAYMENT_METHODS.paymentMethods[1];

      let fakePayviewState: PayviewState;
      let result: PayviewError;

      beforeEach(fakeAsync(() => {
        payviewState = null;
        const subscription = service.on(PAYVIEW_EVENT_TYPE.ERROR_ON_SET_PAYMENT_METHOD, (payload: PayviewError) => {
          subscription.unsubscribe();
          result = payload;
        });
        spyOn(payviewService, 'getCosts').and.returnValue(of(fakeCosts).pipe(delay(1)));
        spyOn(payviewService, 'setUserPaymentPreferences').and.returnValue(
          of(fakePaymentMethod).pipe(
            delay(1),
            mergeMap((e) => throwError(fakeError))
          )
        );

        service.setPaymentMethod(fakePaymentMethod);
        tick(1);
      }));

      it('should call to payview service in order to set the payment method', fakeAsync(() => {
        expect(payviewService.setUserPaymentPreferences).toHaveBeenCalledTimes(1);
        expect(payviewService.setUserPaymentPreferences).toHaveBeenCalledWith(payviewState.payment.preferences);
      }));

      it('should send a error event', fakeAsync(() => {
        const expected: PayviewError = { code: null, message: fakeError.message };

        expect(result).toEqual(expected);
      }));
    });
  });

  describe('WHEN the item is not reported', () => {
    let itemHash: string;
    let payviewState: PayviewState;

    beforeEach(fakeAsync(() => {
      spyOn(payviewService, 'getCurrentState').and.callThrough();
      service.payViewState$.subscribe((result: PayviewState) => {
        payviewState = result;
      });
      service.itemHash$.subscribe((result: string) => {
        itemHash = result;
      });

      service.itemHash = null;
      tick();
    }));

    it('should not request the payview state', fakeAsync(() => {
      expect(payviewService.getCurrentState).not.toHaveBeenCalled;
    }));

    it('should not update the payview state ', fakeAsync(() => {
      expect(payviewState).toBeFalsy();
    }));

    it('should update the item hash', fakeAsync(() => {
      expect(itemHash).toBeFalsy();
    }));
  });

  describe('WHEN there is an error refreshing the current state', () => {
    let itemHash: string;
    let payviewState: PayviewState;

    beforeEach(fakeAsync(() => {
      spyOn(payviewService, 'getCurrentState').and.returnValue(
        of(MOCK_PAYVIEW_STATE).pipe(
          delay(1),
          mergeMap((e) => throwError('The server is broken'))
        )
      );
      service.payViewState$.subscribe((result: PayviewState) => {
        payviewState = result;
      });
      service.itemHash$.subscribe((result: string) => {
        itemHash = result;
      });

      service.itemHash = fakeItemHash;
      tick(1);
    }));

    it('should request the payview state', fakeAsync(() => {
      expect(payviewService.getCurrentState).toHaveBeenCalledTimes(1);
      expect(payviewService.getCurrentState).toHaveBeenCalledWith(fakeItemHash, mockUuid);
    }));

    it('should not update the payview state ', fakeAsync(() => {
      expect(payviewState).toBeFalsy();
    }));

    it('should update the item hash', fakeAsync(() => {
      expect(itemHash).toBeTruthy();
    }));
  });

  describe('WHEN defining buyer request id', () => {
    let payviewState: PayviewState;

    beforeEach(() => {
      service.payViewState$.subscribe((newState: PayviewState) => {
        payviewState = newState;
      });

      service.buyerRequestId = mockBuyerRequestId;
    });

    it('should update the state subject', () => {
      expect(payviewState).toStrictEqual({
        buyerRequestId: mockBuyerRequestId,
      });
    });
  });

  describe('when buying a product', () => {
    beforeEach(() => {
      spyOn(service['actionSubject'], 'next').and.callThrough();
    });

    describe('and the request succeed', () => {
      beforeEach(() => {
        spyOn(payviewService, 'request').and.returnValue(of(null));

        service.buy();
      });

      it('should request to do the payment', () => {
        expect(payviewService.request).toHaveBeenCalledTimes(1);
      });

      it('should notify payment success', () => {
        expect(service['actionSubject'].next).toHaveBeenCalledTimes(1);
        expect(service['actionSubject'].next).toHaveBeenCalledWith({
          type: PAYVIEW_EVENT_TYPE.SUCCESS_ON_BUY,
          payload: null,
        });
      });
    });

    describe('and the request failed', () => {
      const MOCK_ERROR = {
        name: 'this is an error name',
        message: 'this is a message',
      };
      beforeEach(() => {
        spyOn(payviewService, 'request').and.returnValue(throwError([MOCK_ERROR]));

        service.buy();
      });

      it('should request to do the payment', () => {
        expect(service['actionSubject'].next).toHaveBeenCalledTimes(1);
        expect(service['actionSubject'].next).toHaveBeenCalledWith({
          type: PAYVIEW_EVENT_TYPE.ERROR_ON_BUY,
          payload: {
            code: MOCK_ERROR.name,
            message: MOCK_ERROR.message,
          },
        });
      });

      it('should trigger a error on buy action', () => {
        expect(payviewService.request).toHaveBeenCalledTimes(1);
      });
    });
  });
});
