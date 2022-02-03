import { Injectable } from '@angular/core';

import { DELIVERY_MODE } from '@api/core/model/delivery/delivery-mode.type';
import { DeliveryBuyerCalculatorCosts } from '@api/core/model/delivery/buyer/calculator/delivery-buyer-calculator-costs.interface';
import { DeliveryBuyerCalculatorHttpService } from '@api/delivery/buyer/calculator/http/delivery-buyer-calculator-http.service';
import { mapDeliveryBuyerCalculatorCostsDtoToDeliveryBuyerCalculatorCosts } from '@api/delivery/buyer/calculator/mappers/delivery-buyer-calculator-mapper';
import { Money } from '@api/core/model/money.interface';

import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class DeliveryBuyerCalculatorService {
  constructor(private deliveryBuyerCalculatorService: DeliveryBuyerCalculatorHttpService) {}

  public getCosts(money: Money, itemId: string, promocode: string, deliveryMode: DELIVERY_MODE): Observable<DeliveryBuyerCalculatorCosts> {
    return this.deliveryBuyerCalculatorService
      .getCosts(money, itemId, promocode, deliveryMode)
      .pipe(map(mapDeliveryBuyerCalculatorCostsDtoToDeliveryBuyerCalculatorCosts));
  }
}
