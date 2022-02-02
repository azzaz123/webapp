import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { DELIVERY_BUYER_DELIVERY_METHODS_ENDPOINT } from '@api/bff/delivery/buyer/http/endpoints';
import { DeliveryBuyerDeliveryMethodsDto } from '@api/bff/delivery/buyer/dtos';

import { Observable } from 'rxjs';

@Injectable()
export class DeliveryBuyerHttpService {
  constructor(private http: HttpClient) {}

  public getDeliveryMethods(itemHash: string): Observable<DeliveryBuyerDeliveryMethodsDto> {
    return this.http.get<DeliveryBuyerDeliveryMethodsDto>(DELIVERY_BUYER_DELIVERY_METHODS_ENDPOINT(itemHash));
  }
}
