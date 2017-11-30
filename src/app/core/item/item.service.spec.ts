import { TestBed } from '@angular/core/testing';
import {
  EventService,
  HttpService,
  I18nService,
  ITEM_ID,
  TEST_HTTP_PROVIDERS,
  UserService,
  Item,
  ITEM_BASE_PATH,
  ITEMS_BULK_UPDATED_IDS,
  ITEMS_BULK_RESPONSE
} from 'shield';

import { ItemService } from './item.service';
import { Observable } from 'rxjs/Observable';
import {
  CONVERSATION_USERS, ITEM_DATA_V3, ITEMS_DATA_V3, ORDER, PRODUCT_RESPONSE,
  PURCHASES, ITEMS_DATA_v3_FAVORITES
} from '../../../tests/item.fixtures';
import { ResponseOptions, Response, Headers } from '@angular/http';
import { ConversationUser, ItemsData, Product } from './item-response.interface';
import { UUID } from 'angular2-uuid';
import { TrackingService } from '../tracking/tracking.service';

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

  describe('selectItem', () => {
    let event;
    beforeEach(() => {
      service.selectedItems$.subscribe((e) => {
        event = e;
      });
      service.selectItem('1');
    });
    it('should push id into selectedItems', () => {
      expect(service.selectedItems[0]).toBe('1');
    });
    it('should emit event', () => {
      expect(event).toEqual({
        id: '1',
        action: 'selected'
      })
    });
  });

  describe('deselectItem', () => {
    let event;
    beforeEach(() => {
      service.selectedItems = ['1', '2'];
      service.selectedItems$.subscribe((e) => {
        event = e;
      });
      service.deselectItem('1');
    });
    it('should remove id from selectedItems', () => {
      expect(service.selectedItems.length).toBe(1);
      expect(service.selectedItems[0]).toBe('2');
    });
    it('should emit event', () => {
      expect(event).toEqual({
        id: '1',
        action: 'deselected'
      })
    });
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

    it('should map item data with price equal 0', () => {
      const ITEM_WITH_PRICE_ZERO = {
        id: ITEM_DATA_V3.id,
        content: {
          ...ITEM_DATA_V3.content,
          sale_price: 0
        }
      };
      const item: Item = service['mapRecordData'](ITEM_WITH_PRICE_ZERO);

      expect(item instanceof Item).toBeTruthy();
      expect(item.salePrice).toBe(0);
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
    describe('no purchases', () => {
      beforeEach(() => {
        const res: ResponseOptions = new ResponseOptions({
          body: JSON.stringify(ITEMS_DATA_V3),
          headers: new Headers({'x-nextpage': 'init=20'})
        });
        const res2: ResponseOptions = new ResponseOptions({
          body: JSON.stringify([])
        });
        spyOn(http, 'get').and.returnValues(Observable.of(new Response(res)), Observable.of(new Response(res2)));
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
        spyOn(UUID, 'UUID').and.returnValue('1');
        service.mine(0, 'published').subscribe((data: ItemsData) => {
          resp = data;
        });
        expect(resp.data.length).toBe(4);
        const item = resp.data[0];
        expect(item.id).toBe(ITEMS_DATA_V3[0].id);
        expect(item.title).toBe(ITEMS_DATA_V3[0].content.title);
        expect(item.description).toBe(ITEMS_DATA_V3[0].content.description);
        expect(item.salePrice).toBe(ITEMS_DATA_V3[0].content.sale_price);
        expect(item.currencyCode).toBe(ITEMS_DATA_V3[0].content.currency_code);
        expect(item.modifiedDate).toBe(ITEMS_DATA_V3[0].content.modified_date);
        expect(item.flags).toEqual(ITEMS_DATA_V3[0].content.flags);
        expect(item.mainImage).toEqual({
          id: '1',
          original_width: ITEMS_DATA_V3[0].content.image.original_width,
          original_height: ITEMS_DATA_V3[0].content.image.original_height,
          average_hex_color: '',
          urls_by_size: ITEMS_DATA_V3[0].content.image
        });
        expect(item.webLink).toEqual(ITEM_BASE_PATH + ITEMS_DATA_V3[0].content.web_slug);
        expect(item.bumpExpiringDate).toBeUndefined();
        expect(resp.init).toBe(20);
      });
    });
    describe('with purchases', () => {
      beforeEach(() => {
        const res: ResponseOptions = new ResponseOptions({
          body: JSON.stringify(ITEMS_DATA_V3),
          headers: new Headers({'x-nextpage': 'init=20'})
        });
        const res2: ResponseOptions = new ResponseOptions({
          body: JSON.stringify(PURCHASES)
        });
        spyOn(http, 'get').and.returnValues(Observable.of(new Response(res)), Observable.of(new Response(res2)));
        service.mine(0, 'published').subscribe((data: ItemsData) => {
          resp = data;
        });
      });
      it('should call purchases', () => {
        expect(http.get).toHaveBeenCalledWith('api/v3/web/items/mine/purchases');
      });
      it('should set purchased data to featured items', () => {
        expect(resp.data[0].bumpExpiringDate).toBe(1510221655715);
        expect(resp.data[0].flags.highlighted).toBeTruthy();
        expect(resp.data[2].bumpExpiringDate).toBe(1509874085135);
        expect(resp.data[2].flags.bumped).toBeTruthy();
      });
    });
  });

  describe('myFavorites', () => {
    let resp: ItemsData;
    beforeEach(() => {
      const res: ResponseOptions = new ResponseOptions({
        body: JSON.stringify(ITEMS_DATA_v3_FAVORITES),
        headers: new Headers({'x-nextpage': 'init=20'})
      });
      spyOn(http, 'get').and.returnValue(Observable.of(new Response(res)));
    });
    it('should call endpoint', () => {
      service.myFavorites(10).subscribe((data: ItemsData) => {
        resp = data;
      });
      expect(http.get).toHaveBeenCalledWith('api/v3/users/me/items/favorites', {
        init: 10
      })
    });
    it('should return an array of items and the init', () => {
      spyOn(UUID, 'UUID').and.returnValue('1');
      service.myFavorites(0).subscribe((data: ItemsData) => {
        resp = data;
      });
      expect(resp.data.length).toBe(2);
      const item = resp.data[0];
      expect(item.id).toBe(ITEMS_DATA_v3_FAVORITES[0].id);
      expect(item.favorited).toBe(true);
      expect(item.title).toBe(ITEMS_DATA_v3_FAVORITES[0].content.title);
      expect(item.description).toBe(ITEMS_DATA_v3_FAVORITES[0].content.description);
      expect(item.salePrice).toBe(ITEMS_DATA_v3_FAVORITES[0].content.price);
      expect(item.currencyCode).toBe(ITEMS_DATA_v3_FAVORITES[0].content.currency);
      expect(item.flags).toEqual(ITEMS_DATA_v3_FAVORITES[0].content.flags);
      expect(item.mainImage).toEqual({
        id: '1',
        original_width: ITEMS_DATA_v3_FAVORITES[0].content.image.original_width,
        original_height: ITEMS_DATA_v3_FAVORITES[0].content.image.original_height,
        average_hex_color: '',
        urls_by_size: ITEMS_DATA_v3_FAVORITES[0].content.image
      });
      expect(resp.init).toBe(20);
    });
  });

  describe('favoriteItem', () => {
    it('should call endpoint, with favorited param false', () => {
      const favorited = false;
      spyOn(http, 'put').and.returnValue(Observable.of({}));
      service.favoriteItem(ITEM_ID, favorited);
      expect(http.put).toHaveBeenCalledWith('api/v3/items/' + ITEM_ID + '/favorite', {favorited});
    });

    it('should call endpoint, with favorited param true', () => {
      const favorited = true;
      spyOn(http, 'put').and.returnValue(Observable.of({}));
      service.favoriteItem(ITEM_ID, favorited);
      expect(http.put).toHaveBeenCalledWith('api/v3/items/' + ITEM_ID + '/favorite', {favorited});
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

  describe('getAvailableProducts', () => {
    it('should call endpoint', () => {
      const res: ResponseOptions = new ResponseOptions({body: JSON.stringify(PRODUCT_RESPONSE)});
      spyOn(http, 'get').and.returnValue(Observable.of(new Response(res)));
      let resp: Product;
      service.getAvailableProducts(ITEM_ID).subscribe((r: Product) => {
        resp = r;
      });
      expect(http.get).toHaveBeenCalledWith('api/v3/web/items/' + ITEM_ID + '/available-products');
      expect(resp).toEqual(PRODUCT_RESPONSE)
    });
  });

  describe('purchaseProducts', () => {
    it('should call endpoint', () => {
      const res: ResponseOptions = new ResponseOptions({body: JSON.stringify(['1234'])});
      spyOn(http, 'post').and.returnValue(Observable.of(new Response(res)));
      let resp: string[];
      service.purchaseProducts([ORDER], 'UUID').subscribe((r: string[]) => {
        resp = r;
      });
      expect(http.post).toHaveBeenCalledWith('api/v3/web/items/purchase/products/UUID', [ORDER]);
      expect(resp).toEqual(['1234'])
    });
  });

});
