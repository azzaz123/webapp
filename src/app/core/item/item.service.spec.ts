/* tslint:disable:no-unused-variable */

import { fakeAsync, TestBed } from '@angular/core/testing';
import { ItemService } from './item.service';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { Headers, RequestMethod, RequestOptions, Response, ResponseOptions } from '@angular/http';
import {
  ACTIONS_ALLOWED_CAN_MARK_SOLD_RESPONSE,
  ACTIONS_ALLOWED_CANNOT_MARK_SOLD_RESPONSE,
  CONVERSATION_USERS,
  createItemsArray,
  ITEM_CATEGORY_ID,
  ITEM_COUNTERS_DATA,
  ITEM_DATA,
  ITEM_DATA_V3,
  ITEM_FAVORITES,
  ITEM_ID,
  ITEM_VIEWS,
  ITEMS_BULK_FAILED_IDS,
  ITEMS_BULK_RESPONSE,
  ITEMS_BULK_RESPONSE_FAILED,
  ITEMS_BULK_UPDATED_IDS,
  ITEMS_DATA_V3,
  ITEMS_DATA_v3_FAVORITES,
  ITEMS_WITH_AVAILABLE_PRODUCTS_RESPONSE,
  ITEMS_WITH_PRODUCTS,
  ORDER,
  PRODUCT_RESPONSE,
  PRODUCTS_RESPONSE,
  PURCHASES
} from '../../../tests/item.fixtures.spec';
import { Item, ITEM_BASE_PATH } from './item';
import { Observable } from 'rxjs/Observable';
import {
  ConversationUser,
  ItemBulkResponse,
  ItemCounters,
  ItemsData,
  ItemWithProducts,
  Product
} from './item-response.interface';
import { MOCK_USER } from '../../../tests/user.fixtures.spec';
import { HttpService } from '../http/http.service';
import { I18nService } from '../i18n/i18n.service';
import { UUID } from 'angular2-uuid';
import { TrackingService } from '../tracking/tracking.service';
import { MockTrackingService } from '../../../tests/tracking.fixtures.spec';
import { EventService } from '../event/event.service';
import { UserService } from '../user/user.service';
import { environment } from '../../../environments/environment';
import { TEST_HTTP_PROVIDERS } from '../../../tests/utils.spec';
import { CAR_ID, UPLOAD_FILE_ID } from '../../../tests/upload.fixtures.spec';
import { CAR_DATA, CAR_DATA_FORM, MOCK_CAR } from '../../../tests/car.fixtures.spec';
import { Car } from './car';

