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
  SelectedItemsAction
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

@Injectable()
export class ItemService extends ResourceService {

  protected API_URL = 'api/v3/items';
  private API_URL_WEB = 'api/v3/web/items';
  private API_URL_USER = 'api/v3/users';
  public selectedAction: string;
  public selectedItems$: ReplaySubject<SelectedItemsAction> = new ReplaySubject(1);
  private banReasons: BanReason[] = null;
  protected items: ItemsStore = {
    active: [],
    sold: []
  };
  public selectedItems: string[] = [];

  constructor(http: HttpService,
              private i18n: I18nService,
              private trackingService: TrackingService,
              private eventService: EventService,
              private userService: UserService) {
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

  public getLatest(userId: string): Observable<ItemDataResponse> {
    return this.http.get(this.API_URL + '/latest', {userId: userId})
      .map((r: Response) => r.json())
      .map((resp: LatestItemResponse) => {
        return {
          count: resp.count - 1,
          data: resp.items[0] ? this.mapRecordData(resp.items[0]) : null
        };
      });
  }

}


