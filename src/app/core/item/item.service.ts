import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import {
  EventService,
  HttpService,
  I18nService,
  Item,
  ItemService as ItemServiceMaster,
  TrackingService,
  UserService
} from 'shield';
import { ItemContent, ItemResponse } from './item-response.interface';
import { Observable } from 'rxjs/Observable';
import { ITEM_BAN_REASONS } from './ban-reasons';

@Injectable()
export class ItemService extends ItemServiceMaster {

  protected API_URL_V2: string = 'api/v3/items';

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
      content.images[0],
      content.images,
      content.web_slug,
      content.modified_date
    );
  }

  protected mapRecordItems(response: any): Item {
    const data: ItemResponse = <ItemResponse>response;
    const content: any = data.content;
    return new Item(
      content.id,
      null,
      content.user.id, // content.seller_id
      content.title,
      content.description,
      null, // content.category_id,
      null,
      content.price, // content.sale_price
      content.currency, // content.currency_code
      null, // content.modified_date,
      null, // content.url,
      content.flags,
      null,
      null, // content.sale_conditions,
      content.image ? {
        id: '',
        original_width: content.image.original_width,
        original_height: content.image.original_height,
        average_hex_color: '',
        urls_by_size: {
          original: content.image.original,
          small: content.image.small,
          large: content.image.large,
          medium: content.image.medium,
          xlarge: content.image.xlarge,
        }
      } : null,  // content.images[0]
      null, // content.images,
      null, // content.web_slug,
      null // content.modified_date
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

  public mine(pageNumber: number, status?: string): Observable<Item[]> {
    const pageSize: number = 40;
    const init: number = (pageNumber - 1) * pageSize;
    const end: number = init + pageSize;
    return this.http.get('api/v3/users/me/items/' + status, {
      init: init
    })
      .map((r: Response) => r.json())
      .map((res: ItemResponse[]) => {
        if (res.length > 0) {
          return res.map((item: ItemResponse) => this.mapRecordItems(item));
        }
        return [];
      });

  }

  public deleteItem(id: string): Observable<any> {
    return this.http.delete(this.API_URL_V3 + '/' + id);
  }

  public reserveItem(id: string, reserve: boolean): Observable<any> {
    return this.http.put(this.API_URL_V3 + '/' + id + '/reserve', {
      reserved: reserve
    });
  }

}
