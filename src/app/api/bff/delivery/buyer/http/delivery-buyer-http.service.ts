import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { APP_VERSION } from '@environments/version';
import { DELIVERY_BUYER_DELIVERY_METHODS_ENDPOINT } from '@api/bff/delivery/buyer/http/endpoints';
import { DeliveryBuyerDeliveryMethodsDto } from '@api/bff/delivery/buyer/dtos';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DeliveryBuyerHttpService {
  constructor(private http: HttpClient) {}

  public getDeliveryMethods(itemHash: string): Observable<DeliveryBuyerDeliveryMethodsDto> {
    return this.http.get<DeliveryBuyerDeliveryMethodsDto>(DELIVERY_BUYER_DELIVERY_METHODS_ENDPOINT, {
      params: { item_hash: itemHash },
      headers: this.getHeaders,
    });
  }

  private get getHeaders(): { [header: string]: string } {
    return { 'X-AppVersion': APP_VERSION.replace(/\./g, '') };
  }
}
