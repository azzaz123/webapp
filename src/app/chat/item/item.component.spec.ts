
import {of as observableOf,  Observable } from 'rxjs';
/* tslint:disable:no-unused-variable */
import { DecimalPipe } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomCurrencyPipe } from '../../shared/pipes';
import { ItemService } from '../../core/item/item.service';
import { ITEM_COUNTERS_DATA, ITEM_WEB_SLUG, MOCK_ITEM, MOCK_ITEM_CAR } from '../../../tests/item.fixtures.spec';
import { TrackingService } from '../../core/tracking/tracking.service';
import { UserService } from '../../core/user/user.service';
import { ItemComponent, mapfreLinks, showMapfreCategories, showVertiCategories, showWillisCategories, vertiLinks } from './item.component';
import { MOCK_USER } from '../../../tests/user.fixtures.spec';
import { MockTrackingService } from '../../../tests/tracking.fixtures.spec';
import { environment } from '../../../environments/environment';
import { Item } from '../../core/item/item';
import { CookieService } from 'ngx-cookie';
import { CATEGORY_IDS } from '../../core/category/category-ids';

describe('Component: Item', () => {

  let component: ItemComponent;
  let fixture: ComponentFixture<ItemComponent>;
  let userService: UserService;
  let itemService: ItemService;
  let trackingService: TrackingService;
  let cookieService: CookieService;

  const MOCK_CLICK_EVENT = {
    stopPropagation() { }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ItemComponent, CustomCurrencyPipe],
      providers: [
        DecimalPipe,
        {
          provide: ItemService, useValue: {
          getCounters() {
            return observableOf(ITEM_COUNTERS_DATA);
          },
          reserveItem() {
            return observableOf({});
          },
        }
        },
        {
          provide: UserService, useValue: {
          me() {
            return observableOf(MOCK_USER);
          }
        }
        },
        {
          provide: CookieService, useValue: {
          _value: {},
          put(key, value) {
            this._value[key] = value;
          },
          get(key) {
            return this._value[key];
          },
        }
        },
        {provide: TrackingService, useClass: MockTrackingService},
        {provide: 'SUBDOMAIN', useValue: 'es'}],
      schemas: [NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(ItemComponent);
    component = TestBed.createComponent(ItemComponent).componentInstance;
    userService = TestBed.inject(UserService);
    itemService = TestBed.inject(ItemService);
    trackingService = TestBed.inject(TrackingService);
    cookieService = TestBed.inject(CookieService);
    appboy.initialize(environment.appboy);
  });

  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call the me method on userServed when the component initialises', () => {
      spyOn(userService, 'me').and.callThrough();

      component.ngOnInit();

      expect(userService.me).toHaveBeenCalled();
    });
  });

  describe('isCarItem', () => {
    it('should be true when item categoryID is 100',  () => {
      component.item = MOCK_ITEM_CAR;

      component.ngOnChanges();

      expect(component.isCarItem).toBe(true);
    });

    it('should be false when item categoryID not equal 100',  () => {
      component.item = MOCK_ITEM;

      component.ngOnChanges();

      expect(component.isCarItem).toBe(false);
    });
  });

  it('should not track Willis Display when categoriId is 10000',  () => {
    spyOn(trackingService, 'track');
    component.item = { ...MOCK_ITEM, categoryId: 10000 } as Item;

    component.ngOnChanges();

    expect(trackingService.track).not.toHaveBeenCalled();
  });

  it('should track Willis Display when showWillisLink ',  () => {
    spyOn(trackingService, 'track');

    showWillisCategories.forEach((categoryId) => {
      component.item = { ...MOCK_ITEM, categoryId} as Item;
      component.ngOnChanges();

      expect(trackingService.track).toHaveBeenCalledWith(TrackingService.WILLIS_LINK_DISPLAY, {
        category_id: component.item.categoryId,
        item_id: component.item.id
      });
    });
  });

  it('should track Solcredito Display when showSolcreditoLink is true',  () => {
    spyOn(trackingService, 'track');
    const showSolcreditoCategories = Object.values(CATEGORY_IDS).filter( (key) => {
      if (![CATEGORY_IDS.REAL_ESTATE_OLD, CATEGORY_IDS.REAL_ESTATE, CATEGORY_IDS.CAR].includes(CATEGORY_IDS[key])) {
        return CATEGORY_IDS[key];
      }
    });
    showSolcreditoCategories.forEach((categoryId) => {
      component.item = { ...MOCK_ITEM, categoryId} as Item;
      component.ngOnChanges();

      expect(trackingService.track).toHaveBeenCalledWith(TrackingService.WILLIS_LINK_DISPLAY, {
        category_id: component.item.categoryId,
        item_id: component.item.id
      });
    });
  });

  describe('getCounters', () => {

    it('should add item counters', () => {
      component.item = MOCK_ITEM;

      component.ngOnChanges();

      expect(component.item.views).toBe(123);
      expect(component.item.favorites).toBe(456);
    });

  });

  it('should set itemUrl', () => {
    component.item = MOCK_ITEM;

    component.ngOnChanges();

    expect(component.itemUrl).toBe(environment.siteUrl + 'item/' + ITEM_WEB_SLUG);
  });

  describe('prevent', () => {

    it('should call preventDefault and stopPropagation for the event when itemUrl is "#"', () => {
      const event = new Event('MouseEvent');
      spyOn(event, 'preventDefault');
      spyOn(event, 'stopPropagation');
      component.itemUrl = '#';

      component.prevent(event);

      expect(event.preventDefault).toHaveBeenCalled();
      expect(event.stopPropagation).toHaveBeenCalled();
    });

    it('should NOT call preventdefault for the event when itemUrl is not "#"', () => {
      const event = new Event('MouseEvent');
      spyOn(event, 'preventDefault');
      spyOn(event, 'stopPropagation');
      component.itemUrl = 'some-other-url';

      component.prevent(event);

      expect(event.preventDefault).not.toHaveBeenCalled();
      expect(event.stopPropagation).not.toHaveBeenCalled();
    });

    it('should call prevent when it is called with true as the second param', () => {
      const event = new Event('MouseEvent');
      spyOn(event, 'preventDefault');
      spyOn(event, 'stopPropagation');
      component.itemUrl = 'some-other-url';

      component.prevent(event, true);

      expect(event.preventDefault).toHaveBeenCalled();
      expect(event.stopPropagation).toHaveBeenCalled();
    });
  });

  describe('canEdit', () => {
    beforeEach(() => {
      component.item = MOCK_ITEM;
    });

    it('should return true if the logged in user is the seller and the item has not already been sold', () => {
      component.item.sold = false;
      component['myUserId'] = component.item.owner;

      const expectedValue = component.canEdit();

      expect(expectedValue).toBe(true);
    });

    it('should return false if the logged in user is not the seller of the item', () => {
      component.item.sold = false;
      component['myUserId'] = 'some other id';

      const expectedValue = component.canEdit();

      expect(expectedValue).toBe(false);
    });

    it('should return false if the item is not already sold', () => {
      component['myUserID'] = component.item.owner;
      component.item.sold = false;

      const expectedValue = component.canEdit();

      expect(expectedValue).toBe(false);
    });
  });

  describe('isMine', () => {
    beforeEach(() => {
      component.item = MOCK_ITEM;
    });

    it('should return true if the logged user is item owner', () => {
      component['myUserId'] = component.item.owner;

      const expectedValue = component.isMine();

      expect(expectedValue).toBe(true);
    });

    it('should return false if the item is not already sold', () => {
      component['myUserID'] = 'Other Id';

      const expectedValue = component.canEdit();

      expect(expectedValue).toBe(false);
    });
  });

  describe('toggleReserve', () => {
    it('should call the reserveItem method on itemService', () => {
      component.item = MOCK_ITEM;
      spyOn(itemService, 'reserveItem').and.callThrough();

      component.toggleReserve();

      expect(itemService.reserveItem).toHaveBeenCalledWith(component.item.id, component.item.reserved);
    });

    it('should invert the boolean value of item.reserved when called', () => {
      component.item = MOCK_ITEM;
      component.item.reserved = true;
      spyOn(itemService, 'reserveItem').and.callThrough();

      component.toggleReserve();

      expect(component.item.reserved).toBe(false);
    });

    it('should call the track method on trackingService when item.reserved is true', () => {
      component.item = MOCK_ITEM;
      component.item.reserved = false;
      spyOn(trackingService, 'track').and.callThrough();

      component.toggleReserve();

      expect(component.item.reserved).toBe(true);
      expect(trackingService.track).toHaveBeenCalledWith(TrackingService.CHAT_PRODUCT_RESERVED, {item_id: MOCK_ITEM.id});
    });
  });


  describe('trackSoldEvent', () => {
    it('should the track method on trackingService when invoked', () => {
      component.item = MOCK_ITEM;
      spyOn(trackingService, 'track').and.callThrough();

      component.trackSoldEvent(component.item);

      expect(trackingService.track).toHaveBeenCalledWith(TrackingService.CHAT_PRODUCT_SOLD, {item_id: component.item.id});
    });


    it('should send appboy Sold event', () => {
      spyOn(appboy, 'logCustomEvent');

      component.trackSoldEvent(MOCK_ITEM);

      expect(appboy.logCustomEvent).toHaveBeenCalledWith('Sold', {platform: 'web'});
    });

    it('should emit ITEM_SOLD event', () => {
      spyOn(window as any, 'fbq');

      component.trackSoldEvent(MOCK_ITEM);

      expect(window['fbq']).toHaveBeenCalledWith('track', 'CompleteRegistration', { value: MOCK_ITEM.salePrice, currency: MOCK_ITEM.currencyCode});
    });
  });

  describe('mapfre link', () => {
    beforeEach(() => {
      cookieService.put('device_access_token_id', '1');
      component.ngOnInit();
    });

    it('should return mapfre link if device-access-token last num is even number', () => {
      component.item = { ...MOCK_ITEM, categoryId: CATEGORY_IDS.REAL_ESTATE} as Item;

      component.ngOnChanges();

      expect(component.getMapfreOrVertiLink()).toEqual(mapfreLinks[CATEGORY_IDS.REAL_ESTATE]);
    });

    it('should not return mapfre link if device-access-token last num is even number', () => {
      cookieService.put('device_access_token_id', '0');
      component.item = { ...MOCK_ITEM, categoryId: CATEGORY_IDS.REAL_ESTATE} as Item;

      component.ngOnInit();
      component.ngOnChanges();

      expect(component.getMapfreOrVertiLink()).not.toEqual(mapfreLinks[CATEGORY_IDS.REAL_ESTATE]);
    });

    it('should show when category car, real estate, motobike or bike', () => {
      showMapfreCategories.forEach((categoryId) => {
        component.item = { ...MOCK_ITEM, categoryId} as Item;

        component.ngOnChanges();

        expect(component.getMapfreOrVertiLink()).toEqual(mapfreLinks[categoryId]);
      });
    });

    it('should call track with mapfre display parameters', () => {
      component.item = { ...MOCK_ITEM, categoryId: CATEGORY_IDS.REAL_ESTATE } as Item;
      spyOn(trackingService, 'track').and.callThrough();

      component.ngOnChanges();

      expect(trackingService.track)
        .toHaveBeenCalledWith(TrackingService.MAPFRE_LINK_DISPLAY, { item_id: component.item.id, category_id: component.item.categoryId });
    });

    it('should send MAPFRE_LINK_TAP tracking event when clicked', () => {
      component.item = { ...MOCK_ITEM, categoryId: CATEGORY_IDS.REAL_ESTATE } as Item;
      spyOn(trackingService, 'track').and.callThrough();

      component.ngOnChanges();
      component.clickMapfreOrVerti(MOCK_CLICK_EVENT);

      expect(trackingService.track).toHaveBeenCalledWith(TrackingService.MAPFRE_LINK_TAP, {
        category_id: component.item.categoryId,
        item_id: component.item.id
      });
    });
  });

  describe('verti link', () => {
    beforeEach(() => {
      cookieService.put('device_access_token_id', '0');
      component.ngOnInit();
    });

    it('should return verti link if device-access-token las num is odd number', () => {
      component.item = { ...MOCK_ITEM, categoryId: CATEGORY_IDS.REAL_ESTATE} as Item;

      component.ngOnChanges();

      expect(component.getMapfreOrVertiLink()).toEqual(vertiLinks[CATEGORY_IDS.REAL_ESTATE]);
    });

    it('should not return verti link if device-access-token las num is odd number', () => {
      cookieService.put('device_access_token_id', '1');
      component.item = { ...MOCK_ITEM, categoryId: CATEGORY_IDS.REAL_ESTATE} as Item;

      component.ngOnInit();
      component.ngOnChanges();

      expect(component.getMapfreOrVertiLink()).not.toEqual(vertiLinks[CATEGORY_IDS.REAL_ESTATE]);
    });

    it('should show when category car, real estate or motobike', () => {
      showVertiCategories.forEach((categoryId) => {
        component.item = { ...MOCK_ITEM, categoryId} as Item;

        component.ngOnChanges();

        expect(component.getMapfreOrVertiLink()).toEqual(vertiLinks[categoryId]);
      });
    });

    it('should call track with verti display parameters', () => {
      component.item = { ...MOCK_ITEM, categoryId: CATEGORY_IDS.REAL_ESTATE } as Item;
      spyOn(trackingService, 'track').and.callThrough();

      component.ngOnChanges();

      expect(trackingService.track)
        .toHaveBeenCalledWith(TrackingService.VERTI_LINK_DISPLAY, { item_id: component.item.id, category_id: component.item.categoryId });
    });

    it('should send VERTI_LINK_TAP tracking event when clicked', () => {
      component.item = { ...MOCK_ITEM, categoryId: CATEGORY_IDS.REAL_ESTATE } as Item;
      spyOn(trackingService, 'track').and.callThrough();

      component.ngOnChanges();
      component.clickMapfreOrVerti(MOCK_CLICK_EVENT);

      expect(trackingService.track).toHaveBeenCalledWith(TrackingService.VERTI_LINK_TAP, {
        category_id: component.item.categoryId,
        item_id: component.item.id
      });
    });
  });

  describe('showWillisLink', () => {
    it('should be true when item categoryId is 13100, 12545, or 12900', () => {
      showWillisCategories.forEach((categoryId) => {
        component.item = { ...MOCK_ITEM, categoryId} as Item;
        component.ngOnChanges();

        expect(component.showWillisLink).toEqual(true);
      });
    });

    it('should be false when item categoryId is not 13100, 12545 or 12900', () => {
      const hideWillisCategories = [100, 14000];
      hideWillisCategories.forEach((categoryId) => {
        component.item = { ...MOCK_ITEM, categoryId} as Item;
        component.ngOnChanges();

        expect(component.showWillisLink).toEqual(false);
      });
    });
  });

  describe('showSolcreditLink', () => {
    it('should show item between 50€ - 499€', () => {
      const showSolcreditoCategories = Object.values(CATEGORY_IDS).filter( (key) => {
        if (![CATEGORY_IDS.REAL_ESTATE_OLD, CATEGORY_IDS.REAL_ESTATE, CATEGORY_IDS.CAR].includes(CATEGORY_IDS[key])) {
          return CATEGORY_IDS[key];
        }
      });

      showSolcreditoCategories.forEach((categoryId) => {
        component.item = { ...MOCK_ITEM, categoryId, salePrice: 499 } as Item;
        component.ngOnChanges();
        expect(component.showSolcreditoLink).toEqual(true);

        component.item = { ...MOCK_ITEM, salePrice: 50 } as Item;
        component.ngOnChanges();
        expect(component.showSolcreditoLink).toEqual(true);
      });
    });

    it('should hide with car and real state category', () => {
      const hideSolcreditoCategories = [CATEGORY_IDS.CAR, CATEGORY_IDS.REAL_ESTATE, CATEGORY_IDS.REAL_ESTATE_OLD];

      hideSolcreditoCategories.forEach((categoryId) => {
        component.item = { ...MOCK_ITEM, categoryId} as Item;
        component.ngOnChanges();

        expect(component.showSolcreditoLink).toEqual(false);
      });
    });
  });

  describe('clickWillis', () => {
    it('should track willis tap ', () => {
      spyOn(trackingService, 'track');
      component.item = MOCK_ITEM;

      component.clickWillis(MOCK_CLICK_EVENT);

      expect(trackingService.track).toHaveBeenCalledWith(TrackingService.WILLIS_LINK_TAP, {
        category_id: component.item.categoryId,
        item_id: component.item.id
      });
    });
  });

  describe('clickSolcredito', () => {
    it('should track solcredito tap ', () => {
      spyOn(trackingService, 'track');
      component.item = MOCK_ITEM;

      component.clickSolcredito(MOCK_CLICK_EVENT);

      expect(trackingService.track).toHaveBeenCalledWith(TrackingService.SOLCREDITO_LINK_TAP, {
        category_id: component.item.categoryId,
        item_id: component.item.id
      });
    });
  });
});
