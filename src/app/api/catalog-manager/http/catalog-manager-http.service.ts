import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { SubscriptionSlotGeneralResponse } from '../dtos/slots/slots-response.interface';
import { ITEMS_BY_SUBSCRIPTION_TYPE_ENDPOINT, SUBSCRIPTIONS_SLOTS_ENDPOINT } from './endpoints';
import { SUBSCRIPTION_CATEGORY_TYPES } from '@core/subscriptions/subscriptions.interface';
import { ItemBySubscriptionResponse } from '../dtos/slots/items-subscription-type.interface';
import { STATUS } from '@private/features/catalog/components/selected-items/selected-product.interface';

@Injectable()
export class CatalogManagerHttpService {
  public constructor(private httpClient: HttpClient) {}

  public getSlots(): Observable<SubscriptionSlotGeneralResponse> {
    return this.httpClient.get<SubscriptionSlotGeneralResponse>(SUBSCRIPTIONS_SLOTS_ENDPOINT);
  }

  public getItemsBySubscriptionType(
    init: number,
    offset: number,
    type: SUBSCRIPTION_CATEGORY_TYPES,
    status: STATUS
  ): Observable<ItemBySubscriptionResponse[]> {
    return this.httpClient.get<ItemBySubscriptionResponse[]>(ITEMS_BY_SUBSCRIPTION_TYPE_ENDPOINT, {
      params: {
        status,
        init: init.toString(),
        end: (init + offset).toString(),
        type,
      },
    });
  }
}
