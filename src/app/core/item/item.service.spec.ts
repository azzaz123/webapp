/* tslint:disable:no-unused-variable */

import { fakeAsync, TestBed } from '@angular/core/testing';
import { ItemService, PUBLISHED_ID, ONHOLD_ID, PAYMENT_PROVIDER } from './item.service';
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
  ITEMS_WITH_PRODUCTS, LATEST_ITEM_COUNT, LATEST_ITEM_DATA, LATEST_ITEM_DATA_EMPTY, MOCK_ITEM_V3,
  ORDER,
  PRODUCT_RESPONSE,
  PRODUCTS_RESPONSE,
  PURCHASES, ITEM_PUBLISHED_DATE, ITEM_SALE_PRICE, ITEM_DATA_V4, ITEM_DATA_V5, MOCK_LISTING_FEE_PRODUCT
} from '../../../tests/item.fixtures.spec';
import { Item, ITEM_BASE_PATH, ITEM_TYPES } from './item';
import { Observable } from 'rxjs';
import {
  CarInfo, CheapestProducts,
  ConversationUser,
  ItemBulkResponse,
  ItemCounters, ItemDataResponse,
  ItemsData,
  ItemWithProducts,
  Product, PurchaseProductsWithCreditsResponse
} from './item-response.interface';
import { MOCK_USER, USER_ID } from '../../../tests/user.fixtures.spec';
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
import { CAR_DATA, CAR_DATA_FORM, CAR_INFO, MOCK_CAR } from '../../../tests/car.fixtures.spec';
import { Car } from './car';
import { CART_ORDER_PRO } from '../../../tests/pro-item.fixtures.spec';
import { find } from 'lodash-es';
import {
  MOCK_REALESTATE, REALESTATE_CONTENT_DATA, REALESTATE_DATA,
  UPLOAD_FORM_REALESTATE_VALUES
} from '../../../tests/realestate.fixtures.spec';
import { Realestate } from './realestate';

