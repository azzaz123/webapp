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
import { ITEM_DATA_V3 } from '../../../tests/item.fixtures';

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
      service.reportListing(ITEM_ID, 'comments', 1, 2);
      expect(http.post).toHaveBeenCalledWith(
        'api/v3/items/' + ITEM_ID + '/report',
        {
          comments: 'comments',
          reason: 'people_or_animals'
        }
      )
    });
  });
});
