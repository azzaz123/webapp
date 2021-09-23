import { Injectable } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { SubscriptionSlot } from './interfaces/subscription-slot/subscription-slot.interface';
import { mapSlotsResponseToSlots } from './mappers/slots-mapper';
import { CatalogManagerHttpService } from './http/catalog-manager-http.service';
import { SubscriptionsService } from '@core/subscriptions/subscriptions.service';
import { SUBSCRIPTION_CATEGORY_TYPES } from '@core/subscriptions/subscriptions.interface';
import { Item } from '@core/item/item';
import { mapFilter, mapItems, mapSort } from './mappers/items-mapper';
import { ItemBySubscriptionResponse } from './dtos/slots/items-subscription-type.interface';
import { STATUS } from '@private/features/catalog/components/selected-items/selected-product.interface';

@Injectable()
export class CatalogManagerApiService {
  constructor(private catalogManagerService: CatalogManagerHttpService, private subscriptionsService: SubscriptionsService) {}

  public getSlots(): Observable<SubscriptionSlot[]> {
    return forkJoin([this.catalogManagerService.getSlots(), this.subscriptionsService.getSubscriptions(false)]).pipe(
      map((values) => mapSlotsResponseToSlots(values[0], values[1]))
    );
  }

  public itemsBySubscriptionType(
    type: SUBSCRIPTION_CATEGORY_TYPES,
    sortByParam: string,
    status = STATUS.ACTIVE,
    term?: string
  ): Observable<Item[]> {
    return this.recursiveItemsByCategory(0, 20, type, status).pipe(
      map(mapItems),
      map((res) => mapFilter(term, res)),
      map((res) => mapSort(sortByParam, res))
    );
  }

  private recursiveItemsByCategory(
    init: number,
    offset: number,
    type: SUBSCRIPTION_CATEGORY_TYPES,
    status: STATUS
  ): Observable<ItemBySubscriptionResponse[]> {
    return this.catalogManagerService.getItemsBySubscriptionType(init, offset, type, status).pipe(
      mergeMap((res) => {
        if (res.length === offset) {
          return this.recursiveItemsByCategory(init + offset, offset, type, status).pipe(
            map((recursiveResult) => res.concat(recursiveResult))
          );
        } else {
          return of(res);
        }
      })
    );
  }
}
