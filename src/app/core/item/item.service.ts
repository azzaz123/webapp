import { Injectable } from '@angular/core';
import { RequestOptions, Response, Headers } from '@angular/http';
import {
  EventService,
  HttpService,
  I18nService,
  Item,
  ItemBulkResponse,
  ItemService as ItemServiceMaster,
  UserService
} from 'shield';
import {
  AvailableProductsResponse,
  CarContent,
  ConversationUser, ItemContent, ItemResponse, ItemsData, ItemWithProducts,
  ItemsWithAvailableProductsResponse, Order, Product, Purchase,
  SelectedItemsAction
} from './item-response.interface';
import { Observable } from 'rxjs/Observable';
import { ITEM_BAN_REASONS } from './ban-reasons';
import * as _ from 'lodash';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { UUID } from 'angular2-uuid';
import { TrackingService } from '../tracking/tracking.service';
import { Car } from './car';

@Injectable()
export class ItemService extends ItemServiceMaster {

  protected API_URL_V2: string = 'api/v3/items';
  private API_URL_WEB: string = 'api/v3/web/items';
  private API_URL_v3_USER: string = 'api/v3/users';
  public selectedAction: string;
  public selectedItems$: ReplaySubject<SelectedItemsAction> = new ReplaySubject(1);

  constructor(http: HttpService,
              i18n: I18nService,
              trackingService: TrackingService,
              eventService: EventService,
              userService: UserService) {
    super(http, i18n, trackingService, eventService, userService);
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
    return this.http.post(this.API_URL_V3 + '/' + itemId + '/report', {
      comments: comments,
      reason: ITEM_BAN_REASONS[reason]
    });
  }

