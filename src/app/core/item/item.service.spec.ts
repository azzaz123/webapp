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
  ITEM_BASE_PATH
} from 'shield';

import { ItemService } from './item.service';
import { Observable } from 'rxjs/Observable';
import { ITEM_DATA_V3, ITEMS_DATA_V3 } from '../../../tests/item.fixtures';
import { ResponseOptions, Response } from '@angular/http';

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
    let resp: Item[];
    beforeEach(() => {
      const res: ResponseOptions = new ResponseOptions({body: JSON.stringify(ITEMS_DATA_V3)});
      spyOn(http, 'get').and.returnValue(Observable.of(new Response(res)));
    });
    it('should call endpoint', () => {
      service.mine(1, 'published').subscribe((data: Item[]) => {
        resp = data;
      });
      expect(http.get).toHaveBeenCalledWith('api/v3/users/me/items/published', {
        init: 0
      })
    });
    it('should return an array of items', () => {
      service.mine(1, 'published').subscribe((data: Item[]) => {
        resp = data;
      });
      expect(resp.length).toBe(2);
      const item = resp[0];
      expect(item instanceof Item).toBeTruthy();
      expect(item.id).toBe(ITEMS_DATA_V3[0].id);
      expect(item.title).toBe(ITEMS_DATA_V3[0].content.title);
      expect(item.description).toBe(ITEMS_DATA_V3[0].content.description);
      expect(item.salePrice).toBe(ITEMS_DATA_V3[0].content.price);
      expect(item.currencyCode).toBe(ITEMS_DATA_V3[0].content.currency);
      expect(item.flags).toEqual(ITEMS_DATA_V3[0].content.visibility_flags);
      expect(item.mainImage).toEqual({
        id: '',
        original_width: ITEMS_DATA_V3[0].content.image.original_width,
        original_height: ITEMS_DATA_V3[0].content.image.original_height,
        average_hex_color: '',
        urls_by_size: {
          original: ITEMS_DATA_V3[0].content.image.original,
          small: ITEMS_DATA_V3[0].content.image.small,
          large: ITEMS_DATA_V3[0].content.image.large,
          medium: ITEMS_DATA_V3[0].content.image.medium,
          xlarge: ITEMS_DATA_V3[0].content.image.xlarge,
        }
      });
    });
  });

});
