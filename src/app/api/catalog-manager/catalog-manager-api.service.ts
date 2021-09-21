import { Injectable } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { SubscriptionSlot } from './interfaces/subscription-slot/subscription-slot.interface';
import { mapSlotsResponseToSlots } from './mappers/slots-mapper';
import { CatalogManagerHttpService } from './http/catalog-manager-http.service';
import { SubscriptionsService } from '@core/subscriptions/subscriptions.service';
import { SUBSCRIPTION_CATEGORY_TYPES } from '@core/subscriptions/subscriptions.interface';
import { Item } from '@core/item/item';
import { ItemByCategoryResponse, ItemsStore } from '@core/item/item-response.interface';
import { find, findIndex, reverse, without, map as lodashMap, filter, sortBy } from 'lodash-es';

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
      map((values) => mapSlotsResponseToSlots(values[0].slots, values[1]))
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
      return this.recursiveMinesByCategory(0, 20, type, status).pipe(
        map((responseArray) => {
          if (responseArray.length > 0) {
            const items = responseArray.map((i) => this.mapItemByCategory(i));
            this.items[status] = items;
            this.lastTypeSearched = type;
            return items;
          }
          return [];
        }),
        map((res) => {
          term = term ? term.trim().toLowerCase() : '';
          if (term !== '') {
            return filter(res, (item: Item) => {
              return item.title.toLowerCase().indexOf(term) !== -1;
            });
          }
          return res;
        }),
        map((res) => {
          const sort = sortByParam.split('_');
          const field: string = sort[0] === 'price' ? 'salePrice' : 'modifiedDate';
          const sorted: Item[] = sortBy(res, [field]);
          if (sort[1] === 'desc') {
            return reverse(sorted);
          }
          return sorted;
        })
      );
    }
  }

  public recursiveMinesByCategory(
    init: number,
    offset: number,
    type: SUBSCRIPTION_CATEGORY_TYPES,
    status: string
  ): Observable<ItemByCategoryResponse[]> {
    return this.catalogManagerService.getItemsBySubscriptionType(init, offset, type, status).pipe(
      mergeMap((res) => {
        if (res.length > 0) {
          return this.recursiveMinesByCategory(init + offset, offset, type, status).pipe(
            map((recursiveResult) => res.concat(recursiveResult))
          );
        } else {
          return of([]);
        }
      })
    );
  }

  private mapItemByCategory(response: ItemByCategoryResponse) {
    const item = new Item(
      response.id,
      null,
      null,
      response.title,
      null,
      null,
      null,
      response.sale_price,
      response.currency_code,
      response.modified_date,
      null,
      response.flags,
      null,
      null,
      response.main_image,
      null,
      response.web_slug,
      response.publish_date,
      null,
      null,
      null,
      response.car_info
    );

    if (response.active_item_purchase) {
      if (response.active_item_purchase.listing_fee) {
        item.listingFeeExpiringDate = new Date().getTime() + response.active_item_purchase.listing_fee.remaining_time_ms;
      }

      if (response.active_item_purchase.bump) {
        item.purchases = {
          bump_type: response.active_item_purchase.bump.type,
          expiration_date: response.active_item_purchase.bump.remaining_time_ms,
        };

        item.bumpExpiringDate = new Date().getTime() + response.active_item_purchase.bump.remaining_time_ms;
      }
    }

    return item;
  }
}