  public getPaginationItems(url: string, init): Observable<ItemsData> {
    return this.http.get(url, {
      init: init
    })
    .map((r: Response) => {
        const res: ItemResponse[] = r.json();
        const nextPage: string = r.headers.get('x-nextpage');
        const nextInit: number = nextPage ? +nextPage.replace('init=', '') : null;
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
        }
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
      })
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
    return this.getPaginationItems(this.API_URL_WEB + '/mine/' + status, init)
  }

  public myFavorites(init: number): Observable<ItemsData> {
    return this.getPaginationItems(this.API_URL_v3_USER + '/me/items/favorites', init)
    .map((itemsData: ItemsData) => {
      itemsData.data = itemsData.data.map((item: Item) => {
        item.favorited = true;
        return item;
      });
      return itemsData;
    })
  }

  public deleteItem(id: string): Observable<any> {
    return this.http.delete(this.API_URL_V3 + '/' + id);
  }

  public reserveItem(id: string, reserve: boolean): Observable<any> {
    return this.http.put(this.API_URL_V3 + '/' + id + '/reserve', {
      reserved: reserve
    });
  }

  public reactivateItem(id: string): Observable<any> {
    return this.http.put(this.API_URL_V3 + '/' + id + '/reactivate');
  }

  public favoriteItem(id: string, favorited: boolean): Observable<any> {
    return this.http.put(this.API_URL_V3 + '/' + id + '/favorite', {
      favorited: favorited
    });
  }

  public bulkReserve(): Observable<ItemBulkResponse> {
    return this.http.put(this.API_URL_V3 + '/reserve', {
      ids: this.selectedItems
    })
    .map((r: Response) => r.json());
  }

  public soldOutside(id: string): Observable<any> {
    return this.http.put(this.API_URL_V3 + '/' + id + '/sold');
  }

  public getConversationUsers(id: string): Observable<ConversationUser[]> {
    return this.http.get(this.API_URL_V3 + '/' + id + '/conversation-users')
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
    return this.http.put(this.API_URL_V3 + (item.category_id === '100' ? '/cars/' : '/') + item.id, item, options)
    .map((r: Response) => r.json());
  }

  public deletePicture(itemId: string, pictureId: string): Observable<any> {
    return this.http.delete(this.API_URL_V3 + '/' + itemId + '/picture/' + pictureId);
  }

  public get(id: string): Observable<Item> {
    return this.http.get(this.API_URL_V3 + `/${id}`)
    .map((r: Response) => r.json())
    .map((r: any) => this.mapRecordData(r))
    .catch(() => {
      return Observable.of(this.getFakeItem(id));
    });
  }

  public updatePicturesOrder(itemId: string, picturesOrder: { [fileId: string]: number }): Observable<any> {
    return this.http.put(this.API_URL_V3 + '/' + itemId + '/change-picture-order', {
      pictures_order: picturesOrder
    });
  }

  public getItemsWithAvailableProducts(ids: string[]): Observable<ItemWithProducts[]> {
    return Observable.of([
      {
        'id': 'p1k3zlgqjxdy',
        'type': 'consumer_goods',
        'content': {
          'id': 'p1k3zlgqjxdy',
          'title': 'iphone 6 delete me please',
          'description': 'TQA-441',
          'category_id': 13200,
          'image': {
            'original': 'http://dock112.wallapop.com:8080/shnm-portlet/images?pictureId=220&pictureSize=W800',
            'xsmall': 'http://dock112.wallapop.com:8080/shnm-portlet/images?pictureId=220&pictureSize=W320',
            'small': 'http://dock112.wallapop.com:8080/shnm-portlet/images?pictureId=220&pictureSize=W320',
            'large': 'http://dock112.wallapop.com:8080/shnm-portlet/images?pictureId=220&pictureSize=W800',
            'medium': 'http://dock112.wallapop.com:8080/shnm-portlet/images?pictureId=220&pictureSize=W640',
            'xlarge': 'http://dock112.wallapop.com:8080/shnm-portlet/images?pictureId=220&pictureSize=W800',
            'original_width': 200,
            'original_height': 200
          },
          'seller_id': 'l1kmzn82zn3p',
          'flags': {
            'pending': false,
            'sold': false,
            'reserved': false,
            'banned': false,
            'expired': false,
            'bumped': false,
            'highlighted': false,
            'urgent': false
          },
          'sale_price': 586.4,
          'currency_code': 'GBP',
          'modified_date': 1456221079000,
          'publish_date': 1456220960000,
          'web_slug': 'iphone-6-delete-me-please-69',
          'views': 0,
          'favorites': 0
        },
        'productList': [
          {
            'id': 'l1kmzng6n3p8',
            'name': 'zonebump',
            'features': [
              'slider'
            ],
            'default_duration_index': 0,
            'durations': [
              {
                'id': 'l1kmzngg6n3p',
                'duration': 24,
                'market_code': '2.39',
                'original_market_code': '2.99',
                'is_free': false
              },
              {
                'id': 'l1kmzngg6n3p',
                'duration': 72,
                'market_code': '2.39',
                'original_market_code': '2.99',
                'is_free': false
              },
              {
                'id': 'l1kmzngg6n3p',
                'duration': 168,
                'market_code': '2.39',
                'original_market_code': '2.99',
                'is_free': false
              }
            ]
          },
          {
            'id': 'l1kmzng6n3p8',
            'name': 'citybump',
            'features': [
              'slider'
            ],
            'default_duration_index': 0,
            'durations': [
              {
                'id': 'l1kmzngg6n3p',
                'duration': 24,
                'market_code': '2.39',
                'original_market_code': '2.99',
                'is_free': false
              },
              {
                'id': 'l1kmzngg6n3p',
                'duration': 72,
                'market_code': '2.39',
                'original_market_code': '2.99',
                'is_free': false
              },
              {
                'id': 'l1kmzngg6n3p',
                'duration': 168,
                'market_code': '2.39',
                'original_market_code': '2.99',
                'is_free': false
              }
            ]
          },
          {
            'id': 'l1kmzng6n3p8',
            'name': 'countrybump',
            'features': [
              'slider'
            ],
            'default_duration_index': 0,
            'durations': [
              {
                'id': 'l1kmzngg6n3p',
                'duration': 24,
                'market_code': '2.39',
                'original_market_code': '2.99',
                'is_free': false
              },
              {
                'id': 'l1kmzngg6n3p',
                'duration': 72,
                'market_code': '2.39',
                'original_market_code': '2.99',
                'is_free': false
              },
              {
                'id': 'l1kmzngg6n3p',
                'duration': 168,
                'market_code': '2.39',
                'original_market_code': '2.99',
                'is_free': false
              }
            ]
          }
        ]
      },
      {
        'id': 'l1kmznp06n3p',
        'type': 'consumer_goods',
        'content': {
          'id': 'l1kmznp06n3p',
          'title': 'Product published to set sold',
          'description': 'Bvlgari',
          'category_id': 12465,
          'image': {
            'original': 'http://dock112.wallapop.com:8080/shnm-portlet/images?pictureId=168&pictureSize=W800',
            'xsmall': 'http://dock112.wallapop.com:8080/shnm-portlet/images?pictureId=168&pictureSize=W320',
            'small': 'http://dock112.wallapop.com:8080/shnm-portlet/images?pictureId=168&pictureSize=W320',
            'large': 'http://dock112.wallapop.com:8080/shnm-portlet/images?pictureId=168&pictureSize=W800',
            'medium': 'http://dock112.wallapop.com:8080/shnm-portlet/images?pictureId=168&pictureSize=W640',
            'xlarge': 'http://dock112.wallapop.com:8080/shnm-portlet/images?pictureId=168&pictureSize=W800',
            'original_width': 200,
            'original_height': 200
          },
          'seller_id': 'l1kmzn82zn3p',
          'flags': {
            'pending': false,
            'sold': false,
            'reserved': false,
            'banned': false,
            'expired': false,
            'bumped': false,
            'highlighted': false,
            'urgent': false
          },
          'sale_price': 40,
          'currency_code': 'EUR',
          'modified_date': 1429351278000,
          'publish_date': 1429179298000,
          'web_slug': 'product-published-to-set-sold-273',
          'views': 0,
          'favorites': 0
        },
        'productList': [
          {
            'id': 'l1kmzng6n3p8',
            'name': 'zonebump',
            'features': [
              'slider'
            ],
            'default_duration_index': 0,
            'durations': [
              {
                'id': 'l1kmzngg6n3p',
                'duration': 24,
                'market_code': '2.39',
                'original_market_code': '2.99',
                'is_free': false
              },
              {
                'id': 'l1kmzngg6n3p',
                'duration': 72,
                'market_code': '2.39',
                'original_market_code': '2.99',
                'is_free': false
              },
              {
                'id': 'l1kmzngg6n3p',
                'duration': 168,
                'market_code': '2.39',
                'original_market_code': '2.99',
                'is_free': false
              }
            ]
          },
          {
            'id': 'l1kmzng6n3p8',
            'name': 'citybump',
            'features': [
              'slider'
            ],
            'default_duration_index': 0,
            'durations': [
              {
                'id': 'l1kmzngg6n3p',
                'duration': 24,
                'market_code': '2.39',
                'original_market_code': '2.99',
                'is_free': false
              },
              {
                'id': 'l1kmzngg6n3p',
                'duration': 72,
                'market_code': '2.39',
                'original_market_code': '2.99',
                'is_free': false
              },
              {
                'id': 'l1kmzngg6n3p',
                'duration': 168,
                'market_code': '2.39',
                'original_market_code': '2.99',
                'is_free': false
              }
            ]
          },
          {
            'id': 'l1kmzng6n3p8',
            'name': 'countrybump',
            'features': [
              'slider'
            ],
            'default_duration_index': 0,
            'durations': [
              {
                'id': 'l1kmzngg6n3p',
                'duration': 24,
                'market_code': '2.39',
                'original_market_code': '2.99',
                'is_free': false
              },
              {
                'id': 'l1kmzngg6n3p',
                'duration': 72,
                'market_code': '2.39',
                'original_market_code': '2.99',
                'is_free': false
              },
              {
                'id': 'l1kmzngg6n3p',
                'duration': 168,
                'market_code': '2.39',
                'original_market_code': '2.99',
                'is_free': false
              }
            ]
          }
        ]
      }])
    .map((res: ItemsWithAvailableProductsResponse[]) => {
      return res.map((i: ItemsWithAvailableProductsResponse) => {
        return {
          item: this.mapRecordData(i),
          product: i.productList
        };
      });
    });
  }

}
