import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { fakeAsync, TestBed } from '@angular/core/testing';
import { find } from 'lodash-es';
import { environment } from '../../../environments/environment';
import { CAR_DATA, CAR_DATA_FORM, CAR_INFO, MOCK_CAR } from '../../../tests/car.fixtures.spec';
import {
  ACTIONS_ALLOWED_CANNOT_MARK_SOLD_RESPONSE,
  ACTIONS_ALLOWED_CAN_MARK_SOLD_RESPONSE,
  CONVERSATION_USERS,
  createItemsArray,
  ITEMS_BULK_RESPONSE,
  ITEMS_BULK_UPDATED_IDS,
  ITEMS_DATA_V3,
  ITEMS_DATA_v3_FAVORITES,
  ITEMS_WITH_AVAILABLE_PRODUCTS_RESPONSE,
  ITEMS_WITH_PRODUCTS,
  ITEM_CATEGORY_ID,
  ITEM_CONVERSATIONS,
  ITEM_COUNTERS_DATA,
  ITEM_DATA,
  ITEM_DATA_V3,
  ITEM_DATA_V4,
  ITEM_DATA_V5,
  ITEM_FAVORITES,
  ITEM_ID,
  ITEM_PUBLISHED_DATE,
  ITEM_SALE_PRICE,
  ITEM_VIEWS,
  LATEST_ITEM_COUNT,
  LATEST_ITEM_DATA,
  LATEST_ITEM_DATA_EMPTY,
  MOCK_ITEM_V3,
  ORDER,
  PRODUCTS_RESPONSE,
  PRODUCT_RESPONSE,
  PURCHASES,
} from '../../../tests/item.fixtures.spec';
import { CART_ORDER_PRO } from '../../../tests/pro-item.fixtures.spec';
import {
  MOCK_REALESTATE,
  REALESTATE_CONTENT_DATA,
  REALESTATE_DATA,
  UPLOAD_FORM_REALESTATE_VALUES,
} from '../../../tests/realestate.fixtures.spec';
import { CAR_ID, UPLOAD_FILE_ID } from '../../../tests/upload.fixtures.spec';
import { MOCK_USER, USER_ID } from '../../../tests/user.fixtures.spec';
import { EventService } from '../event/event.service';
import { I18nService } from '../i18n/i18n.service';
import { UserService } from '../user/user.service';
import { UuidService } from '../uuid/uuid.service';
import { Car } from './car';
import { Item, ITEM_TYPES } from './item';
import {
  CarInfo,
  CheapestProducts,
  ConversationUser,
  ItemCounters,
  ItemDataResponse,
  ItemsData,
  ItemWithProducts,
  Product,
} from './item-response.interface';
import {
  ACTIVATE_ENDPOINT,
  ItemService,
  ITEMS_API_URL,
  ITEM_STATUSES,
  ONHOLD_ID,
  PAYMENT_PROVIDER,
  PROTOOL_API_URL,
  PUBLISHED_ID,
  USERS_API_URL,
  V1_API_URL,
  WEB_ITEMS_API_URL,
} from './item.service';
import { Realestate } from './realestate';