describe('Service: Item', () => {

  const FAKE_ITEM_TITLE = 'No disponible';
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
      const item: Item = service.getFakeItem(ITEM_ID);
      expect(item.id).toBe(ITEM_ID);
      expect(item.title).toBe(FAKE_ITEM_TITLE);
      expect(item.mainImage.urls_by_size.small).toBe('');
      expect(item.mainImage.urls_by_size.medium).toBe('');
      expect(item.mainImage.urls_by_size.large).toBe('');
    });

  });

  describe('bulk actions', () => {

    const TOTAL = 5;
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
      });
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
      });
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

    it('should map real estate data', () => {
      const car: Realestate = <Realestate>service['mapRecordData'](REALESTATE_DATA);

      expect(car).toEqual(MOCK_REALESTATE);
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
      );
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
        expect(resp.data[0].listingFeeExpiringDate).toBe(1510221346789);
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
      expect(resp).toEqual(CONVERSATION_USERS);
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
      expect(resp).toEqual(PRODUCT_RESPONSE);
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
      expect(resp).toEqual(PRODUCT_RESPONSE);
    });
  });

  describe('purchaseProducts', () => {
    it('should call endpoint', () => {
      const res: ResponseOptions = new ResponseOptions({body: JSON.stringify(['1234'])});
      spyOn(http, 'post').and.returnValue(Observable.of(new Response(res)));
      let resp: string[];
      let options: RequestOptions = new RequestOptions({headers: new Headers({'X-PaymentProvider': PAYMENT_PROVIDER})});

      service.purchaseProducts([ORDER], 'UUID', true).subscribe((r: string[]) => {
        resp = r;
      });
      expect(http.post).toHaveBeenCalledWith('api/v3/web/items/purchase/products/UUID', [ORDER], options);
      expect(resp).toEqual(['1234']);
    });
  });

  describe('purchaseProductsWithCredits', () => {
    it('should call endpoint', () => {
      const RESP: PurchaseProductsWithCreditsResponse = {
        payment_needed: true,
        items_failed: []
      };
      const res: ResponseOptions = new ResponseOptions({body: JSON.stringify(RESP)});
      spyOn(http, 'post').and.returnValue(Observable.of(new Response(res)));
      let resp: PurchaseProductsWithCreditsResponse;
      let options: RequestOptions = new RequestOptions({headers: new Headers({'X-PaymentProvider': PAYMENT_PROVIDER})});

      service.purchaseProductsWithCredits([ORDER], 'UUID', true).subscribe((r: PurchaseProductsWithCreditsResponse) => {
        resp = r;
      });
      expect(http.post).toHaveBeenCalledWith('api/v3/web/items/purchase/products/credit/UUID', [ORDER], options);
      expect(resp).toEqual(RESP);
    });
  });

  describe('update', () => {

    describe('consumer good', () => {
      const options: RequestOptions = new RequestOptions({headers: new Headers({'X-DeviceOS': '0'})});
      beforeEach(() => {
        const res: ResponseOptions = new ResponseOptions({body: JSON.stringify(ITEM_DATA_V3)});
        spyOn(http, 'put').and.returnValue(Observable.of(new Response(res)));
        spyOn(eventService, 'emit');
      });

      it('should call endpoint and return response', () => {
        let item: any;

        service.update(ITEM_DATA, ITEM_TYPES.CONSUMER_GOODS).subscribe((r: any) => {
          item = r;
        });

        expect(http.put).toHaveBeenCalledWith('api/v3/items/' + ITEM_ID, ITEM_DATA, options);
        expect(item).toEqual(ITEM_DATA_V3);
      });

      it('should emit ITEM_UPDATED event', () => {
        service.update(ITEM_DATA, ITEM_TYPES.CONSUMER_GOODS).subscribe();

        expect(eventService.emit).toHaveBeenCalledWith(EventService.ITEM_UPDATED, ITEM_DATA)
      });
    });

    describe('car', () => {
      const options: RequestOptions = new RequestOptions({headers: new Headers({'X-PaymentProvider': PAYMENT_PROVIDER, 'X-DeviceOS': '0', 'Accept': 'application/vnd.edit-car-v2+json'})});
      beforeEach(() => {
        const res: ResponseOptions = new ResponseOptions({body: JSON.stringify(CAR_DATA)});
        spyOn(http, 'put').and.returnValue(Observable.of(new Response(res)));
        spyOn(eventService, 'emit');
      });

      it('should call CAR endpoint if category is 100 and return response', () => {
        let item: any;

        service.update(CAR_DATA_FORM, ITEM_TYPES.CARS).subscribe((r: any) => {
          item = r;
        });

        expect(http.put).toHaveBeenCalledWith('api/v3/items/cars/' + CAR_ID, CAR_DATA_FORM, options);
        expect(item).toEqual(CAR_DATA);
      });

      it('should emit ITEM_UPDATED event', () => {
        service.update(ITEM_DATA, ITEM_TYPES.CARS).subscribe();

        expect(eventService.emit).toHaveBeenCalledWith(EventService.ITEM_UPDATED, ITEM_DATA)
      });
    });

    describe('real estate', () => {
      const options: RequestOptions = new RequestOptions({headers: new Headers({'X-DeviceOS': '0'})});
      beforeEach(() => {
        const res: ResponseOptions = new ResponseOptions({body: JSON.stringify(REALESTATE_DATA)});
        spyOn(http, 'put').and.returnValue(Observable.of(new Response(res)));
        spyOn(eventService, 'emit');
      });

      it('should call REAL ESTATE endpoint if category is 13000 and return response', () => {
        let item: any;

        service.update(UPLOAD_FORM_REALESTATE_VALUES, ITEM_TYPES.REAL_ESTATE).subscribe((r: any) => {
          item = r;
        });

        expect(http.put).toHaveBeenCalledWith('api/v3/items/real_estate/' + ITEM_ID, UPLOAD_FORM_REALESTATE_VALUES, options);
        expect(item).toEqual(REALESTATE_DATA);
      });

      it('should emit ITEM_UPDATED event', () => {
        service.update(ITEM_DATA, ITEM_TYPES.REAL_ESTATE).subscribe();

        expect(eventService.emit).toHaveBeenCalledWith(EventService.ITEM_UPDATED, ITEM_DATA);
      });
    });

  });

  describe('updateRealEstateLocation', () => {
    it('should call endpoint', () => {
      spyOn(http, 'put').and.returnValue(Observable.of({}));

      service.updateRealEstateLocation(ITEM_ID, REALESTATE_CONTENT_DATA.location);

      expect(http.put).toHaveBeenCalledWith('api/v3/items/real_estate/' + ITEM_ID + '/location', REALESTATE_CONTENT_DATA.location);
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

  describe('getCheapestProductPrice', () => {
    it('should call get', () => {
      const res: ResponseOptions = new ResponseOptions({body: JSON.stringify(ITEMS_WITH_AVAILABLE_PRODUCTS_RESPONSE)});
      spyOn(http, 'get').and.returnValue(Observable.of(new Response(res)));
      let response: CheapestProducts;

      service.getCheapestProductPrice(['1', '2']).subscribe((r: CheapestProducts) => {
        response = r;
      });

      expect(http.get).toHaveBeenCalledWith('api/v3/web/items/available-visibility-products', {
        itemsIds: '1,2'
      });
      expect(response).toEqual({ 1: '3.19', 2: '3.19' });
    });
  });

  describe('canDoAction', () => {
    it('should call endpoint and return true', () => {
      const res: ResponseOptions = new ResponseOptions({body: JSON.stringify(ACTIONS_ALLOWED_CAN_MARK_SOLD_RESPONSE)});
      spyOn(http, 'get').and.returnValue(Observable.of(new Response(res)));
      let result: boolean;

      service.canDoAction('mark_sold', ITEM_ID).subscribe((can: boolean) => {
        result = can;
      });

      expect(http.get).toHaveBeenCalledWith('api/v3/items/' + ITEM_ID + '/actions-allowed');
      expect(result).toBeTruthy();
    });

    it('should call endpoint and return false', () => {
      const res: ResponseOptions = new ResponseOptions({body: JSON.stringify(ACTIONS_ALLOWED_CANNOT_MARK_SOLD_RESPONSE)});
      spyOn(http, 'get').and.returnValue(Observable.of(new Response(res)));
      let result: boolean;

      service.canDoAction('mark_sold', ITEM_ID).subscribe((can: boolean) => {
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
      expect(resp).toEqual(PRODUCT_RESPONSE);
    });
  });

  describe('getUrgentProductByCategoryId', () => {
    it('should return the product info', () => {
      const res: ResponseOptions = new ResponseOptions({body: JSON.stringify(PRODUCTS_RESPONSE)});
      spyOn(http, 'get').and.returnValue(Observable.of(new Response(res)));
      let resp: Product;

      service.getUrgentProductByCategoryId(ITEM_CATEGORY_ID.toString()).subscribe((r: Product) => {
        resp = r;
      });

      expect(http.get).toHaveBeenCalledWith('api/v3/web/items/available-urgent-products', {categoryId: ITEM_CATEGORY_ID.toString()});
      expect(resp).toEqual(PRODUCT_RESPONSE);
    });
  });

  describe('getLatest', () => {
    it('should return the latest item', () => {
      let observableResponse: ItemDataResponse;
      mockBackend.connections.subscribe((connection: MockConnection) => {
        connection.mockRespond(new Response(new ResponseOptions({body: JSON.stringify(LATEST_ITEM_DATA)})));
      });
      service.getLatest(USER_ID).subscribe((r: ItemDataResponse) => {
        observableResponse = r;
      });
      expect(observableResponse.count).toBe(LATEST_ITEM_COUNT - 1);
      expect(observableResponse.data).toEqual(MOCK_ITEM_V3);
    });
    it('should return null item', () => {
      let observableResponse: ItemDataResponse;
      mockBackend.connections.subscribe((connection: MockConnection) => {
        connection.mockRespond(new Response(new ResponseOptions({body: JSON.stringify(LATEST_ITEM_DATA_EMPTY)})));
      });
      service.getLatest(USER_ID).subscribe((r: ItemDataResponse) => {
        observableResponse = r;
      });
      expect(observableResponse.count).toBe(LATEST_ITEM_COUNT - 1);
      expect(observableResponse.data).toEqual(null);
    });
  });

  describe('bumpProItems', () => {
    it('should call endpoint', () => {
      let resp: string[];
      const res: ResponseOptions = new ResponseOptions({body: JSON.stringify(['1234'])});
      const API_URL_PROTOOL = 'api/v3/protool';
      spyOn(http, 'post').and.returnValue(Observable.of(new Response(res)));

      service.bumpProItems(CART_ORDER_PRO).subscribe((r: string[]) => {
        resp = r;
      });

      expect(http.post).toHaveBeenCalledWith(API_URL_PROTOOL + '/purchaseItems', CART_ORDER_PRO);
      expect(resp).toEqual(['1234']);
    });
  });

  describe('mines', () => {
    describe('with data', () => {
      beforeEach(() => {
        mockBackend.connections.subscribe((connection: MockConnection) => {
          if (connection.request.url.indexOf('init=0&end=300') !== -1) {
            connection.mockRespond(new Response(new ResponseOptions({body: JSON.stringify([ITEM_DATA_V4, ITEM_DATA_V5])})));
          } else if (connection.request.url.indexOf('init=300&end=600') !== -1) {
            connection.mockRespond(new Response(new ResponseOptions({body: JSON.stringify([ITEM_DATA_V4, ITEM_DATA_V5])})));
          } else {
            connection.mockRespond(new Response(new ResponseOptions({body: JSON.stringify([])})));
          }
          expect(connection.request.url).toContain('/mines');
        });
        spyOn(http, 'get').and.callThrough();
      });
      it('should return 3 pages recursively', () => {
        let observableResponse: Item[];
        service.mines(1, 10, 'date_desc').subscribe((r: Item[]) => {
          observableResponse = r;
        });

        expect(observableResponse.length).toBe(4);
      });
      it('should return cached results the second time', () => {
        let observableResponse: Item[];
        let observableResponse2: Item[];

        service.mines(1, 10, 'date_desc').subscribe((r: Item[]) => {
          observableResponse = r;
        });

        expect(http.get).toHaveBeenCalledTimes(3);
      });
      it('should NOT return cached results the second time', () => {
        service.mines(1, 10, 'date_desc').subscribe();

        expect(http.get).toHaveBeenCalledTimes(3);
      });
      it('should filter by term', () => {
        let observableResponse: Item[];
        service.mines(1, 10, 'date_desc', undefined, 'title').subscribe((r: Item[]) => {
          observableResponse = r;
        });

        expect(observableResponse.length).toBe(4);

        observableResponse = undefined;
        service.mines(1, 10, 'date_desc', undefined, 'TITLE').subscribe((r: Item[]) => {
          observableResponse = r;
        });

        expect(observableResponse.length).toBe(4);

        observableResponse = undefined;
        service.mines(1, 10, 'date_desc', undefined, 'title2').subscribe((r: Item[]) => {
          observableResponse = r;
        });

        expect(observableResponse.length).toBe(0);

        observableResponse = undefined;
        service.mines(1, 10, 'date_desc', undefined, 'test').subscribe((r: Item[]) => {
          observableResponse = r;
        });

        expect(observableResponse.length).toBe(0);

        observableResponse = undefined;
        service.mines(1, 10, 'date_desc', undefined, 'description').subscribe((r: Item[]) => {
          observableResponse = r;
        });

        expect(observableResponse.length).toBe(4);

        observableResponse = undefined;
        service.mines(1, 10, 'date_desc', undefined, 'description2').subscribe((r: Item[]) => {
          observableResponse = r;
        });

        expect(observableResponse.length).toBe(0);
      });

      it('should sort by date', () => {
        let observableResponse: Item[];
        service.mines(1, 10, 'date_desc').subscribe((r: Item[]) => {
          observableResponse = r;
        });

        expect(observableResponse[0].publishedDate).toBe(ITEM_PUBLISHED_DATE);
        expect(observableResponse[1].publishedDate).toBe(ITEM_PUBLISHED_DATE);
        expect(observableResponse[2].publishedDate).toBe(ITEM_PUBLISHED_DATE);
        expect(observableResponse[3].publishedDate).toBe(ITEM_PUBLISHED_DATE);

        observableResponse = undefined;
        service.mines(1, 10, 'date_asc').subscribe((r: Item[]) => {
          observableResponse = r;
        });
        expect(observableResponse[0].publishedDate).toBe(ITEM_PUBLISHED_DATE);
        expect(observableResponse[1].publishedDate).toBe(ITEM_PUBLISHED_DATE);
        expect(observableResponse[2].publishedDate).toBe(ITEM_PUBLISHED_DATE);
        expect(observableResponse[3].publishedDate).toBe(ITEM_PUBLISHED_DATE);

        observableResponse = undefined;
        service.mines(1, 10, 'price_asc').subscribe((r: Item[]) => {
          observableResponse = r;
        });

        expect(observableResponse[0].salePrice).toBe(ITEM_SALE_PRICE);
        expect(observableResponse[1].salePrice).toBe(ITEM_SALE_PRICE);
        expect(observableResponse[2].salePrice).toBe(ITEM_SALE_PRICE);
        expect(observableResponse[3].salePrice).toBe(ITEM_SALE_PRICE);

        observableResponse = undefined;

        service.mines(1, 10, 'price_desc').subscribe((r: Item[]) => {
          observableResponse = r;
        });

        expect(observableResponse[0].salePrice).toBe(ITEM_SALE_PRICE);
        expect(observableResponse[1].salePrice).toBe(ITEM_SALE_PRICE);
        expect(observableResponse[2].salePrice).toBe(ITEM_SALE_PRICE);
        expect(observableResponse[3].salePrice).toBe(ITEM_SALE_PRICE);
      });
      it('should paginate', () => {
        let observableResponse: Item[];
        service.mines(1, 2, 'date_desc').subscribe((r: Item[]) => {
          observableResponse = r;
        });
        expect(observableResponse[0].salePrice).toBe(ITEM_SALE_PRICE);
        expect(observableResponse[1].salePrice).toBe(ITEM_SALE_PRICE);

        observableResponse = undefined;
        service.mines(2, 2, 'date_desc').subscribe((r: Item[]) => {
          observableResponse = r;
        });

        expect(observableResponse[0].salePrice).toBe(ITEM_SALE_PRICE);
        expect(observableResponse[1].salePrice).toBe(ITEM_SALE_PRICE);

        observableResponse = undefined;
        service.mines(1, 4, 'date_desc').subscribe((r: Item[]) => {
          observableResponse = r;
        });

        expect(observableResponse.length).toBe(4);
      });
    });
    it('should return an empty array', () => {
      mockBackend.connections.subscribe((connection: MockConnection) => {
        connection.mockRespond(new Response(new ResponseOptions({body: JSON.stringify([])})));
        expect(connection.request.url).toContain('/mines');
      });
      let observableResponse: Item[];
      service.mines(1, 2, 'date_desc').subscribe((r: Item[]) => {
        observableResponse = r;
      });

      expect(observableResponse.length).toBe(0);
    });
  });

  describe('setSold', () => {

    const ID: number = 1;
    const TOTAL: number = 5;
    let eventEmitted: boolean;

    beforeEach(fakeAsync(() => {
      mockBackend.connections.subscribe((connection: MockConnection) => {
        expect(connection.request.url).toBe(environment['baseUrl'] + 'shnm-portlet/api/v1/item.json/' + ID + '/sold');
        connection.mockRespond(new Response(new ResponseOptions({body: JSON.stringify({})})));
      });
      service['items']['active'] = createItemsArray(TOTAL);
      eventService.subscribe(EventService.ITEM_SOLD, () => {
        eventEmitted = true;
      });
    }));

    describe('sold array with items', () => {
      beforeEach(fakeAsync(() => {
        service['items']['sold'] = createItemsArray(TOTAL, TOTAL);
        service.setSold(ID).subscribe();
      }));
      it('should remove item from active array', () => {
        expect(service['items']['active'].length).toBe(TOTAL - 1);
        expect(find(service['items']['active'], {'legacyId': ID})).toBeFalsy();
      });

      it('should add item to sold array', () => {
        expect(service['items']['sold'].length).toBe(TOTAL + 1);
        expect(find(service['items']['sold'], {'legacyId': ID})).toBeTruthy();
      });

      it('should emit event', () => {
        expect(eventEmitted).toBeTruthy();
      });
    });

    describe('sold array without items', () => {
      beforeEach(fakeAsync(() => {
        service.setSold(ID).subscribe();
      }));
      it('should NOT add item to sold array', () => {
        expect(service['items']['sold'].length).toBe(0);
      });
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

    describe('bulkSetActivate', () => {

      const TOTAL: number = 5;
      let eventEmitted: boolean;

      describe('if there are not problems', () => {

        beforeEach(() => {
          spyOn(http, 'post').and.returnValue(Observable.of({}));
          spyOn(service, 'deselectItems');
          service['items']['active'] = createItemsArray(TOTAL);
          service['items']['pending'] = createItemsArray(TOTAL);
          service.selectedItems = ITEMS_BULK_UPDATED_IDS;

          eventService.subscribe('itemChangeStatus', () => {
            eventEmitted = true;
          });

          service.bulkSetActivate().subscribe();
        });

        it('should call a post method with params', () => {
          expect(http.post).toHaveBeenCalledWith('api/v3/protool/changeItemStatus', {
            itemIds: ITEMS_BULK_UPDATED_IDS,
            publishStatus: PUBLISHED_ID
          });
        });

        it('should remove item from pending array', () => {
          expect(service['items']['pending'].length).toBe(TOTAL - 3);
          expect(find(service['items']['pending'], {'id': ITEMS_BULK_UPDATED_IDS[0]})).toBeFalsy();
          expect(find(service['items']['pending'], {'id': ITEMS_BULK_UPDATED_IDS[1]})).toBeFalsy();
          expect(find(service['items']['pending'], {'id': ITEMS_BULK_UPDATED_IDS[2]})).toBeFalsy();
        });

        it('should add item to active array', () => {
          expect(service['items']['active'].length).toBe(TOTAL + 3);
          expect(find(service['items']['active'], {'id': ITEMS_BULK_UPDATED_IDS[0]})).toBeTruthy();
          expect(find(service['items']['active'], {'id': ITEMS_BULK_UPDATED_IDS[1]})).toBeTruthy();
          expect(find(service['items']['active'], {'id': ITEMS_BULK_UPDATED_IDS[2]})).toBeTruthy();
        });

        it('should call deselectItems', () => {
          expect(service.deselectItems).toHaveBeenCalled();
        });

        it('should emit event', () => {
          expect(eventEmitted).toBeTruthy();
        });
      });

      describe('if there are problems', () => {
        const ERROR: any = {
          'code': 1,
          'type': 'error',
          'message': 'many items activated'
        };

        let response: any;

        beforeEach(() => {
          spyOn(http, 'post').and.returnValue(Observable.throw(ERROR));

          service.bulkSetActivate().subscribe((resp) => {
            response = resp;
          });
        });

        it('should enter in catch method', () => {
          expect(response).toBe(ERROR);
        });
      });
    });

    describe('bulkSetDeactivate', () => {

      const TOTAL: number = 5;
      let eventEmitted: boolean;

      beforeEach(() => {
        spyOn(http, 'post').and.returnValue(Observable.of({}));
        spyOn(service, 'deselectItems');
        service['items']['active'] = createItemsArray(TOTAL);
        service['items']['pending'] = createItemsArray(TOTAL);
        service.selectedItems = ITEMS_BULK_UPDATED_IDS;

        eventService.subscribe('itemChangeStatus', () => {
          eventEmitted = true;
        });

        service.bulkSetDeactivate().subscribe();
      });

      it('should call a post method with params', () => {
        expect(http.post).toHaveBeenCalledWith('api/v3/protool/changeItemStatus', {
          itemIds: ITEMS_BULK_UPDATED_IDS,
          publishStatus: ONHOLD_ID
        });
      });

      it('should remove item from active array', () => {
        expect(service['items']['active'].length).toBe(TOTAL - 3);
        expect(find(service['items']['active'], {'id': ITEMS_BULK_UPDATED_IDS[0]})).toBeFalsy();
        expect(find(service['items']['active'], {'id': ITEMS_BULK_UPDATED_IDS[1]})).toBeFalsy();
        expect(find(service['items']['active'], {'id': ITEMS_BULK_UPDATED_IDS[2]})).toBeFalsy();
      });

      it('should add item to pending array', () => {
        expect(service['items']['pending'].length).toBe(TOTAL + 3);
        expect(find(service['items']['pending'], {'id': ITEMS_BULK_UPDATED_IDS[0]})).toBeTruthy();
        expect(find(service['items']['pending'], {'id': ITEMS_BULK_UPDATED_IDS[1]})).toBeTruthy();
        expect(find(service['items']['pending'], {'id': ITEMS_BULK_UPDATED_IDS[2]})).toBeTruthy();
      });

      it('should call deselectItems', () => {
        expect(service.deselectItems).toHaveBeenCalled();
      });

      it('should emit event', () => {
        expect(eventEmitted).toBeTruthy();
      });
    });
  });

  describe('getItemAndSetPurchaseInfo', () => {
    it('should return item by id', () => {
      service['items']['active'] = createItemsArray(8);
      expect(service.getItemAndSetPurchaseInfo('1', PURCHASES[0])).toEqual(service['items']['active'][0]);
      expect(service['items']['active'][0].bumpExpiringDate).toBe(1510221655715);
    });
    it('should return undefined item if not found', () => {
      service['items']['active'] = createItemsArray(8);
      expect(service.getItemAndSetPurchaseInfo('20', PURCHASES[0])).toBeUndefined();
    });
  });

  describe('resetAllPurchaseInfo', () => {
    it('should reset purchase info', () => {
      service['items']['active'] = createItemsArray(8);
      service['items']['active'][0].bumpExpiringDate = 1234;
      service.resetAllPurchaseInfo();
      expect(service['items']['active'][0].bumpExpiringDate).toBeNull();
    });
  });

  describe('getCarInfo', () => {
    it('should call endpoint', () => {
      let resp: CarInfo;
      const res: ResponseOptions = new ResponseOptions({body: JSON.stringify(CAR_INFO)});
      spyOn(http, 'get').and.returnValue(Observable.of(new Response(res)));
      const BRAND = 'brand';
      const MODEL = 'model';
      const VERSION = 'version';

      service.getCarInfo(BRAND, MODEL, VERSION).subscribe((r: CarInfo) => {
        resp = r;
      });

      expect(http.get).toHaveBeenCalledWith('api/v3/items/cars/info', {
        brand: BRAND,
        model: MODEL,
        version: VERSION
      });
      expect(resp).toEqual(CAR_INFO);
    });
  });

  describe('activate', () => {
    it('should call endpoint', () => {
      spyOn(http, 'put').and.returnValue(Observable.of({}));
      spyOn(service, 'deselectItems');
      const IDS = ['1', '2'];
      service.selectedItems = IDS;

      service.activate().subscribe();

      expect(http.put).toHaveBeenCalledWith('api/v3/items/activate', {ids: IDS});
      expect(service.deselectItems).toHaveBeenCalled();
    });
  });

  describe('deactivate', () => {
    it('should call endpoint', () => {
      spyOn(http, 'put').and.returnValue(Observable.of({}));
      spyOn(service, 'deselectItems');
      const IDS = ['1', '2'];
      service.selectedItems = IDS;

      service.deactivate().subscribe();

      expect(http.put).toHaveBeenCalledWith('api/v3/items/inactivate', {ids: IDS});
      expect(service.deselectItems).toHaveBeenCalled();
    });
  });

  describe('getListingFeeInfo', () => {
    it('should call endpoint', () => {
      const itemId = 'p4w67gxww6xq';
      const res: ResponseOptions = new ResponseOptions({body: JSON.stringify(MOCK_LISTING_FEE_PRODUCT)});
      spyOn(http, 'get').and.returnValue(Observable.of(new Response(res)));
      let resp: Product;

      service.getListingFeeInfo(itemId).subscribe((r: Product) => {
        resp = r;
      });

      expect(http.get).toHaveBeenCalledWith('api/v3/web/items/p4w67gxww6xq/listing-fee-info');
      expect(resp).toEqual(MOCK_LISTING_FEE_PRODUCT.product_group.products[0]);
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
