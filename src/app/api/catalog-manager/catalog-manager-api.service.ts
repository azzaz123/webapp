import { Injectable } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';
import { map, mergeMap, tap } from 'rxjs/operators';
import { mapSlotsResponseToSlots } from './mappers/slots-mapper';
import { CatalogManagerHttpService } from './http/catalog-manager-http.service';
import { SubscriptionsService } from '@core/subscriptions/subscriptions.service';
import { SUBSCRIPTION_CATEGORY_TYPES } from '@core/subscriptions/subscriptions.interface';
import { Item } from '@core/item/item';
import { mapFilter, mapItems, mapSort } from './mappers/items-mapper';
import { STATUS } from '@private/features/catalog/components/selected-items/selected-product.interface';
import { ItemBySubscriptionResponse } from './dtos/items-by-subscription/items-subscription-type.interface';
import { SubscriptionSlot } from '@api/core/model/subscriptions/slots/subscription-slot.interface';
import { SORT_KEYS } from './constants/sort.constants';

export const PAGE_SIZE = 1000;
@Injectable()
export class CatalogManagerApiService {
  private items: Partial<Record<STATUS, Item[]>> = {
    [STATUS.ACTIVE]: [],
    [STATUS.INACTIVE]: [],
    [STATUS.SOLD]: [],
  };
  constructor(private catalogManagerService: CatalogManagerHttpService, private subscriptionsService: SubscriptionsService) {}

  public getSlots(): Observable<SubscriptionSlot[]> {
    return forkJoin([this.catalogManagerService.getSlots(), this.subscriptionsService.getSubscriptions(false)]).pipe(
      map((values) => mapSlotsResponseToSlots(values[0], values[1]))
    );
  }

  public itemsBySubscriptionType(
    type: SUBSCRIPTION_CATEGORY_TYPES,
    sortByParam: SORT_KEYS,
    status = STATUS.ACTIVE,
    term?: string,
    cache = false
  ): Observable<Item[]> {
    const itemsSource = cache && this.items[status]?.length ? of(this.items[status]) : this.fetchItems(type, status);

    return itemsSource.pipe(
      map((res) => mapFilter(term, res)),
      map((res) => mapSort(sortByParam, res))
    );
  }

  private fetchItems(type: SUBSCRIPTION_CATEGORY_TYPES, status: STATUS): Observable<Item[]> {
    return this.recursiveItemsByCategory(0, PAGE_SIZE, type, status).pipe(
      map(mapItems),
      tap((res) => {
        this.items[status] = res;
      })
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
