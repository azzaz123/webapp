import { fakeAsync, TestBed, tick } from '@angular/core/testing';

import { DeliveryBuyerCalculatorCosts } from '@api/core/model/delivery/buyer/calculator/delivery-buyer-calculator-costs.interface';
import { DeliveryBuyerCalculatorPromotionCost } from '@api/core/model/delivery/buyer/calculator/delivery-buyer-calculator-promotion-cost.interface';
import { DeliveryBuyerDeliveryMethods } from '@api/core/model/delivery/buyer/delivery-methods';
import { DeliveryCosts } from '@api/core/model/delivery/costs/delivery-costs.interface';
import { MOCK_DELIVERY_BUYER_CALCULATOR_COSTS } from '@api/fixtures/delivery/buyer/delivery-buyer-calculator-costs-dto.fixtures.spec';
import { MOCK_DELIVERY_BUYER_DELIVERY_METHODS } from '@api/fixtures/bff/delivery/buyer/delivery-buyer.fixtures.spec';
import { MOCK_PAYVIEW_STATE } from '@fixtures/private/delivery/payview/payview-state.fixtures.spec';
import { PayviewService } from '@private/features/payview/services/payview/payview.service';
import { PayviewState } from '@private/features/payview/interfaces/payview-state.interface';
import { PayviewStateManagementService } from '@private/features/payview/services/state-management/payview-state-management.service';

import { delay, mergeMap } from 'rxjs/operators';
import { Observable, of, throwError } from 'rxjs';

describe('PayviewStateManagementService', () => {
  const fakeItemHash: string = 'this_is_a_fake_item_hash';
  let service: PayviewStateManagementService;
  let payviewService: PayviewService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PayviewStateManagementService,
        {
          provide: PayviewService,
          useValue: {
            getCosts() {},
            getDeliveryCosts() {},
            getDeliveryMethods() {},
            getCurrentState(value: string): Observable<PayviewState> {
              return of(MOCK_PAYVIEW_STATE);
            },
          },
        },
      ],
    });
    payviewService = TestBed.inject(PayviewService);
    service = TestBed.inject(PayviewStateManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('WHEN the item is reported', () => {
    let getCurrentStateSpy;
    let itemHash: string;
    let payviewState: PayviewState;

    beforeEach(fakeAsync(() => {
      getCurrentStateSpy = spyOn(payviewService, 'getCurrentState').and.returnValue(of(MOCK_PAYVIEW_STATE).pipe(delay(0)));
      service.payViewState$.subscribe((result: PayviewState) => {
        payviewState = result;
      });
      service.itemHash$.subscribe((result: string) => {
        itemHash = result;
      });

      service.itemHash = fakeItemHash;
      tick(0);
    }));

    it('should request the payview state', fakeAsync(() => {
      expect(getCurrentStateSpy).toHaveBeenCalledTimes(1);
      expect(getCurrentStateSpy).toHaveBeenCalledWith(fakeItemHash);
    }));

    it('should update the payview state ', fakeAsync(() => {
      expect(payviewState).toStrictEqual(MOCK_PAYVIEW_STATE);
    }));

    it('should update the item hash ', fakeAsync(() => {
      expect(itemHash).toBe(fakeItemHash);
    }));

    describe('WHEN retrieving the delivery costs', () => {
      let costsSpy;
      let fakeCosts: DeliveryBuyerCalculatorCosts;

      beforeEach(fakeAsync(() => {
        fakeCosts = { ...MOCK_PAYVIEW_STATE.costs };
        const fakePromocode: Partial<DeliveryBuyerCalculatorPromotionCost> = { promocode: 'this_is_a_fake_promocode' };
        fakeCosts.promotion = fakePromocode as DeliveryBuyerCalculatorPromotionCost;

        costsSpy = spyOn(payviewService, 'getCosts').and.returnValue(of(fakeCosts).pipe(delay(0)));
        service.setDeliveryMethod(MOCK_DELIVERY_BUYER_DELIVERY_METHODS[1]);
        tick(0);
      }));

      it('should call to payview service', fakeAsync(() => {
        payviewState.costs = null;

        expect(costsSpy).toHaveBeenCalledTimes(1);
        expect(costsSpy).toHaveBeenCalledWith(
          payviewState.itemDetails.itemHash,
          payviewState.itemDetails.price,
          payviewState.costs?.promotion?.promocode,
          MOCK_DELIVERY_BUYER_DELIVERY_METHODS[1]
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
            delay(0),
            mergeMap((e) => throwError('The server is broken'))
          )
        );
        service.payViewState$.subscribe((result: PayviewState) => {
          payviewState = result;
        });
        service.setDeliveryMethod(MOCK_DELIVERY_BUYER_DELIVERY_METHODS[0]);
        tick(0);
      }));

      it('should request the payview state', fakeAsync(() => {
        expect(payviewService.getCosts).toHaveBeenCalledTimes(1);
        expect(payviewService.getCosts).toHaveBeenCalledWith(
          MOCK_PAYVIEW_STATE.itemDetails.itemHash,
          MOCK_PAYVIEW_STATE.itemDetails.price,
          MOCK_PAYVIEW_STATE.costs.promotion?.promocode,
          MOCK_DELIVERY_BUYER_DELIVERY_METHODS[0]
        );
      }));

      it('should not update the payview state ', fakeAsync(() => {
        expect(payviewState).toBeFalsy();
      }));
    });

    describe('WHEN refreshing the payview state', () => {
      let fakePayviewState: PayviewState;

      beforeEach(fakeAsync(() => {
        fakePayviewState = { ...MOCK_PAYVIEW_STATE };
        payviewState = null;
        getCurrentStateSpy.calls.reset();

        service.refreshPayviewState();

        tick(0);
      }));

      it('should call to payview service', fakeAsync(() => {
        expect(payviewService.getCurrentState).toHaveBeenCalledTimes(1);
        expect(payviewService.getCurrentState).toHaveBeenCalledWith(fakeItemHash);
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

        spyOn(payviewService, 'getCosts').and.returnValue(of(fakeCosts).pipe(delay(0)));
        spyOn(payviewService, 'getDeliveryCosts').and.returnValue(of(fakeDeliveryCosts).pipe(delay(0)));
        spyOn(payviewService, 'getDeliveryMethods').and.returnValue(of(fakeDeliveryMethods).pipe(delay(0)));

        service.refreshByDelivery();

        tick(0);
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

  describe('WHEN there is an error in any service', () => {
    let itemHash: string;
    let payviewState: PayviewState;

    beforeEach(fakeAsync(() => {
      spyOn(payviewService, 'getCurrentState').and.returnValue(
        of(MOCK_PAYVIEW_STATE).pipe(
          delay(0),
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
      tick(0);
    }));

    it('should request the payview state', fakeAsync(() => {
      expect(payviewService.getCurrentState).toHaveBeenCalledTimes(1);
      expect(payviewService.getCurrentState).toHaveBeenCalledWith(fakeItemHash);
    }));

    it('should not update the payview state ', fakeAsync(() => {
      expect(payviewState).toBeFalsy();
    }));

    it('should update the item hash', fakeAsync(() => {
      expect(itemHash).toBeTruthy();
    }));
  });
});
