import { Injectable } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';
import { map, mergeMap, tap } from 'rxjs/operators';
import { SubscriptionSlot } from './interfaces/subscription-slot/subscription-slot.interface';
import { mapSlotsResponseToSlots } from './mappers/slots-mapper';
import { CatalogManagerHttpService } from './http/catalog-manager-http.service';
import { SubscriptionsService } from '@core/subscriptions/subscriptions.service';
import { SUBSCRIPTION_CATEGORY_TYPES } from '@core/subscriptions/subscriptions.interface';
import { Item } from '@core/item/item';
import { ItemByCategoryResponse, ItemsStore } from '@core/item/item-response.interface';
import { mapFilter, mapItems, mapSort } from './mappers/items-mapper';

@Injectable()
export class CatalogManagerApiService {
  constructor(private catalogManagerService: CatalogManagerHttpService, private subscriptionsService: SubscriptionsService) {}
  private lastTypeSearched: SUBSCRIPTION_CATEGORY_TYPES;
  protected items: ItemsStore = {
    active: [],
    pending: [],
    sold: [],
    featured: [],
  };

  public getSlots(): Observable<SubscriptionSlot[]> {
    return forkJoin([this.catalogManagerService.getSlots(), this.subscriptionsService.getSubscriptions(false)]).pipe(
      map((values) => mapSlotsResponseToSlots(values[0], values[1]))
    );
  }

  public itemsBySubscriptionType(
    pageNumber: number,
    pageSize: number,
    type: SUBSCRIPTION_CATEGORY_TYPES,
    sortByParam: string,
    status: string = 'active',
    term?: string,
    cache: boolean = true
  ): Observable<Item[]> {
    const init: number = (pageNumber - 1) * pageSize;
    const end: number = init + pageSize;

    // TODO: Propper condition with last category id searched and so
    if (status === 'TODO' && this.lastTypeSearched && this.lastTypeSearched === type && this.items[status] && cache) {
      return of(this.items[status]);
    } else {
      return this.recursiveItemsByCategory(0, 20, type, status).pipe(
        map(mapItems),
        tap((items) => {
          if (items.length) {
            this.items[status] = items;
            this.lastTypeSearched = type;
          }
        }),
        map((res) => mapFilter(term, res)),
        map((res) => mapSort(sortByParam, res))
      );
    }
  }

  private recursiveItemsByCategory(
    init: number,
    offset: number,
    type: SUBSCRIPTION_CATEGORY_TYPES,
    status: string
  ): Observable<ItemByCategoryResponse[]> {
    return this.catalogManagerService.getItemsBySubscriptionType(init, offset, type, status).pipe(
      mergeMap((res) => {
        if (res.length > 0) {
          return this.recursiveItemsByCategory(init + offset, offset, type, status).pipe(
            map((recursiveResult) => res.concat(recursiveResult))
          );
        } else {
          return of([]);
        }
      })
    );
  }
}
