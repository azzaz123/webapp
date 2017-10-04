import { TestBed } from '@angular/core/testing';
import {
  EventService,
  HttpService,
  I18nService,
  ITEM_ID,
  TEST_HTTP_PROVIDERS,
  TrackingService,
  UserService,
  Item,
  ITEM_BASE_PATH,
  ITEMS_BULK_UPDATED_IDS,
  ITEMS_BULK_RESPONSE
} from 'shield';

import { ItemService } from './item.service';
import { Observable } from 'rxjs/Observable';
import { CONVERSATION_USERS, ITEM_DATA_V3, ITEMS_DATA_V3 } from '../../../tests/item.fixtures';
import { ResponseOptions, Response, Headers } from '@angular/http';
import { ConversationUser, ItemsData } from './item-response.interface';

describe('ItemService', () => {

  let service: ItemService;
  let http: HttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ItemService,
        ...TEST_HTTP_PROVIDERS,
        {provide: I18nService, useValue: {}},
        {provide: TrackingService, useValue: {}},
        {provide: EventService, useValue: {}},
        {provide: UserService, useValue: {}},
      ]
    });
    service = TestBed.get(ItemService);
    http = TestBed.get(HttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('mapRecordData', () => {
    it('should map item data', () => {
      const item: Item = service['mapRecordData'](ITEM_DATA_V3);
      expect(item instanceof Item).toBeTruthy();
      expect(item.id).toBe(ITEM_DATA_V3.id);
      expect(item.title).toBe(ITEM_DATA_V3.content.title);
      expect(item.description).toBe(ITEM_DATA_V3.content.description);
      expect(item.categoryId).toBe(ITEM_DATA_V3.content.category_id);
      expect(item.salePrice).toBe(ITEM_DATA_V3.content.sale_price);
      expect(item.currencyCode).toBe(ITEM_DATA_V3.content.currency_code);
      expect(item.modifiedDate).toBe(ITEM_DATA_V3.content.modified_date);
      expect(item.url).toBe(ITEM_DATA_V3.content.url);
      expect(item.flags).toEqual(ITEM_DATA_V3.content.flags);
      expect(item.saleConditions).toEqual(ITEM_DATA_V3.content.sale_conditions);
      expect(item.mainImage).toEqual(ITEM_DATA_V3.content.images[0]);
      expect(item.images).toEqual(ITEM_DATA_V3.content.images);
      expect(item.webLink).toEqual(ITEM_BASE_PATH + ITEM_DATA_V3.content.web_slug);
    });
  });

  describe('reportListing', () => {
    it('should call endpoint', () => {
      spyOn(http, 'post').and.returnValue(Observable.of({}));
      service.reportListing(ITEM_ID, 'comments', 2, 2);
      expect(http.post).toHaveBeenCalledWith(
        'api/v3/items/' + ITEM_ID + '/report',
        {
          comments: 'comments',
          reason: 'people_or_animals'
        }
      )
    });
  });

  describe('mine', () => {
    let resp: ItemsData;
    beforeEach(() => {
      const res: ResponseOptions = new ResponseOptions({
        body: JSON.stringify(ITEMS_DATA_V3),
        headers: new Headers({'x-nextpage': 'init=20'})
      });
      spyOn(http, 'get').and.returnValue(Observable.of(new Response(res)));
    });
    it('should call endpoint', () => {
      service.mine(10, 'published').subscribe((data: ItemsData) => {
        resp = data;
      });
      expect(http.get).toHaveBeenCalledWith('api/v3/web/items/mine/published', {
        init: 10
      })
    });
    it('should return an array of items and the init', () => {
      service.mine(0, 'published').subscribe((data: ItemsData) => {
        resp = data;
      });
      expect(resp.data.length).toBe(2);
      const item = resp.data[0];
      expect(item.id).toBe(ITEMS_DATA_V3[0].id);
      expect(item.title).toBe(ITEMS_DATA_V3[0].content.title);
      expect(item.description).toBe(ITEMS_DATA_V3[0].content.description);
      expect(item.salePrice).toBe(ITEMS_DATA_V3[0].content.sale_price);
      expect(item.currencyCode).toBe(ITEMS_DATA_V3[0].content.currency_code);
      expect(item.modifiedDate).toBe(ITEMS_DATA_V3[0].content.modified_date);
      expect(item.flags).toEqual(ITEMS_DATA_V3[0].content.flags);
      expect(item.mainImage).toEqual(ITEMS_DATA_V3[0].content.image);
      expect(item.webLink).toEqual(ITEM_BASE_PATH + ITEMS_DATA_V3[0].content.web_slug);
      expect(resp.init).toBe(20);
    });
  });

  describe('deleteItem', () => {
    it('should call endpoint', () => {
      spyOn(http, 'delete').and.returnValue(Observable.of({}));
      service.deleteItem(ITEM_ID);
      expect(http.delete).toHaveBeenCalledWith('api/v3/items/' + ITEM_ID);
    });
  });

  describe('reactivateItem', () => {
    it('should call endpoint', () => {
      spyOn(http, 'put').and.returnValue(Observable.of({}));
      service.reactivateItem(ITEM_ID);
      expect(http.put).toHaveBeenCalledWith('api/v3/items/' + ITEM_ID + '/reactivate');
    });
  });

  describe('bulkReserve', () => {
    it('should call endpoint', () => {
      const res: ResponseOptions = new ResponseOptions({body: JSON.stringify(ITEMS_BULK_RESPONSE)});
      spyOn(http, 'put').and.returnValue(Observable.of(new Response(res)));
      service.selectedItems = ITEMS_BULK_UPDATED_IDS;
      service.bulkReserve();
      expect(http.put).toHaveBeenCalledWith('api/v3/items/reserve', {
        ids: ITEMS_BULK_UPDATED_IDS
      });
    });
  });

  describe('soldOutside', () => {
    it('should call endpoint', () => {
      spyOn(http, 'put').and.returnValue(Observable.of({}));
      service.soldOutside(ITEM_ID);
      expect(http.put).toHaveBeenCalledWith('api/v3/items/' + ITEM_ID + '/sold');
    });
  });

  describe('getConversationUsers', () => {
    it('should call endpoint', () => {
      const res: ResponseOptions = new ResponseOptions({body: JSON.stringify(CONVERSATION_USERS)});
      spyOn(http, 'get').and.returnValue(Observable.of(new Response(res)));
      let resp: ConversationUser[];
      service.getConversationUsers(ITEM_ID).subscribe((r: ConversationUser[]) => {
        resp = r;
      });
      expect(http.get).toHaveBeenCalledWith('api/v3/items/' + ITEM_ID + '/conversation-users');
      expect(resp).toEqual(CONVERSATION_USERS)
    });
  });

});