describe('ItemService', () => {
  const FAKE_ITEM_TITLE = 'No disponible';
  let service: ItemService;
  let eventService: EventService;
  let httpMock: HttpTestingController;
  let uuidService: UuidService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        EventService,
        {
          provide: UserService,
          useValue: {
            user: MOCK_USER,
          },
        },
        ItemService,
        I18nService,
      ],
    });
    service = TestBed.inject(ItemService);
    httpMock = TestBed.inject(HttpTestingController);
    eventService = TestBed.inject(EventService);
    uuidService = TestBed.inject(UuidService);
    spyOn(uuidService, 'getUUID').and.returnValues('1', '2');
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('getCounters', () => {
    it('should return counters value', () => {
      const expectedUrl = `${environment.baseUrl}${ITEMS_API_URL}/${ITEM_ID}/counters`;
      let response: ItemCounters;

      service.getCounters(ITEM_ID).subscribe((r) => (response = r));
      const req: TestRequest = httpMock.expectOne(expectedUrl);
      req.flush(ITEM_COUNTERS_DATA);

      expect(req.request.url).toEqual(expectedUrl);
      expect(response.views).toEqual(ITEM_VIEWS);
      expect(response.favorites).toEqual(ITEM_FAVORITES);
      expect(response.conversations).toEqual(ITEM_CONVERSATIONS);
      expect(req.request.method).toBe('GET');
    });

    describe('when receiving an error from the server', () => {
      it('should return a fake counter object', () => {
        const expectedUrl = `${environment.baseUrl}${ITEMS_API_URL}/${ITEM_ID}/counters`;
        let response: ItemCounters;

        service.getCounters(ITEM_ID).subscribe((r) => (response = r));
        httpMock.expectOne(expectedUrl).error(new ErrorEvent('network error'));

        expect(response.views).toEqual(0);
        expect(response.conversations).toEqual(0);
        expect(response.favorites).toEqual(0);
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

  describe('bulkDelete', () => {
    it('should delete the selected items', () => {
      const selectedItemIds = ['1', '2', '3'];
      const expectedUrl = `${environment.baseUrl}${ITEMS_API_URL}/delete`;
      const expectedBody = {
        ids: selectedItemIds,
      };

      service.selectedItems = selectedItemIds;
      service.bulkDelete('sold').subscribe();
      const req: TestRequest = httpMock.expectOne(expectedUrl);
      req.flush(ITEMS_BULK_RESPONSE);

      expect(req.request.url).toBe(expectedUrl);
      expect(req.request.body).toEqual(expectedBody);
      expect(req.request.method).toBe('PUT');
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
        action: 'selected',
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

    it('should emit deselected event', () => {
      expect(event).toEqual({
        id: '1',
        action: 'deselected',
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
          sale_price: 0,
        },
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

  describe('mine', () => {
    describe('no purchases', () => {
      it('should call endpoint', () => {
        let response: ItemsData;
        const INIT = 10;
        const expectedUrlParams = `init=${INIT}&expired=true`;
        const expectedUrl = `${environment.baseUrl}${WEB_ITEMS_API_URL}/mine/published?${expectedUrlParams}`;
        const expectedUrl2 = `${environment.baseUrl}${WEB_ITEMS_API_URL}/mine/purchases`;

        service.mine(10, 'published').subscribe((r) => (response = r));
        const req: TestRequest = httpMock.expectOne(expectedUrl);
        req.flush(ITEMS_DATA_V3, {
          headers: { 'x-nextpage': `init=${INIT + 10}` },
        });
        const req2: TestRequest = httpMock.expectOne(expectedUrl2);
        req2.flush([]);

        expect(req.request.urlWithParams).toEqual(expectedUrl);
        expect(req.request.method).toBe('GET');
        expect(response.data.length).toBe(4);
        const item = response.data[0];
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
          urls_by_size: ITEMS_DATA_V3[0].content.image,
        });
        expect(item.bumpExpiringDate).toBeUndefined();
        expect(response.init).toBe(INIT + 10);
      });
    });

    describe('with purchases', () => {
      it('should get purchases', () => {
        let response: ItemsData;
        const INIT = 10;
        const expectedUrlParams = `init=${INIT}&expired=true`;
        const expectedUrl = `${environment.baseUrl}${WEB_ITEMS_API_URL}/mine/published?${expectedUrlParams}`;
        const expectedUrl2 = `${environment.baseUrl}${WEB_ITEMS_API_URL}/mine/purchases`;

        service.mine(10, 'published').subscribe((r) => (response = r));
        const req: TestRequest = httpMock.expectOne(expectedUrl);
        req.flush(ITEMS_DATA_V3, {
          headers: { 'x-nextpage': `init=${INIT + 10}` },
        });
        const req2: TestRequest = httpMock.expectOne(expectedUrl2);
        req2.flush(PURCHASES);

        expect(response.data[0].bumpExpiringDate).toBe(1510221655715);
        expect(response.data[0].flags.highlighted).toBeTruthy();
        expect(response.data[2].bumpExpiringDate).toBe(1509874085135);
        expect(response.data[2].flags.bumped).toBeTruthy();
      });
    });
  });

  describe('myFavorites', () => {
    it('should get user favorites', () => {
      let response: ItemsData;
      const INIT = 0;
      const expectedUrlParams = `init=${INIT}&expired=undefined`;
      const expectedUrl = `${environment.baseUrl}${USERS_API_URL}/me/items/favorites?${expectedUrlParams}`;
      const expectedUrl2 = `${environment.baseUrl}${WEB_ITEMS_API_URL}/mine/purchases`;

      service.myFavorites(0).subscribe((r) => (response = r));
      const req: TestRequest = httpMock.expectOne(expectedUrl);
      req.flush(ITEMS_DATA_v3_FAVORITES, {
        headers: { 'x-nextpage': `init=${INIT + 10}` },
      });
      const req2: TestRequest = httpMock.expectOne(expectedUrl2);
      req2.flush([]);

      expect(req.request.urlWithParams).toEqual(expectedUrl);
      expect(req.request.method).toBe('GET');
      expect(req2.request.url).toEqual(expectedUrl2);
      expect(req2.request.method).toEqual('GET');

      expect(response.data.length).toBe(2);
      const item = response.data[0];
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
        urls_by_size: ITEMS_DATA_v3_FAVORITES[0].content.image,
      });
      expect(response.init).toBe(10);
    });
  });

  describe('deleteItem', () => {
    it('should delete the selected item', () => {
      const expectedUrl = `${environment.baseUrl}${ITEMS_API_URL}/${ITEM_ID}`;

      service.deleteItem(ITEM_ID).subscribe();
      const req: TestRequest = httpMock.expectOne(expectedUrl);
      req.flush({});

      expect(req.request.url).toBe(expectedUrl);
      expect(req.request.method).toBe('DELETE');
    });
  });

  describe('reserveItem', () => {
    it('should mark the selected item as reserved', () => {
      const expectedUrl = `${environment.baseUrl}${ITEMS_API_URL}/${ITEM_ID}/reserve`;
      const RESERVED = false;
      const expectedBody = {
        reserved: RESERVED,
      };

      service.reserveItem(ITEM_ID, RESERVED).subscribe();
      const req: TestRequest = httpMock.expectOne(expectedUrl);
      req.flush({});

      expect(req.request.url).toBe(expectedUrl);
      expect(req.request.body).toEqual(expectedBody);
      expect(req.request.method).toBe('PUT');
    });
  });

  describe('reactivateItem', () => {
    it('should reactivate the selected item', () => {
      const expectedUrl = `${environment.baseUrl}${ITEMS_API_URL}/${ITEM_ID}/reactivate`;

      service.reactivateItem(ITEM_ID).subscribe();
      const req: TestRequest = httpMock.expectOne(expectedUrl);
      req.flush({});

      expect(req.request.url).toBe(expectedUrl);
      expect(req.request.method).toBe('PUT');
    });
  });

  describe('favoriteItem', () => {
    it('should mark the selected item as favorite', () => {
      const expectedUrl = `${environment.baseUrl}${ITEMS_API_URL}/${ITEM_ID}/favorite`;
      const FAVORITED = false;
      const expectedBody = {
        favorited: FAVORITED,
      };

      service.favoriteItem(ITEM_ID, FAVORITED).subscribe();
      const req: TestRequest = httpMock.expectOne(expectedUrl);
      req.flush({});

      expect(req.request.url).toBe(expectedUrl);
      expect(req.request.body).toEqual(expectedBody);
      expect(req.request.method).toBe('PUT');
    });
  });

  describe('bulkReserve', () => {
    it('should mark the selecteds items as reserved', () => {
      const selectedItemIds = ['1', '2', '3'];
      const expectedUrl = `${environment.baseUrl}${ITEMS_API_URL}/reserve`;
      const expectedBody = {
        ids: selectedItemIds,
      };

      service.selectedItems = selectedItemIds;
      service.bulkReserve().subscribe();
      const req: TestRequest = httpMock.expectOne(expectedUrl);
      req.flush({});

      expect(req.request.url).toBe(expectedUrl);
      expect(req.request.body).toEqual(expectedBody);
      expect(req.request.method).toBe('PUT');
    });
  });

  describe('soldOutside', () => {
    it('should set the selected item as sold', () => {
      const expectedUrl = `${environment.baseUrl}${ITEMS_API_URL}/${ITEM_ID}/sold`;

      service.soldOutside(ITEM_ID).subscribe();
      const req: TestRequest = httpMock.expectOne(expectedUrl);
      req.flush({});

      expect(req.request.url).toBe(expectedUrl);
      expect(req.request.method).toBe('PUT');
    });
  });

  describe('getConversationUsers', () => {
    it('should get the conversations related with an item', () => {
      const expectedUrl = `${environment.baseUrl}${ITEMS_API_URL}/${ITEM_ID}/conversation-users`;
      let response: ConversationUser[];

      service.getConversationUsers(ITEM_ID).subscribe((r) => (response = r));
      const req: TestRequest = httpMock.expectOne(expectedUrl);
      req.flush(CONVERSATION_USERS);

      expect(req.request.url).toEqual(expectedUrl);
      expect(response).toEqual(CONVERSATION_USERS);
      expect(req.request.method).toBe('GET');
    });
  });

  describe('getAvailableReactivationProducts', () => {
    it('should call endpoint', () => {
      const expectedUrl = `${environment.baseUrl}${WEB_ITEMS_API_URL}/${ITEM_ID}/available-reactivation-products`;
      let response: Product;

      service.getAvailableReactivationProducts(ITEM_ID).subscribe((r) => (response = r));
      const req: TestRequest = httpMock.expectOne(expectedUrl);
      req.flush(PRODUCTS_RESPONSE);

      expect(req.request.url).toEqual(expectedUrl);
      expect(response).toEqual(PRODUCT_RESPONSE);
      expect(req.request.method).toBe('GET');
    });
  });

  describe('purchaseProducts', () => {
    it('should purchase selected products with credit card', () => {
      const orderId = '10061993';
      const expectedUrl = `${environment.baseUrl}${WEB_ITEMS_API_URL}/purchase/products/${orderId}`;

      service.purchaseProducts([ORDER], orderId).subscribe();
      const req: TestRequest = httpMock.expectOne(expectedUrl);
      req.flush({});

      expect(req.request.url).toBe(expectedUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual([ORDER]);
      expect(req.request.headers.get('X-PaymentProvider')).toEqual(PAYMENT_PROVIDER);
    });
  });

  describe('purchaseProductsWithCredits', () => {
    it('should purchase selected products with Wallapop credits', () => {
      const orderId = '10061993';
      const expectedUrl = `${environment.baseUrl}${WEB_ITEMS_API_URL}/purchase/products/credit/${orderId}`;

      service.purchaseProductsWithCredits([ORDER], orderId).subscribe();
      const req: TestRequest = httpMock.expectOne(expectedUrl);
      req.flush({});

      expect(req.request.url).toBe(expectedUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual([ORDER]);
      expect(req.request.headers.get('X-PaymentProvider')).toEqual(PAYMENT_PROVIDER);
    });
  });

  describe('update', () => {
    describe('when updating a consumer goods item', () => {
      it('should update the item information', () => {
        const expectedUrl = `${environment.baseUrl}${ITEMS_API_URL}/${ITEM_ID}`;
        let response: any;

        service.update(ITEM_DATA, ITEM_TYPES.CONSUMER_GOODS).subscribe((r) => (response = r));
        const req: TestRequest = httpMock.expectOne(expectedUrl);
        req.flush(ITEM_DATA_V3);

        expect(req.request.url).toBe(expectedUrl);
        expect(response).toEqual(ITEM_DATA_V3);
        expect(req.request.method).toBe('PUT');
        expect(req.request.headers.get('X-DeviceOS')).toEqual('0');
      });

      it('should emit ITEM_UPDATED event', () => {
        const expectedUrl = `${environment.baseUrl}${ITEMS_API_URL}/${ITEM_ID}`;
        spyOn(eventService, 'emit');

        service.update(ITEM_DATA, ITEM_TYPES.CONSUMER_GOODS).subscribe();
        const req: TestRequest = httpMock.expectOne(expectedUrl);
        req.flush(ITEM_DATA_V3);

        expect(eventService.emit).toHaveBeenCalledWith(EventService.ITEM_UPDATED, ITEM_DATA);
      });
    });

    describe('when updating a car', () => {
      it('should update the car information', () => {
        const expectedUrl = `${environment.baseUrl}${ITEMS_API_URL}/cars/${CAR_ID}`;
        let response: any;

        service.update(CAR_DATA_FORM, ITEM_TYPES.CARS).subscribe((r: any) => {
          response = r;
        });
        const req: TestRequest = httpMock.expectOne(expectedUrl);
        req.flush(CAR_DATA);

        expect(req.request.url).toBe(expectedUrl);
        expect(response).toEqual(CAR_DATA);
        expect(req.request.method).toBe('PUT');
        expect(req.request.headers.get('X-DeviceOS')).toBe('0');
        expect(req.request.headers.get('X-PaymentProvider')).toBe(PAYMENT_PROVIDER);
        expect(req.request.headers.get('Accept')).toBe('application/vnd.edit-car-v2+json');
      });

      it('should emit ITEM_UPDATED event', () => {
        const expectedUrl = `${environment.baseUrl}${ITEMS_API_URL}/cars/${CAR_ID}`;
        spyOn(eventService, 'emit');

        service.update(CAR_DATA_FORM, ITEM_TYPES.CARS).subscribe();
        const req: TestRequest = httpMock.expectOne(expectedUrl);
        req.flush({});

        expect(eventService.emit).toHaveBeenCalledWith(EventService.ITEM_UPDATED, CAR_DATA_FORM);
      });
    });

    describe('when updating a real estate item', () => {
      it('should update the real estate information', () => {
        const expectedUrl = `${environment.baseUrl}${ITEMS_API_URL}/real_estate/${ITEM_ID}`;
        let response: any;

        service.update(UPLOAD_FORM_REALESTATE_VALUES, ITEM_TYPES.REAL_ESTATE).subscribe((r: any) => {
          response = r;
        });
        const req: TestRequest = httpMock.expectOne(expectedUrl);
        req.flush(REALESTATE_DATA);

        expect(req.request.url).toBe(expectedUrl);
        expect(response).toEqual(REALESTATE_DATA);
        expect(req.request.method).toBe('PUT');
        expect(req.request.headers.get('X-DeviceOS')).toBe('0');
      });

      it('should emit ITEM_UPDATED event', () => {
        const expectedUrl = `${environment.baseUrl}${ITEMS_API_URL}/real_estate/${ITEM_ID}`;
        spyOn(eventService, 'emit');

        service.update(UPLOAD_FORM_REALESTATE_VALUES, ITEM_TYPES.REAL_ESTATE).subscribe();
        const req: TestRequest = httpMock.expectOne(expectedUrl);
        req.flush({});

        expect(eventService.emit).toHaveBeenCalledWith(EventService.ITEM_UPDATED, UPLOAD_FORM_REALESTATE_VALUES);
      });
    });
  });

  describe('updateRealEstateLocation', () => {
    it('should update the real estate item location', () => {
      const expectedUrl = `${environment.baseUrl}${ITEMS_API_URL}/real_estate/${ITEM_ID}/location`;
      const expectedBody = REALESTATE_CONTENT_DATA.location;
      service.updateRealEstateLocation(ITEM_ID, REALESTATE_CONTENT_DATA.location).subscribe();
      const req: TestRequest = httpMock.expectOne(expectedUrl);
      req.flush({});

      expect(req.request.url).toBe(expectedUrl);
      expect(req.request.body).toEqual(expectedBody);
      expect(req.request.method).toBe('PUT');
    });
  });

  describe('deletePicture', () => {
    it('should delete one picture', () => {
      const PICTURE_ID = '1';
      const expectedUrl = `${environment.baseUrl}${ITEMS_API_URL}/${ITEM_ID}/picture/${PICTURE_ID}`;

      service.deletePicture(ITEM_ID, PICTURE_ID).subscribe();
      const req: TestRequest = httpMock.expectOne(expectedUrl);
      req.flush({});

      expect(req.request.url).toBe(expectedUrl);
      expect(req.request.method).toBe('DELETE');
    });
  });

  describe('get', () => {
    it('should get item information', () => {
      const expectedUrl = `${environment.baseUrl}${ITEMS_API_URL}/${ITEM_ID}/vertical`;
      let response: Item;

      service.get(ITEM_ID).subscribe((r) => (response = r));
      const req: TestRequest = httpMock.expectOne(expectedUrl);
      req.flush(ITEM_DATA_V3);

      expect(req.request.url).toEqual(expectedUrl);
      checkItemResponse(response);
      expect(req.request.method).toBe('GET');
    });

    describe('with backend errors', () => {
      it('should return a fake item', () => {
        const expectedUrl = `${environment.baseUrl}${ITEMS_API_URL}/${ITEM_ID}/vertical`;
        let response: Item;

        service.get(ITEM_ID).subscribe((r) => (response = r));
        httpMock.expectOne(expectedUrl).error(new ErrorEvent('network error'));

        expect(response.title).toBe(FAKE_ITEM_TITLE);
      });
    });
  });

  describe('updatePicturesOrder', () => {
    it('should change the order of item pictures', () => {
      const PICTURES_ORDER = {
        [UPLOAD_FILE_ID]: 0,
      };
      const expectedUrl = `${environment.baseUrl}${ITEMS_API_URL}/${ITEM_ID}/change-picture-order`;
      const expectedBody = {
        pictures_order: PICTURES_ORDER,
      };
      service.updatePicturesOrder(ITEM_ID, PICTURES_ORDER).subscribe();
      const req: TestRequest = httpMock.expectOne(expectedUrl);
      req.flush({});

      expect(req.request.url).toBe(expectedUrl);
      expect(req.request.body).toEqual(expectedBody);
      expect(req.request.method).toBe('PUT');
    });
  });

  describe('getItemsWithAvailableProducts', () => {
    it('should get items with available products for purchase', () => {
      const ITEM_IDS = ['1', '2'];
      const expectedUrlParams = `itemsIds=${ITEM_IDS.join(',')}`;
      const expectedUrl = `${environment.baseUrl}${WEB_ITEMS_API_URL}/available-visibility-products?${expectedUrlParams}`;
      let response: ItemWithProducts[];

      service.getItemsWithAvailableProducts(ITEM_IDS).subscribe((r) => (response = r));
      const req: TestRequest = httpMock.expectOne(expectedUrl);
      req.flush(ITEMS_WITH_AVAILABLE_PRODUCTS_RESPONSE);

      expect(req.request.urlWithParams).toEqual(expectedUrl);
      expect(response).toEqual(ITEMS_WITH_PRODUCTS);
      expect(req.request.method).toBe('GET');
    });
  });

  describe('getCheapestProductPrice', () => {
    it('should get the cheapest product', () => {
      const ITEM_IDS = ['1', '2'];
      const expectedUrlParams = `itemsIds=${ITEM_IDS.join(',')}`;
      const expectedUrl = `${environment.baseUrl}${WEB_ITEMS_API_URL}/available-visibility-products?${expectedUrlParams}`;
      let response: CheapestProducts;

      service.getCheapestProductPrice(ITEM_IDS).subscribe((r) => (response = r));
      const req: TestRequest = httpMock.expectOne(expectedUrl);
      req.flush(ITEMS_WITH_AVAILABLE_PRODUCTS_RESPONSE);

      expect(req.request.urlWithParams).toEqual(expectedUrl);
      expect(response).toEqual({ 1: '3.19', 2: '3.19' });
      expect(req.request.method).toBe('GET');
    });
  });

  describe('canDoAction', () => {
    it('should return true if action is allowed', () => {
      const expectedUrl = `${environment.baseUrl}${ITEMS_API_URL}/${ITEM_ID}/actions-allowed`;
      let response: boolean;

      service.canDoAction('mark_sold', ITEM_ID).subscribe((r) => (response = r));
      const req: TestRequest = httpMock.expectOne(expectedUrl);
      req.flush(ACTIONS_ALLOWED_CAN_MARK_SOLD_RESPONSE);

      expect(req.request.url).toEqual(expectedUrl);
      expect(response).toBe(true);
      expect(req.request.method).toBe('GET');
    });

    it('should return false if action is not allowed', () => {
      const expectedUrl = `${environment.baseUrl}${ITEMS_API_URL}/${ITEM_ID}/actions-allowed`;
      let response: boolean;

      service.canDoAction('mark_sold', ITEM_ID).subscribe((r) => (response = r));
      const req: TestRequest = httpMock.expectOne(expectedUrl);
      req.flush(ACTIONS_ALLOWED_CANNOT_MARK_SOLD_RESPONSE);

      expect(req.request.url).toEqual(expectedUrl);
      expect(response).toBe(false);
      expect(req.request.method).toBe('GET');
    });
  });

  describe('cancelAutorenew', () => {
    it('should cancel the item bump autorenew', () => {
      const expectedUrl = `${environment.baseUrl}${PROTOOL_API_URL}/autorenew/update`;
      const expectedBody = [
        {
          item_id: ITEM_ID,
          autorenew: false,
        },
      ];

      service.cancelAutorenew(ITEM_ID).subscribe();
      const req: TestRequest = httpMock.expectOne(expectedUrl);
      req.flush({});

      expect(req.request.url).toBe(expectedUrl);
      expect(req.request.body).toEqual(expectedBody);
      expect(req.request.method).toBe('PUT');
    });
  });

  describe('getLatest', () => {
    it('should return the latest item', () => {
      const expectedUrlParams = `userId=${USER_ID}`;
      const expectedUrl = `${environment.baseUrl}${ITEMS_API_URL}/latest-cars?${expectedUrlParams}`;
      let response: ItemDataResponse;

      service.getLatest(USER_ID).subscribe((r) => (response = r));
      const req: TestRequest = httpMock.expectOne(expectedUrl);
      req.flush(LATEST_ITEM_DATA);

      expect(req.request.urlWithParams).toEqual(expectedUrl);
      expect(response.data).toEqual(MOCK_ITEM_V3);
      expect(response.count).toEqual(LATEST_ITEM_COUNT - 1);
      expect(req.request.method).toBe('GET');
    });

    it('should return null item', () => {
      const expectedUrlParams = `userId=${USER_ID}`;
      const expectedUrl = `${environment.baseUrl}${ITEMS_API_URL}/latest-cars?${expectedUrlParams}`;
      let response: ItemDataResponse;

      service.getLatest(USER_ID).subscribe((r) => (response = r));
      const req: TestRequest = httpMock.expectOne(expectedUrl);
      req.flush(LATEST_ITEM_DATA_EMPTY);

      expect(req.request.urlWithParams).toEqual(expectedUrl);
      expect(response.data).toEqual(null);
      expect(response.count).toEqual(LATEST_ITEM_COUNT - 1);
      expect(req.request.method).toBe('GET');
    });
  });

  describe('bumpProItems', () => {
    it('should bump the selected items', () => {
      const expectedUrl = `${environment.baseUrl}${PROTOOL_API_URL}/purchaseItems`;
      let response: string[];

      service.bumpProItems(CART_ORDER_PRO).subscribe((r) => (response = r));
      const req: TestRequest = httpMock.expectOne(expectedUrl);
      req.flush('1234');

      expect(req.request.url).toBe(expectedUrl);
      expect(response).toEqual('1234');
      expect(req.request.body).toEqual(CART_ORDER_PRO);
      expect(req.request.method).toBe('POST');
    });
  });

  describe('activateSingleItem', () => {
    it('should active an item', () => {
      const id = '1';
      const expectedUrl = `${environment.baseUrl}${ITEMS_API_URL}/${id}/${ACTIVATE_ENDPOINT}`;

      service.activateSingleItem(id).subscribe();
      const req: TestRequest = httpMock.expectOne(expectedUrl);
      req.flush({});

      expect(req.request.url).toBe(expectedUrl);
      expect(req.request.body).toEqual({});
      expect(req.request.method).toBe('PUT');
    });
  });

  describe('mines', () => {
    function testPaginationAndGetMines() {
      let INIT = 0;
      const OFFSET = 300;
      let END = INIT + OFFSET;
      const STATUS = 'active';

      let expectedUrlParams = `status=${ITEM_STATUSES[STATUS]}&init=${INIT}&end=${END}&newVersion=true`;
      let expectedUrl = `${environment.baseUrl}${PROTOOL_API_URL}/mines?${expectedUrlParams}`;

      const req: TestRequest = httpMock.expectOne(expectedUrl);
      INIT = OFFSET * 1;
      END = INIT + OFFSET;
      req.flush([ITEM_DATA_V4, ITEM_DATA_V5]);

      expectedUrlParams = `status=${ITEM_STATUSES[STATUS]}&init=${INIT}&end=${END}&newVersion=true`;
      expectedUrl = `${environment.baseUrl}${PROTOOL_API_URL}/mines?${expectedUrlParams}`;
      const req2: TestRequest = httpMock.expectOne(expectedUrl);
      req2.flush([ITEM_DATA_V4, ITEM_DATA_V5]);

      INIT = OFFSET * 2;
      END = INIT + OFFSET;

      expectedUrlParams = `status=${ITEM_STATUSES[STATUS]}&init=${INIT}&end=${END}&newVersion=true`;
      expectedUrl = `${environment.baseUrl}${PROTOOL_API_URL}/mines?${expectedUrlParams}`;
      const req3: TestRequest = httpMock.expectOne(expectedUrl);
      req3.flush([]);
    }

    it('should map paginated responses from backend into one array', () => {
      let response: Item[];

      service.mines(1, 10, 'date_desc').subscribe((r) => (response = r));
      testPaginationAndGetMines();

      expect(response.length).toBe(4);
    });

    it('should return cached results after the second request', () => {
      let INIT = 0;
      const OFFSET = 300;
      let END = INIT + OFFSET;
      const STATUS = 'active';
      let expectedUrlParams = `status=${ITEM_STATUSES[STATUS]}&init=${INIT}&end=${END}&newVersion=true`;
      let expectedUrl = `${environment.baseUrl}${PROTOOL_API_URL}/mines?${expectedUrlParams}`;

      service['items'][STATUS] = [ITEM_DATA_V4.content, ITEM_DATA_V5.content] as any;
      service.mines(1, 10, 'date_desc').subscribe();

      httpMock.expectNone(expectedUrl);
    });

    it('should filter items by term', () => {
      let observableResponse: Item[];

      service.mines(1, 10, 'date_desc', undefined, 'title').subscribe((r) => (observableResponse = r));
      testPaginationAndGetMines();

      observableResponse = undefined;
      service.mines(1, 10, 'date_desc', undefined, 'title2').subscribe((r) => (observableResponse = r));

      expect(observableResponse.length).toBe(0);

      observableResponse = undefined;
      service.mines(1, 10, 'date_desc', undefined, 'test').subscribe((r) => (observableResponse = r));

      expect(observableResponse.length).toBe(0);

      observableResponse = undefined;
      service.mines(1, 10, 'date_desc', undefined, 'description').subscribe((r) => (observableResponse = r));

      expect(observableResponse.length).toBe(4);

      observableResponse = undefined;
      service.mines(1, 10, 'date_desc', undefined, 'description2').subscribe((r) => (observableResponse = r));

      expect(observableResponse.length).toBe(0);
    });

    it('should sort items by date', () => {
      let observableResponse: Item[];

      service.mines(1, 10, 'date_desc').subscribe((r) => (observableResponse = r));
      testPaginationAndGetMines();

      expect(observableResponse[0].publishedDate).toBe(ITEM_PUBLISHED_DATE);
      expect(observableResponse[1].publishedDate).toBe(ITEM_PUBLISHED_DATE);
      expect(observableResponse[2].publishedDate).toBe(ITEM_PUBLISHED_DATE);
      expect(observableResponse[3].publishedDate).toBe(ITEM_PUBLISHED_DATE);

      observableResponse = undefined;
      service.mines(1, 10, 'date_asc').subscribe((r) => (observableResponse = r));
      expect(observableResponse[0].publishedDate).toBe(ITEM_PUBLISHED_DATE);
      expect(observableResponse[1].publishedDate).toBe(ITEM_PUBLISHED_DATE);
      expect(observableResponse[2].publishedDate).toBe(ITEM_PUBLISHED_DATE);
      expect(observableResponse[3].publishedDate).toBe(ITEM_PUBLISHED_DATE);

      observableResponse = undefined;
      service.mines(1, 10, 'price_asc').subscribe((r) => (observableResponse = r));

      expect(observableResponse[0].salePrice).toBe(ITEM_SALE_PRICE);
      expect(observableResponse[1].salePrice).toBe(ITEM_SALE_PRICE);
      expect(observableResponse[2].salePrice).toBe(ITEM_SALE_PRICE);
      expect(observableResponse[3].salePrice).toBe(ITEM_SALE_PRICE);

      observableResponse = undefined;

      service.mines(1, 10, 'price_desc').subscribe((r) => (observableResponse = r));

      expect(observableResponse[0].salePrice).toBe(ITEM_SALE_PRICE);
      expect(observableResponse[1].salePrice).toBe(ITEM_SALE_PRICE);
      expect(observableResponse[2].salePrice).toBe(ITEM_SALE_PRICE);
      expect(observableResponse[3].salePrice).toBe(ITEM_SALE_PRICE);
    });
  });

  describe('setSold', () => {
    const ID: number = 1;
    const TOTAL: number = 5;
    let eventEmitted: boolean;
    let req: TestRequest;
    const expectedUrl = `${environment.baseUrl}${V1_API_URL}/item.json/${ID}/sold`;

    beforeEach(() => {
      service['items']['active'] = createItemsArray(TOTAL);
    });

    describe('sold array with items', () => {
      beforeEach(fakeAsync(() => {
        service['items']['sold'] = createItemsArray(TOTAL, TOTAL);
        eventService.subscribe(EventService.ITEM_SOLD, () => {
          eventEmitted = true;
        });
        service.setSold(ID).subscribe();

        req = httpMock.expectOne(expectedUrl);
        req.flush({});
      }));
      it('should remove item from active array', () => {
        expect(service['items']['active'].length).toBe(TOTAL - 1);
        expect(find(service['items']['active'], { legacyId: ID })).toBeFalsy();
      });

      it('should add item to sold array', () => {
        expect(service['items']['sold'].length).toBe(TOTAL + 1);
        expect(find(service['items']['sold'], { legacyId: ID })).toBeTruthy();
      });

      it('should emit event', () => {
        expect(eventEmitted).toBe(true);
      });
    });

    describe('sold array without items', () => {
      beforeEach(fakeAsync(() => {
        service.setSold(ID).subscribe();

        req = httpMock.expectOne(expectedUrl);
        req.flush({});
      }));

      it('should NOT add item to sold array', () => {
        expect(service['items']['sold'].length).toBe(0);
      });
    });
  });

  describe('bulkSetActivate', () => {
    const TOTAL: number = 5;
    let eventEmitted: boolean;
    let req: TestRequest;
    const expectedUrl = `${environment.baseUrl}${PROTOOL_API_URL}/changeItemStatus`;

    beforeEach(() => {
      spyOn(service, 'deselectItems');
      service['items']['active'] = createItemsArray(TOTAL);
      service['items']['pending'] = createItemsArray(TOTAL);
      service.selectedItems = ITEMS_BULK_UPDATED_IDS;
      eventService.subscribe('itemChangeStatus', () => {
        eventEmitted = true;
      });

      service.bulkSetActivate().subscribe();
      req = httpMock.expectOne(expectedUrl);
      req.flush({});
    });

    it('should call a post method with params', () => {
      expect(req.request.url).toBe(expectedUrl);
      expect(req.request.body).toEqual({
        itemIds: ITEMS_BULK_UPDATED_IDS,
        publishStatus: PUBLISHED_ID,
      });
      expect(req.request.method).toBe('POST');
    });

    it('should remove item from pending array', () => {
      expect(service['items']['pending'].length).toBe(TOTAL - 3);
      expect(find(service['items']['pending'], { id: ITEMS_BULK_UPDATED_IDS[0] })).toBeFalsy();
      expect(find(service['items']['pending'], { id: ITEMS_BULK_UPDATED_IDS[1] })).toBeFalsy();
      expect(find(service['items']['pending'], { id: ITEMS_BULK_UPDATED_IDS[2] })).toBeFalsy();
    });

    it('should add item to active array', () => {
      expect(service['items']['active'].length).toBe(TOTAL + 3);
      expect(find(service['items']['active'], { id: ITEMS_BULK_UPDATED_IDS[0] })).toBeTruthy();
      expect(find(service['items']['active'], { id: ITEMS_BULK_UPDATED_IDS[1] })).toBeTruthy();
      expect(find(service['items']['active'], { id: ITEMS_BULK_UPDATED_IDS[2] })).toBeTruthy();
    });

    it('should call deselectItems', () => {
      expect(service.deselectItems).toHaveBeenCalled();
    });

    it('should emit event', () => {
      expect(eventEmitted).toBe(true);
    });
  });

  describe('bulkSetDeactivate', () => {
    const TOTAL: number = 5;
    let eventEmitted: boolean;
    let req: TestRequest;
    const expectedUrl = `${environment.baseUrl}${PROTOOL_API_URL}/changeItemStatus`;

    beforeEach(() => {
      spyOn(service, 'deselectItems');
      service['items']['active'] = createItemsArray(TOTAL);
      service['items']['pending'] = createItemsArray(TOTAL);
      service.selectedItems = ITEMS_BULK_UPDATED_IDS;

      eventService.subscribe('itemChangeStatus', () => {
        eventEmitted = true;
      });

      service.bulkSetDeactivate().subscribe();
      req = httpMock.expectOne(expectedUrl);
      req.flush({});
    });

    it('should call a post method with params', () => {
      expect(req.request.url).toBe(expectedUrl);
      expect(req.request.body).toEqual({
        itemIds: ITEMS_BULK_UPDATED_IDS,
        publishStatus: ONHOLD_ID,
      });
      expect(req.request.method).toBe('POST');
    });

    it('should remove item from active array', () => {
      expect(service['items']['active'].length).toBe(TOTAL - 3);
      expect(find(service['items']['active'], { id: ITEMS_BULK_UPDATED_IDS[0] })).toBeFalsy();
      expect(find(service['items']['active'], { id: ITEMS_BULK_UPDATED_IDS[1] })).toBeFalsy();
      expect(find(service['items']['active'], { id: ITEMS_BULK_UPDATED_IDS[2] })).toBeFalsy();
    });

    it('should add item to pending array', () => {
      expect(service['items']['pending'].length).toBe(TOTAL + 3);
      expect(find(service['items']['pending'], { id: ITEMS_BULK_UPDATED_IDS[0] })).toBeTruthy();
      expect(find(service['items']['pending'], { id: ITEMS_BULK_UPDATED_IDS[1] })).toBeTruthy();
      expect(find(service['items']['pending'], { id: ITEMS_BULK_UPDATED_IDS[2] })).toBeTruthy();
    });

    it('should call deselectItems', () => {
      expect(service.deselectItems).toHaveBeenCalled();
    });

    it('should emit event', () => {
      expect(eventEmitted).toBe(true);
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
    it('should get the car information', () => {
      const BRAND = 'brand';
      const MODEL = 'model';
      const VERSION = 'version';
      const expectedUrlParams = `brand=${BRAND}&model=${MODEL}&version=${VERSION}`;
      const expectedUrl = `${environment.baseUrl}${ITEMS_API_URL}/cars/info?${expectedUrlParams}`;
      let response: CarInfo;

      service.getCarInfo(BRAND, MODEL, VERSION).subscribe((r) => (response = r));
      const req: TestRequest = httpMock.expectOne(expectedUrl);
      req.flush(CAR_INFO);

      expect(req.request.urlWithParams).toEqual(expectedUrl);
      expect(response).toEqual(CAR_INFO);
      expect(req.request.method).toBe('GET');
    });
  });

  describe('activate', () => {
    it('should mark the item as active', () => {
      const selectedItemIds = ['1', '2', '3'];
      const expectedUrl = `${environment.baseUrl}${ITEMS_API_URL}/activate`;
      const expectedBody = {
        ids: selectedItemIds,
      };

      service.selectedItems = selectedItemIds;
      service.activate().subscribe();
      const req: TestRequest = httpMock.expectOne(expectedUrl);
      req.flush({});

      expect(req.request.url).toBe(expectedUrl);
      expect(req.request.body).toEqual(expectedBody);
      expect(req.request.method).toBe('PUT');
    });
  });

  describe('deactivate', () => {
    it('should mark the item as inactive', () => {
      const selectedItemIds = ['1', '2', '3'];
      const expectedUrl = `${environment.baseUrl}${ITEMS_API_URL}/inactivate`;
      const expectedBody = {
        ids: selectedItemIds,
      };

      service.selectedItems = selectedItemIds;
      service.deactivate().subscribe();
      const req: TestRequest = httpMock.expectOne(expectedUrl);
      req.flush({});

      expect(req.request.url).toBe(expectedUrl);
      expect(req.request.body).toEqual(expectedBody);
      expect(req.request.method).toBe('PUT');
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
}
