import { Injectable } from '@angular/core';

import { DeliveryBuyerDeliveryMethods } from '@api/core/model/delivery/buyer/delivery-methods';
import { DeliveryBuyerHttpService } from '@api/bff/delivery/buyer/http/delivery-buyer-http.service';
import { mapDeliveryBuyerDeliveryMethodsDtoToDeliveryBuyerDeliveryMethods } from '@api/bff/delivery/buyer/mappers/delivery-buyer.mapper';

import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DeliveryBuyerService {
  constructor(private deliveryBuyyerHttpService: DeliveryBuyerHttpService) {}

  public getDeliveryMethods(itemHash: string): Observable<DeliveryBuyerDeliveryMethods> {
    return this.deliveryBuyyerHttpService
      .getDeliveryMethods(itemHash)
      .pipe(map(mapDeliveryBuyerDeliveryMethodsDtoToDeliveryBuyerDeliveryMethods));
  }
}
