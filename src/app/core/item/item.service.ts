import { Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';
import { FAKE_ITEM_IMAGE_BASE_PATH, Item } from './item';
import { ResourceService } from '../resource/resource.service';
import {
  AllowedActionResponse,
  AvailableProductsResponse,
  CarContent,
  ConversationUser,
  Duration,
  ItemBulkResponse,
  ItemContent,
  ItemCounters, ItemDataResponse,
  ItemResponse,
  ItemsData,
  ItemsStore,
  ItemsWithAvailableProductsResponse,
  ItemWithProducts, LatestItemResponse,
  Order,
  Product,
  ProductDurations,
  Purchase,
  SelectedItemsAction, ItemProResponse, ItemProContent
} from './item-response.interface';
import { Headers, RequestOptions, Response } from '@angular/http';
import * as _ from 'lodash';
import { I18nService } from '../i18n/i18n.service';
import { BanReason } from './ban-reason.interface';
import { TrackingService } from '../tracking/tracking.service';
import { EventService } from '../event/event.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/do';
import { UserService } from '../user/user.service';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Car } from './car';
import { ITEM_BAN_REASONS } from './ban-reasons';
import { UUID } from 'angular2-uuid';

export const PUBLISHED_ID: number = 0;
export const ONHOLD_ID: number = 90;
export const SOLD_OUTSIDE: number = 30;

export const ITEM_STATUSES: any = {
  'active': PUBLISHED_ID,
  'pending': ONHOLD_ID,
  'sold': SOLD_OUTSIDE
};

@Injectable()
export class ItemService extends ResourceService {

  protected API_URL = 'api/v3/items';
  private API_URL_WEB = 'api/v3/web/items';
  private API_URL_USER = 'api/v3/users';
  private API_URL_PROTOOL = 'api/v3/protool';
  private API_URL_V1: string = 'shnm-portlet/api/v1';
  public selectedAction: string;
  public selectedItems$: ReplaySubject<SelectedItemsAction> = new ReplaySubject(1);
  private banReasons: BanReason[] = null;
  protected items: ItemsStore = {
    active: [],
    pending: [],
    sold: [],
    featured: []
  };
  public selectedItems: string[] = [];
  public plannedCityPurchase = 0;
  public plannedCountryPurchase = 0;

  constructor(http: HttpService,
              private i18n: I18nService,
              private trackingService: TrackingService,
              private eventService: EventService) {
    super(http);
  }

  public getFakeItem(id: string): Item {
    const fakeItem: Item = new Item(id, 1, '1', 'No disponible');
    fakeItem.setFakeImage(FAKE_ITEM_IMAGE_BASE_PATH);
    return fakeItem;
  }

  public getCounters(id: string): Observable<ItemCounters> {
    return this.http.get(this.API_URL + '/' + id + '/counters')
    .map((r: Response) => r.json())
    .catch(() => Observable.of({views: 0, favorites: 0}));
  }

  public bulkDelete(type: string): Observable<ItemBulkResponse> {
    return this.http.put(this.API_URL + '/delete', {
      ids: this.selectedItems
    })
    .map((r: Response) => r.json())
    .do((response: ItemBulkResponse) => {
      response.updatedIds.forEach((id: string) => {
        const index: number = _.findIndex(this.items[type], {'id': id});
        this.items[type].splice(index, 1);
      });
      this.deselectItems();
    });
  }

  public deselectItems() {
    this.trackingService.track(TrackingService.PRODUCT_LIST_BULK_UNSELECTED, {product_ids: this.selectedItems.join(', ')});
    this.selectedItems = [];
    this.items.active.map((item: Item) => {
      item.selected = false;
    });
    this.items.sold.map((item: Item) => {
      item.selected = false;
    });
  }

  public getBanReasons(): Observable<BanReason[]> {
    if (!this.banReasons) {
      this.banReasons = this.i18n.getTranslations('reportListingReasons');
    }
    return Observable.of(this.banReasons);
  }

  public selectItem(id: string) {
    this.selectedItems.push(id);
    this.selectedItems$.next({
      id: id,
      action: 'selected'
    });
  }

  public deselectItem(id: string) {
    this.selectedItems = _.without(this.selectedItems, id);
    this.selectedItems$.next({
      id: id,
      action: 'deselected'
    });
  }

