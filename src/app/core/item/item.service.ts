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
  ConversationUser, ItemContent, ItemResponse, ItemsData, Order, Product, Purchase,
  SelectedItemsAction
} from './item-response.interface';
import { Observable } from 'rxjs/Observable';
import { ITEM_BAN_REASONS } from './ban-reasons';
import * as _ from 'lodash';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { UUID } from 'angular2-uuid';
import { TrackingService } from '../tracking/tracking.service';

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
    return this.http.get(this.API_URL_WEB + '/' + id + '/available-products')
    .map((r: Response) => r.json());
  }

  private getPurchases(): Observable<Purchase[]> {
    return this.http.get(this.API_URL_WEB + '/mine/purchases')
    .map((r: Response) => r.json());
  }

  public purchaseProducts(orderParams: Order[], orderId: string): Observable<string[]> {
    return this.http.post(this.API_URL_WEB + '/purchase/products/' + orderId, orderParams)
    .map((r: Response) => r.json());
  }

  public update(item: any): Observable<Item> {
    return this.http.put(this.API_URL_V3 + '/' + item.id, item)
    .map((r: Response) => r.json())
    .map((r: any) => this.mapRecordData(r));
  }

  public deletePicture(itemId: string, pictureId: string): Observable<any> {
    return this.http.delete(this.API_URL_V3 + '/' + itemId + '/picture/' + pictureId);
  }

  public get(id: string): Observable<Item> {
    return this.http.get(this.API_URL_V3 + `/${id}`)
    .map((r: Response) => r.json())
    .map((r: any) => this.mapRecordData(r));
  }

  public updatePicturesOrder(itemId: string, picturesOrder: {[fileId: string]: number}): Observable<any> {
    return this.http.put(this.API_URL_V3 + '/' + itemId + '/change-picture-order', {
      pictures_order: picturesOrder
    });
  }

}
