import { fakeAsync, TestBed, tick } from '@angular/core/testing';

import { DeliveryBuyerCalculatorCosts } from '@api/core/model/delivery/buyer/calculator/delivery-buyer-calculator-costs.interface';
import { DeliveryBuyerCalculatorHttpService } from '@api/delivery/buyer/calculator/http/delivery-buyer-calculator-http.service';
import { DeliveryBuyerCalculatorService } from '@api/delivery/buyer/calculator/delivery-buyer-calculator.service';
import { DeliveryBuyerMode } from '@api/core/model/delivery/buyer/calculator/delivery-buyer-mode.enum';
import { Money } from '@api/core/model/money.interface';
import {
  MOCK_DELIVERY_BUYER_CALCULATOR_COSTS,
  MOCK_DELIVERY_BUYER_CALCULATOR_COSTS_RESPONSE,
} from '@api/fixtures/delivery/buyer/delivery-buyer-calculator-costs-dto.fixtures.spec';

import { of } from 'rxjs';

describe('DeliveryBuyerCalculatorService', () => {
  let service: DeliveryBuyerCalculatorService;
  let deliveryBuyerCalculatorHttpService: DeliveryBuyerCalculatorHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DeliveryBuyerCalculatorService,
        {
          provide: DeliveryBuyerCalculatorHttpService,
          useValue: {
            getCosts() {
              return of(MOCK_DELIVERY_BUYER_CALCULATOR_COSTS_RESPONSE);
            },
          },
        },
      ],
    });
    service = TestBed.inject(DeliveryBuyerCalculatorService);
    deliveryBuyerCalculatorHttpService = TestBed.inject(DeliveryBuyerCalculatorHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when asking to get the costs about a delivery', () => {
    const deliveryMode: DeliveryBuyerMode = DeliveryBuyerMode.BUYER_ADDRESS;
    const itemId: string = 'p61v99q1rx65';
    const money: Money = {
      amount: { integer: 13, decimals: 99, total: 13.99 },
      currency: { code: 'EUR', symbol: '€' },
    };
    const promocode: string = 'fake-promocode';
    let response: DeliveryBuyerCalculatorCosts;

    beforeEach(fakeAsync(() => {
      spyOn(deliveryBuyerCalculatorHttpService, 'getCosts').and.callThrough();

      service.getCosts(money, itemId, promocode, deliveryMode).subscribe((data: DeliveryBuyerCalculatorCosts) => (response = data));
      tick();
    }));

    it('should ask server for request information', () => {
      expect(deliveryBuyerCalculatorHttpService.getCosts).toHaveBeenCalledTimes(1);
      expect(deliveryBuyerCalculatorHttpService.getCosts).toHaveBeenCalledWith(money, itemId, promocode, deliveryMode);
    });

    it('should return the request response mapped into our model domain', () => {
      expect(response).toMatchObject(MOCK_DELIVERY_BUYER_CALCULATOR_COSTS);
    });
  });
});
