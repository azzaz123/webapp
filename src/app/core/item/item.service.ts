import { mergeMap, map, catchError, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { FAKE_ITEM_IMAGE_BASE_PATH, Item, ITEM_TYPES } from './item';
import {
  AllowedActionResponse,
  AvailableProductsResponse,
  CarContent,
  CarInfo,
  CheapestProducts,
  ConversationUser,
  Duration,
  ItemBulkResponse,
  ItemContent,
  ItemCounters,
  ItemDataResponse,
  ItemProContent,
  ItemProResponse,
  ItemResponse,
  ItemsData,
  ItemsStore,
  ItemsWithAvailableProductsResponse,
  ItemWithProducts,
  LatestItemResponse,
  Order,
  OrderPro,
  Product,
  ProductDurations,
  Purchase,
  PurchaseProductsWithCreditsResponse,
  RealestateContent,
  SelectedItemsAction,
  ListingFeeProductInfo,
  ItemByCategoryResponse,
} from './item-response.interface';
import { find, findIndex, reverse, without, map as lodashMap, filter, sortBy } from 'lodash-es';
import { I18nService } from '../i18n/i18n.service';
import { EventService } from '../event/event.service';
import { Observable, of, ReplaySubject } from 'rxjs';
import { Car } from './car';
import { ItemLocation } from '../geolocation/address-response.interface';
import { Realestate } from './realestate';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { environment } from '@environments/environment';
import * as mapRx from 'rxjs/operators';
import { UuidService } from '../uuid/uuid.service';

export const PUBLISHED_ID = 0;
export const ONHOLD_ID = 90;
export const SOLD_OUTSIDE = 30;

export const ITEM_STATUSES: any = {
  active: PUBLISHED_ID,
  pending: ONHOLD_ID,
  sold: SOLD_OUTSIDE,
};

export const PAYMENT_PROVIDER = 'STRIPE';
export const MINES_BY_CATEGORY_ENDPOINT = 'api/v3/items/manageable-items/';
export const ACTIVATE_ENDPOINT = 'activate';
export enum ITEM_STATUS {
  SOLD = 'sold',
  ACTIVE = 'active',
  PENDING = 'pending',
  PUBLISHED = 'published',
}

export const ITEMS_API_URL = 'api/v3/items';
export const WEB_ITEMS_API_URL = 'api/v3/web/items';
export const USERS_API_URL = 'api/v3/users';
export const PROTOOL_API_URL = 'api/v3/protool';
export const V1_API_URL = 'shnm-portlet/api/v1';

@Injectable()
export class ItemService {
  public selectedAction: string;
  public selectedItems$: ReplaySubject<SelectedItemsAction> = new ReplaySubject(1);
  protected items: ItemsStore = {
    active: [],
    pending: [],
    sold: [],
    featured: [],
  };
  public selectedItems: string[] = [];
  private bumpTypes = ['countrybump', 'citybump', 'zonebump', 'urgent'];
  private lastCategoryIdSearched: number;

  constructor(private http: HttpClient, private i18n: I18nService, private uuidService: UuidService, private eventService: EventService) {}

  public getFakeItem(id: string): Item {
    const fakeItem: Item = new Item(id, 1, '1', 'No disponible');
    fakeItem.setFakeImage(FAKE_ITEM_IMAGE_BASE_PATH);
    return fakeItem;
  }

  public getCounters(id: string): Observable<ItemCounters> {
    return this.http
      .get<ItemCounters>(`${environment.baseUrl}${ITEMS_API_URL}/${id}/counters`)
      .pipe(catchError(() => of({ views: 0, favorites: 0, conversations: 0 })));
  }

  public bulkDelete(type: string): Observable<ItemBulkResponse> {
    return this.http
      .put<ItemBulkResponse>(`${environment.baseUrl}${ITEMS_API_URL}/delete`, {
        ids: this.selectedItems,
      })
      .pipe(
        tap((response: ItemBulkResponse) => {
          response.updatedIds.forEach((id: string) => {
            const index: number = findIndex(this.items[type], { id: id });
            this.items[type].splice(index, 1);
          });
          this.deselectItems();
        })
      );
  }

  public selectItem(id: string) {
    this.selectedItems.push(id);
    this.selectedItems$.next({
      id: id,
      action: 'selected',
    });
  }

  public deselectItems() {
    this.selectedItems = [];
    this.selectedItems$.next();
    this.items.active.map((item: Item) => {
      item.selected = false;
    });
    this.items.sold.map((item: Item) => {
      item.selected = false;
    });
    this.items.pending.map((item: Item) => {
      item.selected = false;
    });
    this.items.featured.map((item: Item) => {
      item.selected = false;
    });
    this.selectedAction = null;
  }

  public deselectItem(id: string) {
    this.selectedItems = without(this.selectedItems, id);
    this.selectedItems$.next({
      id: id,
      action: 'deselected',
    });

    if (this.selectedItems.length === 0) {
      this.selectedAction = null;
    }
  }

  protected mapRecordData(response: any): Item {
    const data: ItemResponse = <ItemResponse>response;
    const content: ItemContent = data.content;
    if (data.type === 'cars') {
      return this.mapCar(content);
    } else if (data.type === 'real_estate') {
      return this.mapRealEstate(content);
    }
    return this.mapItem(content);
  }

  protected mapRecordDataPro(response: ItemProResponse): Item {
    const data: ItemProResponse = <ItemProResponse>response;
    const content: ItemProContent = data.content;
    return this.mapItemPro(content);
  }

  private mapCar(content: CarContent): Car {
    return new Car(
      content.id,
      content.seller_id,
      content.title,
      content.storytelling,
      content.sale_price === undefined ? content.price : content.sale_price,
      content.currency_code || content.currency,
      content.modified_date,
      content.url,
      content.flags,
      content.sale_conditions,
      content.images,
      content.web_slug,
      content.brand,
      content.model,
      content.year,
      content.gearbox,
      content.engine,
      content.color,
      content.horsepower,
      content.body_type,
      content.num_doors,
      content.extras,
      content.warranty,
      content.num_seats,
      content.condition,
      content.version,
      content.financed_price,
      content.publish_date,
      content.image,
      content.km
    );
  }

  private mapRealEstate(content: RealestateContent): Realestate {
    return new Realestate(
      content.id,
      content.seller_id,
      content.title,
      content.storytelling,
      content.location,
      content.sale_price,
      content.currency_code,
      content.modified_date,
      content.url,
      content.flags,
      content.images,
      content.web_slug,
      content.operation,
      content.type,
      content.condition,
      content.surface,
      content.bathrooms,
      content.rooms,
      content.garage,
      content.terrace,
      content.elevator,
      content.pool,
      content.garden,
      content.image,
      content.publish_date
    );
  }

  private mapItem(content: ItemContent): Item {
    return new Item(
      content.id,
      null,
      content.seller_id,
      content.title,
      content.description,
      content.category_id,
      null,
      content.sale_price === undefined ? content.price : content.sale_price,
      content.currency_code || content.currency,
      content.modified_date,
      content.url,
      content.flags,
      null,
      content.sale_conditions,
      content.images
        ? content.images[0]
        : {
            id: this.uuidService.getUUID(),
            original_width: content.image ? content.image.original_width : null,
            original_height: content.image ? content.image.original_height : null,
            average_hex_color: '',
            urls_by_size: content.image,
          },
      content.images,
      content.web_slug,
      content.publish_date,
      content.delivery_info,
      ITEM_TYPES.CONSUMER_GOODS,
      content.extra_info
        ? {
            object_type: {
              id: content.extra_info.object_type && content.extra_info.object_type.id ? content.extra_info.object_type.id.toString() : null,
              name: content.extra_info.object_type && content.extra_info.object_type.name ? content.extra_info.object_type.name : null,
            },
            brand: content.extra_info.brand,
            model: content.extra_info.model,
            gender: content.extra_info.gender,
            size: {
              id: content.extra_info.size && content.extra_info.size.id ? content.extra_info.size.id.toString() : null,
            },
            condition: content.extra_info.condition || null,
          }
        : undefined
    );
  }

  private mapItemPro(content: ItemProContent): Item {
    return new Item(
      content.id,
      null,
      content.seller_id,
      content.title,
      content.description,
      content.category_id,
      null,
      content.price,
      content.currency,
      content.modified_date,
      null,
      content.flags,
      null,
      null,
      {
        id: this.uuidService.getUUID(),
        original_width: content.image ? content.image.original_width : null,
        original_height: content.image ? content.image.original_height : null,
        average_hex_color: '',
        urls_by_size: {
          original: content.image.original,
          small: content.image.small,
          large: content.image.large,
          medium: content.image.medium,
          xlarge: content.image.xlarge,
        },
      },
      content.images,
      content.web_slug,
      content.publish_date,
      null
    );
  }

  private mapItemByCategory(response: ItemByCategoryResponse, categoryId: number) {
    const item = new Item(
      response.id,
      null,
      null,
      response.title,
      null,
      categoryId,
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

  public getPaginationItems(url: string, init, status?): Observable<ItemsData> {
    return this.http
      .get<HttpResponse<ItemResponse[]>>(`${environment.baseUrl}${url}`, {
        params: {
          init: init,
          expired: status,
        },
        observe: 'response' as 'body',
      })
      .pipe(
        map((r) => {
          const res: ItemResponse[] = r.body;
          const nextPage: string = r.headers.get('x-nextpage');

          let params = {};
          if (nextPage) {
            nextPage.split('&').forEach((paramSplit) => {
              const paramValues = paramSplit.split('=');
              params[paramValues[0]] = paramValues[1];
            });
          }

          const nextInit = params && params['init'] ? +params['init'] : null;
          let data: Item[] = [];
          if (res.length > 0) {
            data = res.map((i: ItemResponse) => {
              const item: Item = this.mapRecordData(i);
              item.views = i.content.views;
              item.favorites = i.content.favorites;
              item.conversations = i.content.conversations;
              return item;
            });
          }
          return {
            data: data,
            init: nextInit,
          };
        }),
        mergeMap((itemsData: ItemsData) => {
          return this.getPurchases().pipe(
            map((purchases: Purchase[]) => {
              purchases.forEach((purchase: Purchase) => {
                const index: number = findIndex(itemsData.data, {
                  id: purchase.item_id,
                });
                if (index !== -1) {
                  if (purchase.purchase_name === 'listingfee') {
                    itemsData.data[index].listingFeeExpiringDate = purchase.expiration_date;
                  }
                  if (this.bumpTypes.includes(purchase.purchase_name)) {
                    itemsData.data[index].bumpExpiringDate = purchase.expiration_date;
                  }
                  if (purchase.visibility_flags) {
                    itemsData.data[index].flags.bumped = purchase.visibility_flags.bumped;
                    itemsData.data[index].flags.highlighted = purchase.visibility_flags.highlighted;
                    itemsData.data[index].flags.urgent = purchase.visibility_flags.urgent;
                  }
                }
              });
              return itemsData;
            })
          );
        }),
        map((itemsData: ItemsData) => {
          this.selectedItems.forEach((selectedItemId: string) => {
            const index: number = findIndex(itemsData.data, {
              id: selectedItemId,
            });
            if (index !== -1) {
              itemsData.data[index].selected = true;
            }
          });
          return itemsData;
        })
      );
  }

  public mine(init: number, status?: string): Observable<ItemsData> {
    this.lastCategoryIdSearched = null;
    return this.getPaginationItems(WEB_ITEMS_API_URL + '/mine/' + status, init, true);
  }

  public myFavorites(init: number): Observable<ItemsData> {
    return this.getPaginationItems(USERS_API_URL + '/me/items/favorites', init).pipe(
      map((itemsData: ItemsData) => {
        itemsData.data = itemsData.data.map((item: Item) => {
          item.favorited = true;
          return item;
        });
        return itemsData;
      })
    );
  }

  public deleteItem(id: string): Observable<any> {
    return this.http.delete(`${environment.baseUrl}${ITEMS_API_URL}/${id}`);
  }

  public reserveItem(id: string, reserved: boolean): Observable<any> {
    return this.http.put(`${environment.baseUrl}${ITEMS_API_URL}/${id}/reserve`, {
      reserved,
    });
  }

  public reactivateItem(id: string): Observable<any> {
    return this.http.put(`${environment.baseUrl}${ITEMS_API_URL}/${id}/reactivate`, {});
  }

  public favoriteItem(id: string, favorited: boolean): Observable<any> {
    return this.http.put(`${environment.baseUrl}${ITEMS_API_URL}/${id}/favorite`, {
      favorited,
    });
  }

  public bulkReserve(): Observable<ItemBulkResponse> {
    return this.http.put<ItemBulkResponse>(`${environment.baseUrl}${ITEMS_API_URL}/reserve`, {
      ids: this.selectedItems,
    });
  }

  public soldOutside(id: string): Observable<any> {
    return this.http.put(`${environment.baseUrl}${ITEMS_API_URL}/${id}/sold`, {});
  }

  public getConversationUsers(id: string): Observable<ConversationUser[]> {
    return this.http.get<ConversationUser[]>(`${environment.baseUrl}${ITEMS_API_URL}/${id}/conversation-users`);
  }

  public getAvailableReactivationProducts(id: string): Observable<Product> {
    return this.http
      .get(`${environment.baseUrl}${WEB_ITEMS_API_URL}/${id}/available-reactivation-products`)
      .pipe(mapRx.map((response: AvailableProductsResponse) => response.products[0]));
  }

  private getPurchases(): Observable<Purchase[]> {
    return this.http.get<Purchase[]>(`${environment.baseUrl}${WEB_ITEMS_API_URL}/mine/purchases`);
  }

  public purchaseProducts(orderParams: Order[], orderId: string): Observable<string[]> {
    const headers: HttpHeaders = new HttpHeaders({
      'X-PaymentProvider': PAYMENT_PROVIDER,
    });

    return this.http.post<string[]>(`${environment.baseUrl}${WEB_ITEMS_API_URL}/purchase/products/${orderId}`, orderParams, {
      headers,
    });
  }

  public purchaseProductsWithCredits(orderParams: Order[], orderId: string): Observable<PurchaseProductsWithCreditsResponse> {
    const headers = new HttpHeaders({ 'X-PaymentProvider': PAYMENT_PROVIDER });

    return this.http.post<PurchaseProductsWithCreditsResponse>(
      `${environment.baseUrl}${WEB_ITEMS_API_URL}/purchase/products/credit/${orderId}`,
      orderParams,
      { headers }
    );
  }

  public update(item: any, itemType: ITEM_TYPES): Observable<any> {
    let url: string = ITEMS_API_URL + '/';
    let headers: HttpHeaders = new HttpHeaders({ 'X-DeviceOS': '0' });

    if (itemType === ITEM_TYPES.CARS) {
      url += 'cars/';
      headers = headers.append('X-PaymentProvider', PAYMENT_PROVIDER);
      headers = headers.append('Accept', 'application/vnd.edit-car-v2+json');
    }
    if (itemType === ITEM_TYPES.REAL_ESTATE) {
      url += 'real_estate/';
    }

    return this.http
      .put(`${environment.baseUrl}${url}${item.id}`, item, { headers })
      .pipe(tap(() => this.eventService.emit(EventService.ITEM_UPDATED, item)));
  }

  public updateRealEstateLocation(itemId: string, location: ItemLocation): Observable<any> {
    return this.http.put(`${environment.baseUrl}${ITEMS_API_URL}/real_estate/${itemId}/location`, location);
  }

  public deletePicture(itemId: string, pictureId: string): Observable<any> {
    return this.http.delete(`${environment.baseUrl}${ITEMS_API_URL}/${itemId}/picture/${pictureId}`);
  }

  public get(id: string): Observable<Item> {
    return this.http.get<Item>(`${environment.baseUrl}${ITEMS_API_URL}/${id}`).pipe(
      mapRx.map((r) => this.mapRecordData(r)),
      catchError(() => of(this.getFakeItem(id)))
    );
  }

  public updatePicturesOrder(itemId: string, pictures_order: { [fileId: string]: number }): Observable<any> {
    return this.http.put(`${environment.baseUrl}${ITEMS_API_URL}/${itemId}/change-picture-order`, {
      pictures_order,
    });
  }

  public getItemsWithAvailableProducts(ids: string[]): Observable<ItemWithProducts[]> {
    return this.http
      .get(`${environment.baseUrl}${WEB_ITEMS_API_URL}/available-visibility-products`, {
        params: {
          itemsIds: ids.join(','),
        },
      })
      .pipe(
        mapRx.map((res: ItemsWithAvailableProductsResponse[]) => {
          return res.map((i: ItemsWithAvailableProductsResponse) => {
            return {
              item: this.mapRecordData(i),
              products: this.getProductDurations(i.productList),
            };
          });
        })
      );
  }

  public getCheapestProductPrice(ids: string[]): Observable<CheapestProducts> {
    return this.http
      .get(`${environment.baseUrl}${WEB_ITEMS_API_URL}/available-visibility-products`, {
        params: {
          itemsIds: ids.join(','),
        },
      })
      .pipe(
        mapRx.map((res: ItemsWithAvailableProductsResponse[]) => {
          let returnObj = {};
          res.forEach((i: ItemsWithAvailableProductsResponse) => {
            returnObj[i.content.id] = i.productList[0].durations[0].market_code;
          });
          return returnObj;
        })
      );
  }

  private getActionsAllowed(id: string): Observable<AllowedActionResponse[]> {
    return this.http.get<AllowedActionResponse[]>(`${environment.baseUrl}${ITEMS_API_URL}/${id}/actions-allowed`);
  }

  public canDoAction(action: string, id: string): Observable<boolean> {
    return this.getActionsAllowed(id).pipe(
      mapRx.map((actions: AllowedActionResponse[]) => {
        const canDo: AllowedActionResponse = find(actions, { type: action });
        if (canDo) {
          return canDo.allowed;
        }
        return false;
      })
    );
  }

  private getProductDurations(productList: Product[]): ProductDurations {
    const durations: number[] = lodashMap(productList[0].durations, 'duration');
    const types: string[] = lodashMap(productList, 'name');
    const productDurations = {};
    durations.forEach((duration: number) => {
      productDurations[duration] = {};
      types.forEach((type: string) => {
        productDurations[duration][type] = this.findDuration(productList, duration, type);
      });
    });
    return productDurations;
  }

  private findDuration(productList: Product[], duration: number, type: string): Duration {
    const product: Product = find(productList, { name: type });
    return find(product.durations, { duration: duration });
  }

  public mines(
    pageNumber: number,
    pageSize: number,
    sortByParam: string,
    status: string = 'active',
    term?: string,
    cache: boolean = true
  ): Observable<Item[]> {
    let init: number = (pageNumber - 1) * pageSize;
    let end: number = init + pageSize;
    let endStatus: string = status === 'featured' ? 'active' : status;
    let observable: Observable<Item[]>;

    if (this.items[status].length && cache) {
      observable = of(this.items[status]);
    } else {
      observable = this.recursiveMines(0, 300, endStatus).pipe(
        map((res: ItemProResponse[]) => {
          if (res.length > 0) {
            let items: Item[] = res
              .filter((res) => (res.content.purchases && status === 'featured') || status !== 'featured')
              .map((i: ItemProResponse) => {
                const item: Item = this.mapRecordDataPro(i);
                item.views = i.content.views;
                item.favorites = i.content.favorites;
                item.conversations = i.content.conversations;
                item.purchases = i.content.purchases ? i.content.purchases : null;
                item.km = i.content.km ? i.content.km : null;
                return item;
              });
            this.items[status] = items;
            this.lastCategoryIdSearched = null;
            return items;
          }
          return [];
        })
      );
    }
    return observable.pipe(
      map((res: Item[]) => {
        term = term ? term.trim().toLowerCase() : '';
        if (term !== '') {
          return filter(res, (item: Item) => {
            return item.title.toLowerCase().indexOf(term) !== -1 || item.description.toLowerCase().indexOf(term) !== -1;
          });
        }
        return res;
      }),
      map((res: Item[]) => {
        let sort: string[] = sortByParam.split('_');
        let field: string = sort[0] === 'price' ? 'salePrice' : 'modifiedDate';
        let sorted: Item[] = sortBy(res, [field]);
        if (sort[1] === 'desc') {
          return reverse(sorted);
        }
        return sorted;
      }),
      map((res: Item[]) => {
        return res.slice(init, end);
      })
    );
  }

  private recursiveMines(init: number, offset: number, status?: string): Observable<ItemProResponse[]> {
    return this.http
      .get<any>(`${environment.baseUrl}${PROTOOL_API_URL}/mines`, {
        params: {
          status: ITEM_STATUSES[status],
          init,
          end: init + offset,
          newVersion: true,
        } as any,
      })
      .pipe(
        mergeMap((res) => {
          if (res.length > 0) {
            return this.recursiveMines(init + offset, offset, status).pipe(
              map((res2: ItemProResponse[]) => {
                return res.concat(res2);
              })
            );
          } else {
            return of([]);
          }
        })
      );
  }

  public minesByCategory(
    pageNumber: number,
    pageSize: number,
    categoryId: number,
    sortByParam: string,
    status: string = 'active',
    term?: string,
    cache: boolean = true
  ): Observable<Item[]> {
    const init: number = (pageNumber - 1) * pageSize;
    const end: number = init + pageSize;

    // TODO: Propper condition with last category id searched and so
    if (status === 'TODO' && this.lastCategoryIdSearched && this.lastCategoryIdSearched === categoryId && this.items[status] && cache) {
      return of(this.items[status]);
    } else {
      return this.recursiveMinesByCategory(0, 20, categoryId, status).pipe(
        map((responseArray) => {
          if (responseArray.length > 0) {
            const items = responseArray.map((i) => this.mapItemByCategory(i, categoryId));
            this.items[status] = items;
            this.lastCategoryIdSearched = categoryId;
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

  public recursiveMinesByCategory(init: number, offset: number, categoryId: number, status: string): Observable<ItemByCategoryResponse[]> {
    return this.http
      .get<any>(`${environment.baseUrl}${MINES_BY_CATEGORY_ENDPOINT}`, {
        params: {
          status,
          init: init.toString(),
          end: (init + offset).toString(),
          category_id: categoryId.toString(),
        },
      })
      .pipe(
        mergeMap((res) => {
          if (res.length > 0) {
            return this.recursiveMinesByCategory(init + offset, offset, categoryId, status).pipe(
              map((recursiveResult) => res.concat(recursiveResult))
            );
          } else {
            return of([]);
          }
        })
      );
  }

  public getItemAndSetPurchaseInfo(id: string, purchase: Purchase): Item {
    const index: number = findIndex(this.items.active, { id: id });
    if (index !== -1) {
      this.items.active[index].bumpExpiringDate = purchase.expiration_date;
      return this.items.active[index];
    }
    return;
  }

  public resetAllPurchaseInfo() {
    this.items.active.forEach((item: Item) => {
      if (item.bumpExpiringDate) {
        item.bumpExpiringDate = null;
      }
    });
  }

  public bulkSetActivate(): Observable<any> {
    return this.http
      .post(`${environment.baseUrl}${PROTOOL_API_URL}/changeItemStatus`, {
        itemIds: this.selectedItems,
        publishStatus: PUBLISHED_ID,
      })
      .pipe(
        tap(() => {
          this.selectedItems.forEach((id: string) => {
            let index: number = findIndex(this.items.pending, { id: id });
            let deletedItem: Item = this.items.pending.splice(index, 1)[0];
            deletedItem.flags['onhold'] = false;
            deletedItem.selected = false;
            if (this.items.active.length) {
              this.items.active.push(deletedItem);
            }
          });
          this.eventService.emit('itemChangeStatus', this.selectedItems);
          this.deselectItems();
        }),
        catchError((errorResponse) => {
          return of(errorResponse);
        })
      );
  }

  public activate(): Observable<any> {
    return this.http
      .put(`${environment.baseUrl}${ITEMS_API_URL}/${ACTIVATE_ENDPOINT}`, {
        ids: this.selectedItems,
      })
      .pipe(tap(() => this.deselectItems()));
  }

  public activateSingleItem(id: string): Observable<void> {
    return this.http.put<void>(`${environment.baseUrl}${ITEMS_API_URL}/${id}/${ACTIVATE_ENDPOINT}`, {});
  }

  public deactivate(): Observable<any> {
    return this.http
      .put(`${environment.baseUrl}${ITEMS_API_URL}/inactivate`, {
        ids: this.selectedItems,
      })
      .pipe(tap(() => this.deselectItems()));
  }

  public bulkSetDeactivate(): Observable<any> {
    return this.http
      .post(`${environment.baseUrl}${PROTOOL_API_URL}/changeItemStatus`, {
        itemIds: this.selectedItems,
        publishStatus: ONHOLD_ID,
      })
      .pipe(
        tap(() => {
          this.selectedItems.forEach((id: string) => {
            let index: number = findIndex(this.items.active, { id: id });
            let deletedItem: Item = this.items.active.splice(index, 1)[0];
            deletedItem.flags['onhold'] = true;
            deletedItem.selected = false;
            if (this.items.pending.length) {
              this.items.pending.push(deletedItem);
            }
          });
          this.eventService.emit('itemChangeStatus', this.selectedItems);
          this.deselectItems();
        })
      );
  }

  public setSold(id: number): Observable<any> {
    return this.http.post(`${environment.baseUrl}${V1_API_URL}/item.json/${id}/sold`, {}).pipe(
      tap(() => {
        let index: number = findIndex(this.items.active, { legacyId: id });
        let deletedItem: Item = this.items.active.splice(index, 1)[0];
        if (this.items.sold.length) {
          this.items.sold.push(deletedItem);
        }
        this.eventService.emit(EventService.ITEM_SOLD, deletedItem);
      })
    );
  }

  public cancelAutorenew(itemId: string): Observable<any> {
    return this.http.put(`${environment.baseUrl}${PROTOOL_API_URL}/autorenew/update`, [
      {
        item_id: itemId,
        autorenew: false,
      },
    ]);
  }

  public getLatest(userId: string): Observable<ItemDataResponse> {
    return this.http
      .get(`${environment.baseUrl}${ITEMS_API_URL}/latest-cars`, {
        params: { userId },
      })
      .pipe(
        mapRx.map((resp: LatestItemResponse) => {
          return {
            count: resp.count - 1,
            data: resp.items[0] ? this.mapRecordData(resp.items[0]) : null,
          };
        })
      );
  }

  public bumpProItems(orderParams: OrderPro[]): Observable<string[]> {
    return this.http.post<string[]>(`${environment.baseUrl}${PROTOOL_API_URL}/purchaseItems`, orderParams);
  }

  public getCarInfo(brand: string, model: string, version: string): Observable<CarInfo> {
    return this.http.get<CarInfo>(`${environment.baseUrl}${ITEMS_API_URL}/cars/info`, {
      params: {
        brand,
        model,
        version,
      },
    });
  }

  public getListingFeeInfo(itemId: string): Observable<Product> {
    return this.http
      .get(`${environment.baseUrl}${WEB_ITEMS_API_URL}/${itemId}/listing-fee-info`)
      .pipe(mapRx.map((response: ListingFeeProductInfo) => response.product_group.products[0]));
  }
}