describe('Service: Item', () => {

  const FAKE_ITEM_TITLE: string = 'No disponible';
  let service: ItemService;
  let mockBackend: MockBackend;
  let http: HttpService;
  let trackingService: TrackingService;
  let eventService: EventService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        EventService,
        {provide: TrackingService, useClass: MockTrackingService},
        {
          provide: UserService, useValue: {
          user: MOCK_USER
        }
        },
        ...TEST_HTTP_PROVIDERS,
        ItemService,
        I18nService
      ]
    });
    service = TestBed.get(ItemService);
    mockBackend = TestBed.get(MockBackend);
    http = TestBed.get(HttpService);
    trackingService = TestBed.get(TrackingService);
    eventService = TestBed.get(EventService);
    spyOn(UUID, 'UUID').and.returnValues('1', '2');
  });

  describe('get', () => {
    describe('without backend errors', () => {

      it('should call endpoint and return response', () => {
        const res: ResponseOptions = new ResponseOptions({body: JSON.stringify(ITEM_DATA_V3)});
        spyOn(http, 'get').and.returnValue(Observable.of(new Response(res)));
        let item: Item;

        service.get(ITEM_ID).subscribe((r: Item) => {
          item = r;
        });

        expect(http.get).toHaveBeenCalledWith('api/v3/items/' + ITEM_ID);
        checkItemResponse(item);
      });

    });
    describe('with backend errors', () => {
      it('should return an observable with a fake item', () => {
        let observableResponse: Item;
        spyOn(service, 'getCounters').and.returnValue(Observable.of({}));
        mockBackend.connections.subscribe((connection: MockConnection) => {
          connection.mockError();
        });
        service.get(ITEM_ID).subscribe((r: Item) => {
          observableResponse = r;
        });
        expect(observableResponse.id).toBe(ITEM_ID);
        expect(observableResponse.title).toBe(FAKE_ITEM_TITLE);
      });
    });

  });

  describe('getCounters', () => {

    describe('with no error', () => {
      it('should return the counters', () => {
        let observableResponse: any;
        mockBackend.connections.subscribe((connection: MockConnection) => {
          connection.mockRespond(new Response(new ResponseOptions({body: JSON.stringify(ITEM_COUNTERS_DATA)})));
        });
        service.getCounters(ITEM_ID).subscribe((r: ItemCounters) => {
          observableResponse = r;
        });
        expect(observableResponse.views).toBe(ITEM_VIEWS);
        expect(observableResponse.favorites).toBe(ITEM_FAVORITES);
      });
    });

    describe('receiving an error from the server', () => {
      it('should return a fake counter object', () => {
        let observableResponse: ItemCounters;
        mockBackend.connections.subscribe((connection: MockConnection) => {
          connection.mockError();
        });
        service.getCounters(ITEM_ID).subscribe((r: ItemCounters) => {
          observableResponse = r;
        });
        expect(observableResponse.views).toBe(0);
        expect(observableResponse.favorites).toBe(0);
      });
    });
  });

  describe('getFakeItem', () => {
    it('should return a fake item', () => {
      let item: Item = service.getFakeItem(ITEM_ID);
      expect(item.id).toBe(ITEM_ID);
      expect(item.title).toBe(FAKE_ITEM_TITLE);
      expect(item.mainImage.urls_by_size.small).toBe('');
      expect(item.mainImage.urls_by_size.medium).toBe('');
      expect(item.mainImage.urls_by_size.large).toBe('');
    });

  });

  describe('bulk actions', () => {

    const TOTAL: number = 5;
    let response: ItemBulkResponse;

    describe('bulkDelete', () => {

      describe('success', () => {
        beforeEach(fakeAsync(() => {
          mockBackend.connections.subscribe((connection: MockConnection) => {
            expect(connection.request.url).toBe(environment['baseUrl'] + 'api/v3/items/delete');
            expect(connection.request.method).toBe(RequestMethod.Put);
            connection.mockRespond(new Response(new ResponseOptions({body: JSON.stringify(ITEMS_BULK_RESPONSE)})));
          });
          response = null;
          spyOn(service, 'deselectItems');
        }));
        describe('from active array', () => {
          beforeEach(() => {
            service['items']['active'] = createItemsArray(TOTAL);
            service.bulkDelete('active').subscribe((r: ItemBulkResponse) => {
              response = r;
            });
          });
          it('should remove items', () => {
            expect(service['items']['active'].length).toBe(TOTAL - 3);
          });
          it('should return updated and failed ids list', () => {
            expect(response.updatedIds).toEqual(ITEMS_BULK_UPDATED_IDS);
            expect(response.failedIds).toEqual([]);
          });
          it('should call deselectItems', () => {
            expect(service.deselectItems).toHaveBeenCalled();
          });
        });
        describe('from sold array', () => {
          beforeEach(() => {
            service['items']['sold'] = createItemsArray(TOTAL);
            service.bulkDelete('sold').subscribe((r: ItemBulkResponse) => {
              response = r;
            });
          });
          it('should remove items', () => {
            expect(service['items']['sold'].length).toBe(TOTAL - 3);
          });
        });
      });
      describe('failed', () => {
        beforeEach(fakeAsync(() => {
          mockBackend.connections.subscribe((connection: MockConnection) => {
            connection.mockRespond(new Response(new ResponseOptions({body: JSON.stringify(ITEMS_BULK_RESPONSE_FAILED)})));
          });
          response = null;
        }));
        it('should return updated items', () => {
          service.bulkDelete('active').subscribe((r: ItemBulkResponse) => {
            response = r;
          });
          expect(response.failedIds).toEqual(ITEMS_BULK_FAILED_IDS);
        });
      });
    });

    describe('bulkReserve', () => {

      beforeEach(() => {
        service['items']['active'] = createItemsArray(TOTAL);
      });

      describe('success', () => {
        beforeEach(fakeAsync(() => {
          mockBackend.connections.subscribe((connection: MockConnection) => {
            expect(connection.request.url).toBe(environment['baseUrl'] + 'api/v3/items/reserve');
            expect(connection.request.method).toBe(RequestMethod.Put);
            connection.mockRespond(new Response(new ResponseOptions({body: JSON.stringify(ITEMS_BULK_RESPONSE)})));
          });
          response = null;
          spyOn(service, 'deselectItems');
          service.bulkReserve().subscribe((r: ItemBulkResponse) => {
            response = r;
          });
        }));
        it('should return updated and failed ids list', () => {
          expect(response.updatedIds).toEqual(ITEMS_BULK_UPDATED_IDS);
          expect(response.failedIds).toEqual([]);
        });
      });
      describe('failed', () => {
        beforeEach(fakeAsync(() => {
          mockBackend.connections.subscribe((connection: MockConnection) => {
            connection.mockRespond(new Response(new ResponseOptions({body: JSON.stringify(ITEMS_BULK_RESPONSE_FAILED)})));
          });
          response = null;
        }));
        it('should return updated items', () => {
          service.bulkReserve().subscribe((r: ItemBulkResponse) => {
            response = r;
          });
          expect(response.failedIds).toEqual(ITEMS_BULK_FAILED_IDS);
        });
      });
    });

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

      checkItemResponse(item);
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

    it('should map car data', () => {
      const car: Car = <Car>service['mapRecordData'](CAR_DATA);

      expect(car).toEqual(MOCK_CAR);
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
          init: 10,
          expired: true
        });
      });
      it('should return an array of items and the init', () => {
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
        init: 10,
        expired: undefined
      });
    });
    it('should return an array of items and the init', () => {
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
      const res: ResponseOptions = new ResponseOptions({body: JSON.stringify(PRODUCTS_RESPONSE)});
      spyOn(http, 'get').and.returnValue(Observable.of(new Response(res)));
      let resp: Product;
      service.getAvailableProducts(ITEM_ID).subscribe((r: Product) => {
        resp = r;
      });
      expect(http.get).toHaveBeenCalledWith('api/v3/web/items/' + ITEM_ID + '/available-visibility-products');
      expect(resp).toEqual(PRODUCT_RESPONSE)
    });
  });

  describe('getAvailableReactivationProducts', () => {
    it('should call endpoint', () => {
      const res: ResponseOptions = new ResponseOptions({body: JSON.stringify(PRODUCTS_RESPONSE)});
      spyOn(http, 'get').and.returnValue(Observable.of(new Response(res)));
      let resp: Product;
      service.getAvailableReactivationProducts(ITEM_ID).subscribe((r: Product) => {
        resp = r;
      });
      expect(http.get).toHaveBeenCalledWith('api/v3/web/items/' + ITEM_ID + '/available-reactivation-products');
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

  describe('update', () => {

    const options: RequestOptions = new RequestOptions({headers: new Headers({'X-DeviceOS': '0'})});

    it('should call endpoint and return response', () => {
      const res: ResponseOptions = new ResponseOptions({body: JSON.stringify(ITEM_DATA_V3)});
      spyOn(http, 'put').and.returnValue(Observable.of(new Response(res)));
      let item: any;

      service.update(ITEM_DATA).subscribe((r: any) => {
        item = r;
      });

      expect(http.put).toHaveBeenCalledWith('api/v3/items/' + ITEM_ID, ITEM_DATA, options);
      expect(item).toEqual(ITEM_DATA_V3);
    });

    it('should call CAR endpoint if category is 100 and return response', () => {
      const res: ResponseOptions = new ResponseOptions({body: JSON.stringify(CAR_DATA)});
      spyOn(http, 'put').and.returnValue(Observable.of(new Response(res)));
      let item: any;

      service.update(CAR_DATA_FORM).subscribe((r: any) => {
        item = r;
      });

      expect(http.put).toHaveBeenCalledWith('api/v3/items/cars/' + CAR_ID, CAR_DATA_FORM, options);
      expect(item).toEqual(CAR_DATA);
    });
  });

  describe('deletePicture', () => {
    it('should call endpoint', () => {
      spyOn(http, 'delete').and.returnValue(Observable.of({}));

      service.deletePicture(ITEM_ID, UPLOAD_FILE_ID);

      expect(http.delete).toHaveBeenCalledWith('api/v3/items/' + ITEM_ID + '/picture/' + UPLOAD_FILE_ID);
    });
  });

  describe('updatePicturesOrder', () => {
    it('should call endpoint', () => {
      spyOn(http, 'put').and.returnValue(Observable.of({}));
      const picturesOrder = {
        [UPLOAD_FILE_ID]: 0
      };

      service.updatePicturesOrder(ITEM_ID, picturesOrder);

      expect(http.put).toHaveBeenCalledWith('api/v3/items/' + ITEM_ID + '/change-picture-order', {
        pictures_order: picturesOrder
      });
    });
  });

  describe('getItemsWithAvailableProducts', () => {
    it('should call get', () => {
      const res: ResponseOptions = new ResponseOptions({body: JSON.stringify(ITEMS_WITH_AVAILABLE_PRODUCTS_RESPONSE)});
      spyOn(http, 'get').and.returnValue(Observable.of(new Response(res)));
      let response: ItemWithProducts[];

      service.getItemsWithAvailableProducts(['1', '2']).subscribe((r: ItemWithProducts[]) => {
        response = r;
      });

      expect(http.get).toHaveBeenCalledWith('api/v3/web/items/available-visibility-products', {
        itemsIds: '1,2'
      });
      expect(response).toEqual(ITEMS_WITH_PRODUCTS);
    });
  });

  describe('canMarkAsSold', () => {
    it('should call endpoint and return true', () => {
      const res: ResponseOptions = new ResponseOptions({body: JSON.stringify(ACTIONS_ALLOWED_CAN_MARK_SOLD_RESPONSE)});
      spyOn(http, 'get').and.returnValue(Observable.of(new Response(res)));
      let result: boolean;

      service.canMarkAsSold(ITEM_ID).subscribe((can: boolean) => {
        result = can;
      });

      expect(http.get).toHaveBeenCalledWith('api/v3/items/' + ITEM_ID + '/actions-allowed');
      expect(result).toBeTruthy();
    });

    it('should call endpoint and return false', () => {
      const res: ResponseOptions = new ResponseOptions({body: JSON.stringify(ACTIONS_ALLOWED_CANNOT_MARK_SOLD_RESPONSE)});
      spyOn(http, 'get').and.returnValue(Observable.of(new Response(res)));
      let result: boolean;

      service.canMarkAsSold(ITEM_ID).subscribe((can: boolean) => {
        result = can;
      });

      expect(http.get).toHaveBeenCalledWith('api/v3/items/' + ITEM_ID + '/actions-allowed');
      expect(result).toBeFalsy();
    });
  });

  describe('getUrgentProducts', () => {
    it('should return the product info', () => {
      const res: ResponseOptions = new ResponseOptions({body: JSON.stringify(PRODUCTS_RESPONSE)});
      spyOn(http, 'get').and.returnValue(Observable.of(new Response(res)));
      let resp: Product;

      service.getUrgentProducts(ITEM_ID).subscribe((r: Product) => {
        resp = r;
      });

      expect(http.get).toHaveBeenCalledWith('api/v3/web/items/' + ITEM_ID + '/available-urgent-products');
      expect(resp).toEqual(PRODUCT_RESPONSE)
    });
  });

  describe('getUrgentProductByCategoryId', () => {
    it('should return the product info', () => {
      const res: ResponseOptions = new ResponseOptions({body: JSON.stringify(PRODUCTS_RESPONSE)});
      spyOn(http, 'get').and.returnValue(Observable.of(new Response(res)));
      let resp: Product;

      service.getUrgentProductByCategoryId(ITEM_CATEGORY_ID).subscribe((r: Product) => {
        resp = r;
      });

      expect(http.get).toHaveBeenCalledWith('api/v3/web/items/available-urgent-products', {categoryId: ITEM_CATEGORY_ID});
      expect(resp).toEqual(PRODUCT_RESPONSE)
    });
  });

});

function checkItemResponse(item: Item) {
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
}
