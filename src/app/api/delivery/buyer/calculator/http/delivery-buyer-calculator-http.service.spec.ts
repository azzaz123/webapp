import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { DELIVERY_BUYER_CALCULATOR_COSTS_ENDPOINT } from '@api/delivery/buyer/calculator/http/endpoints';
import { DeliveryBuyerCalculatorCostsDto } from '@api/delivery/buyer/calculator/dtos/delivery-buyer-calculator-costs-dto.interface';
import { DeliveryBuyerCalculatorHttpService } from '@api/delivery/buyer/calculator/http/delivery-buyer-calculator-http.service';
import { DeliveryBuyerMode } from '@api/core/model/delivery/buyer/calculator/delivery-buyer-mode.enum';
import {
  MOCK_DELIVERY_BUYER_CALCULATOR_COSTS_RESPONSE,
  MOCK_DELIVERY_BUYER_CALCULATOR_COSTS_WITH_PROMOTION_RESPONSE,
} from '@api/fixtures/delivery/buyer/delivery-buyer-calculator-costs-dto.fixtures.spec';
import { Money } from '@api/core/model/money.interface';

describe('DeliveryBuyerCalculatorHttpService', () => {
  let service: DeliveryBuyerCalculatorHttpService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DeliveryBuyerCalculatorHttpService],
    });
    service = TestBed.inject(DeliveryBuyerCalculatorHttpService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('WHEN asking to get the buyer calculator costs', () => {
    describe('AND WHEN there is no promotion', () => {
      it('should ask server for getting this information', () => {
        let response: DeliveryBuyerCalculatorCostsDto;
        const deliveryMode: DeliveryBuyerMode = DeliveryBuyerMode.BUYER_ADDRESS;
        const itemId: string = 'p61v99q1rx65';
        const money: Money = {
          amount: { integer: 13, decimals: 99, total: 13.99 },
          currency: { code: 'EUR', symbol: '€' },
        };
        const expectedUrl: string = `${DELIVERY_BUYER_CALCULATOR_COSTS_ENDPOINT}?product_price_amount=${money.amount.total}&product_price_currency=${money.currency.code}&item_id=${itemId}&promocode=null&carrier_delivery_mode=${DeliveryBuyerMode[deliveryMode]}`;

        service.getCosts(money, itemId, null, deliveryMode).subscribe((data: DeliveryBuyerCalculatorCostsDto) => (response = data));
        const req: TestRequest = httpMock.expectOne(expectedUrl);
        req.flush(MOCK_DELIVERY_BUYER_CALCULATOR_COSTS_RESPONSE);

        expect(req.request.method).toBe('GET');
        expect(response).toEqual(MOCK_DELIVERY_BUYER_CALCULATOR_COSTS_RESPONSE);
      });
    });

    describe('AND WHEN there is a promotion code', () => {
      it('should ask server for getting this information', () => {
        let response: DeliveryBuyerCalculatorCostsDto;
        const deliveryMode: DeliveryBuyerMode = DeliveryBuyerMode.BUYER_ADDRESS;
        const itemId: string = 'p61v99q1rx65';
        const money: Money = {
          amount: { integer: 13, decimals: 99, total: 13.99 },
          currency: { code: 'EUR', symbol: '€' },
        };
        const promocode: string = 'fake-promocode';
        const expectedUrl: string = `${DELIVERY_BUYER_CALCULATOR_COSTS_ENDPOINT}?product_price_amount=${money.amount.total}&product_price_currency=${money.currency.code}&item_id=${itemId}&promocode=${promocode}&carrier_delivery_mode=${DeliveryBuyerMode[deliveryMode]}`;

        service.getCosts(money, itemId, promocode, deliveryMode).subscribe((data: DeliveryBuyerCalculatorCostsDto) => (response = data));
        const req: TestRequest = httpMock.expectOne(expectedUrl);
        req.flush(MOCK_DELIVERY_BUYER_CALCULATOR_COSTS_WITH_PROMOTION_RESPONSE);

        expect(req.request.method).toBe('GET');
        expect(response).toEqual(MOCK_DELIVERY_BUYER_CALCULATOR_COSTS_WITH_PROMOTION_RESPONSE);
      });
    });
  });
});
