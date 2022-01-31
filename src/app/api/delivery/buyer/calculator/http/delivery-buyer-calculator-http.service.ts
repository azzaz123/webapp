import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { DELIVERY_BUYER_CALCULATOR_COSTS_ENDPOINT } from '@api/delivery/buyer/calculator/http/endpoints';
import { DeliveryBuyerCalculatorParam } from '@api/delivery/buyer/calculator/http/delivery-buyer-calculator-param.enum';
import { DeliveryBuyerMode } from '@api/core/model/delivery/buyer/calculator/delivery-buyer-mode.enum';
import { Money } from '@api/core/model/money.interface';
import { QueryParams } from '@api/core/utils/types';

import { Observable } from 'rxjs';

import { DeliveryBuyerCalculatorCostsDto } from '@api/delivery/buyer/calculator/dtos/delivery-buyer-calculator-costs-dto.interface';

@Injectable()
export class DeliveryBuyerCalculatorHttpService {
  constructor(private http: HttpClient) {}

  public getCosts(
    money: Money,
    itemId: string,
    promocode: string,
    deliveryMode: DeliveryBuyerMode
  ): Observable<DeliveryBuyerCalculatorCostsDto> {
    const params: QueryParams<DeliveryBuyerCalculatorParam> = {
      [DeliveryBuyerCalculatorParam.PRODUCT_PRICE_AMOUNT]: money.amount.total.toString(),
      [DeliveryBuyerCalculatorParam.PRODUCT_PRICE_CURRENCY]: money.currency.code,
      [DeliveryBuyerCalculatorParam.ITEM_ID]: itemId,
      [DeliveryBuyerCalculatorParam.PROMOCODE]: promocode,
      [DeliveryBuyerCalculatorParam.CARRIER_DELIVERY_MODE]: DeliveryBuyerMode[deliveryMode],
    };

    return this.http.get<DeliveryBuyerCalculatorCostsDto>(DELIVERY_BUYER_CALCULATOR_COSTS_ENDPOINT, { params });
  }
}