  protected mapRecordData(response: any): Item {
    const data: ItemResponse = <ItemResponse>response;
    const content: ItemContent = data.content;
    if (data.type === 'cars') {
      return this.mapCar(content);
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
      content.km,
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
      content.image
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
      content.images ? content.images[0] : {
        id: UUID.UUID(),
        original_width: content.image ? content.image.original_width : null,
        original_height: content.image ? content.image.original_height : null,
        average_hex_color: '',
        urls_by_size: content.image
      },
      content.images,
      content.web_slug,
      content.modified_date,
      content.delivery_info
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
        id: UUID.UUID(),
        original_width: content.image ? content.image.original_width : null,
        original_height: content.image ? content.image.original_height : null,
        average_hex_color: '',
        urls_by_size:  {
          original: content.image.original,
          small: content.image.small,
          large: content.image.large,
          medium: content.image.medium,
          xlarge: content.image.xlarge
        }
      },
      content.images,
      content.web_slug,
      content.publish_date,
      null
    );
  }

  public reportListing(itemId: number | string,
                       comments: string,
                       reason: number,
                       conversationId: number): Observable<any> {
    return this.http.post(this.API_URL + '/' + itemId + '/report', {
      comments: comments,
      reason: ITEM_BAN_REASONS[reason]
    });
  }

  public getPaginationItems(url: string, init, status?): Observable<ItemsData> {
    return this.http.get(url, {
      init: init,
      expired: status
    })
    .map((r: Response) => {
        const res: ItemResponse[] = r.json();
        const nextPage: string = r.headers.get('x-nextpage');
        const params = _.chain(nextPage).split('&')
          .map(_.partial(_.split, _, '=', 2))
          .fromPairs()
          .value();
        const nextInit: number = nextPage ? +params.init : null;
        let data: Item[] = [];
        if (res.length > 0) {
          data = res.map((i: ItemResponse) => {
            const item: Item = this.mapRecordData(i);
            item.views = i.content.views;
            item.favorites = i.content.favorites;
            return item;
          });
        }
        return {
          data: data,
          init: nextInit
        };
      }
    )
    .flatMap((itemsData: ItemsData) => {
      return this.getPurchases()
      .map((purchases: Purchase[]) => {
        purchases.forEach((purchase: Purchase) => {
          const index: number = _.findIndex(itemsData.data, {id: purchase.item_id});
          if (index !== -1) {
            itemsData.data[index].bumpExpiringDate = purchase.expiration_date;
            itemsData.data[index].flags.bumped = purchase.visibility_flags.bumped;
            itemsData.data[index].flags.highlighted = purchase.visibility_flags.highlighted;
            itemsData.data[index].flags.urgent = purchase.visibility_flags.urgent;
          }
        });
        return itemsData;
      });
    })
    .map((itemsData: ItemsData) => {
      this.selectedItems.forEach((selectedItemId: string) => {
        const index: number = _.findIndex(itemsData.data, {id: selectedItemId});
        if (index !== -1) {
          itemsData.data[index].selected = true;
        }
      });
      return itemsData;
    });
  }

  public mine(init: number, status?: string): Observable<ItemsData> {
    return this.getPaginationItems(this.API_URL_WEB + '/mine/' + status, init, true);
  }

  public myFavorites(init: number): Observable<ItemsData> {
    return this.getPaginationItems(this.API_URL_USER + '/me/items/favorites', init)
    .map((itemsData: ItemsData) => {
      itemsData.data = itemsData.data.map((item: Item) => {
        item.favorited = true;
        return item;
      });
      return itemsData;
    });
  }

  public deleteItem(id: string): Observable<any> {
    return this.http.delete(this.API_URL + '/' + id);
  }

  public reserveItem(id: string, reserve: boolean): Observable<any> {
    return this.http.put(this.API_URL + '/' + id + '/reserve', {
      reserved: reserve
    });
  }

  public reactivateItem(id: string): Observable<any> {
    return this.http.put(this.API_URL + '/' + id + '/reactivate');
  }

  public favoriteItem(id: string, favorited: boolean): Observable<any> {
    return this.http.put(this.API_URL + '/' + id + '/favorite', {
      favorited: favorited
    });
  }

  public bulkReserve(): Observable<ItemBulkResponse> {
    return this.http.put(this.API_URL + '/reserve', {
      ids: this.selectedItems
    })
    .map((r: Response) => r.json());
  }

  public soldOutside(id: string): Observable<any> {
    return this.http.put(this.API_URL + '/' + id + '/sold');
  }

  public getConversationUsers(id: string): Observable<ConversationUser[]> {
    return this.http.get(this.API_URL + '/' + id + '/conversation-users')
    .map((r: Response) => r.json());
  }

  public getAvailableProducts(id: string): Observable<Product> {
    return this.http.get(this.API_URL_WEB + '/' + id + '/available-visibility-products')
    .map((r: Response) => r.json())
    .map((response: AvailableProductsResponse) => response.products[0]);
  }

  public getAvailableReactivationProducts(id: string): Observable<Product> {
    return this.http.get(this.API_URL_WEB + '/' + id + '/available-reactivation-products')
    .map((r: Response) => r.json())
    .map((response: AvailableProductsResponse) => response.products[0]);
  }

  private getPurchases(): Observable<Purchase[]> {
    return this.http.get(this.API_URL_WEB + '/mine/purchases')
    .map((r: Response) => r.json());
  }

  public purchaseProducts(orderParams: Order[], orderId: string): Observable<string[]> {
    return this.http.post(this.API_URL_WEB + '/purchase/products/' + orderId, orderParams)
    .map((r: Response) => r.json());
  }

  public update(item: any): Observable<any> {
    const options: RequestOptions = new RequestOptions({headers: new Headers({'X-DeviceOS': '0'})});
    return this.http.put(this.API_URL + (item.category_id === '100' ? '/cars/' : '/') + item.id, item, options)
    .map((r: Response) => r.json());
  }

  public deletePicture(itemId: string, pictureId: string): Observable<any> {
    return this.http.delete(this.API_URL + '/' + itemId + '/picture/' + pictureId);
  }

  public get(id: string): Observable<Item> {
    return this.http.get(this.API_URL + `/${id}`)
    .map((r: Response) => r.json())
    .map((r: any) => this.mapRecordData(r))
    .catch(() => {
      return Observable.of(this.getFakeItem(id));
    });
  }

  public updatePicturesOrder(itemId: string, picturesOrder: { [fileId: string]: number }): Observable<any> {
    return this.http.put(this.API_URL + '/' + itemId + '/change-picture-order', {
      pictures_order: picturesOrder
    });
  }

  public getItemsWithAvailableProducts(ids: string[]): Observable<ItemWithProducts[]> {
    return this.http.get(this.API_URL_WEB + '/available-visibility-products', {
      itemsIds: ids.join(',')
    })
    .map((r: Response) => r.json())
    .map((res: ItemsWithAvailableProductsResponse[]) => {
      return res.map((i: ItemsWithAvailableProductsResponse) => {
        return {
          item: this.mapRecordData(i),
          products: this.getProductDurations(i.productList)
        };
      });
    });
  }

  private getActionsAllowed(id: string): Observable<AllowedActionResponse[]> {
    return this.http.get(this.API_URL + `/${id}/actions-allowed`)
    .map((r: Response) => r.json());
  }

  public canDoAction(action: string, id: string): Observable<boolean> {
    return this.getActionsAllowed(id)
    .map((actions: AllowedActionResponse[]) => {
      const canDo: AllowedActionResponse = _.find(actions, {type: action});
      if (canDo) {
        return canDo.allowed;
      }
      return false;
    });
  }

  private getProductDurations(productList: Product[]): ProductDurations {
    const durations: number[] = _.map(productList[0].durations, 'duration');
    const types: string[] = _.map(productList, 'name');
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
    const product: Product = _.find(productList, {name: type});
    return _.find(product.durations, {duration: duration});
  }

  public getUrgentProducts(itemId: string): Observable<Product> {
    return this.http.get(this.API_URL_WEB + '/' + itemId + '/available-urgent-products')
    .map((r: Response) => r.json())
    .map((response: AvailableProductsResponse) => response.products[0]);
  }

  public getUrgentProductByCategoryId(categoryId: string): Observable<Product> {
    return this.http.get(this.API_URL_WEB + '/available-urgent-products', {
      categoryId: categoryId
    })
      .map((r: Response) => r.json())
      .map((response: AvailableProductsResponse) => response.products[0]);
  }

  public cancelFeature(item: Item): Observable<any> {
    return this.http.put(this.API_URL + '/purchases/cancelItemPurchase', { itemIds: item.id });
  }

  public mines(pageNumber: number, pageSize: number, sortBy: string, status: string = 'active', term?: string, cache: boolean = true): Observable<Item[]> {
    let init: number = (pageNumber - 1) * pageSize;
    let end: number = init + pageSize;
    let endStatus: string = status === 'featured' ? 'active' : status;
    let observable: Observable<Item[]>;
    if (this.items[status].length && cache) {
      observable = Observable.of(this.items[status]);
    } else {
      observable = this.recursiveMines(0, 300, endStatus)
        .map((res: ItemProResponse[]) => {
          if (res.length > 0) {
            let items: Item[] = res
              .filter(res => (res.content.purchases && status === 'featured') || status !== 'featured')
              .map((i: ItemProResponse) => {
                const item: Item = this.mapRecordDataPro(i);
                item.views = i.content.views;
                item.favorites = i.content.favorites;
                item.conversations = i.content.conversations;
                item.purchases = i.content.purchases ? i.content.purchases : null;
                if (item.purchases) {
                  this.setPlannedPurchase(item);
                }
                return item;
            });
            this.items[status] = items;
            return items;
          }
          return [];
        });
    }
    return observable
      .map((res: Item[]) => {
        term = term ? term.trim().toLowerCase() : '';
        if (term !== '') {
          return _.filter(res, (item: Item) => {
            return item.title.toLowerCase().indexOf(term) !== -1 || item.description.toLowerCase().indexOf(term) !== -1;
          });
        }
        return res;
      })
      .map((res: Item[]) => {
        let sort: string[] = sortBy.split('_');
        let field: string = sort[0] === 'price' ? 'salePrice' : 'publishedDate';
        let sorted: Item[] = _.sortBy(res, [field]);
        if (sort[1] === 'desc') {
          return _.reverse(sorted);
        }
        return sorted;
      })
      .map((res: Item[]) => {
        return res.slice(init, end);
      });
  }

  private recursiveMines(init: number, offset: number, status?: string): Observable<ItemProResponse[]> {
    return this.http.get(this.API_URL_PROTOOL + '/mines', {
        status: ITEM_STATUSES[status],
        init: init,
        end: init + offset,
        newVersion: true
      })
      .map((r: Response) => r.json())
      .flatMap((res: ItemProResponse[]) => {
        if (res.length > 0) {
          return this.recursiveMines(init + offset, offset, status)
            .map((res2: ItemProResponse[]) => {
              return res.concat(res2);
            });
        } else {
          return Observable.of([]);
        }
      });
  }

  private setPlannedPurchase(item: Item): void {
    switch (item.purchases.bump_type) {
      case 'countrybump':
        this.plannedCountryPurchase++;
        break;
      case 'citybump':
        this.plannedCityPurchase++;
        break;
    }
  }
  
  public getItemAndSetPurchaseInfo(id: string, purchase: Purchase): Item {
    const index: number = _.findIndex(this.items.active, {id: id});
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
    return this.http.post(this.API_URL_PROTOOL + '/changeItemStatus', {
        itemIds: this.selectedItems,
        publishStatus: PUBLISHED_ID
      })
      .do(() => {
        this.selectedItems.forEach((id: string) => {
          let index: number = _.findIndex(this.items.pending, {'id': id});
          let deletedItem: Item = this.items.pending.splice(index, 1)[0];
          deletedItem.flags['onhold'] = false;
          deletedItem.selected = false;
          if (this.items.active.length) {
            this.items.active.push(deletedItem);
          }
        });
        this.eventService.emit('itemChangeStatus', this.selectedItems);
        this.deselectItems();
      }).catch((errorResponse: Response) => {
        return Observable.of(errorResponse);
      });
  }

  public bulkSetDeactivate(): Observable<any> {
    return this.http.post(this.API_URL_PROTOOL + '/changeItemStatus', {
        itemIds: this.selectedItems,
        publishStatus: ONHOLD_ID
      })
      .do(() => {
        this.selectedItems.forEach((id: string) => {
          let index: number = _.findIndex(this.items.active, {'id': id});
          let deletedItem: Item = this.items.active.splice(index, 1)[0];
          deletedItem.flags['onhold'] = true;
          deletedItem.selected = false;
          if (this.items.pending.length) {
            this.items.pending.push(deletedItem);
          }
        });
        this.eventService.emit('itemChangeStatus', this.selectedItems);
        this.deselectItems();
      });
  }

  public setSold(id: number): Observable<any> {
    return this.http.post(this.API_URL_V1 + '/item.json/' + id + '/sold')
      .do(() => {
        let index: number = _.findIndex(this.items.active, {'legacyId': id});
        let deletedItem: Item = this.items.active.splice(index, 1)[0];
        if (this.items.sold.length) {
          this.items.sold.push(deletedItem);
        }
        this.eventService.emit(EventService.ITEM_SOLD, deletedItem);
      });
  }

  public cancelAutorenew(itemId: string): Observable<any> {
    return this.http.put(this.API_URL_PROTOOL + '/autorenew/update', {
      item_id: itemId,
      autorenew: false
    });
  }

  public getLatest(userId: string): Observable<ItemDataResponse> {
    return this.http.get(this.API_URL + '/latest-cars', {userId: userId})
      .map((r: Response) => r.json())
      .map((resp: LatestItemResponse) => {
        return {
          count: resp.count - 1,
          data: resp.items[0] ? this.mapRecordData(resp.items[0]) : null
        };
      });
  }

}


