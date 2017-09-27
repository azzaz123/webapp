import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import {
  EventService,
  HttpService,
  I18nService,
  Item,
  ItemService as ItemServiceMaster,
  TrackingService,
  UserService,
  ItemBulkResponse
} from 'shield';
import { ConversationUser, ItemContent, ItemResponse, ItemsData } from './item-response.interface';
import { Observable } from 'rxjs/Observable';
import { ITEM_BAN_REASONS } from './ban-reasons';

@Injectable()
export class ItemService extends ItemServiceMaster {

  protected API_URL_V2: string = 'api/v3/items';
  private API_URL_WEB: string = 'api/v3/web/items';

  constructor(http: HttpService,
              i18n: I18nService,
              trackingService: TrackingService,
              eventService: EventService,
              userService: UserService) {
    super(http, i18n, trackingService, eventService, userService);
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
      content.sale_price,
      content.currency_code,
      content.modified_date,
      content.url,
      content.flags,
      null,
      content.sale_conditions,
      content.images ? content.images[0] : content.image,
      content.images,
      content.web_slug,
      content.modified_date
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

  public mine(init: number, status?: string): Observable<ItemsData> {
    return this.http.get(this.API_URL_WEB + '/mine/' + status, {
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
    );
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

}
