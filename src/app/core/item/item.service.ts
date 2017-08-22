import { Injectable } from '@angular/core';
import { ItemService as ItemServiceMaster, HttpService, I18nService, TrackingService, EventService, UserService, Item } from 'shield';
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

  public reportListing(itemId: number | string,
                       comments: string,
                       reason: number,
                       conversationId: number): Observable<any> {
    return this.http.post(this.API_URL_V3 + '/' + itemId + '/report', {
      comments: comments,
      reason: ITEM_BAN_REASONS[reason]
    });
  }

}
