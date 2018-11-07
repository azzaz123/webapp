/* tslint:disable:no-unused-variable */
import { DecimalPipe } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs';
import { CustomCurrencyPipe } from '../../shared/custom-currency/custom-currency.pipe';
import { ItemService } from '../../core/item/item.service';
import {
  ITEM_COUNTERS_DATA, ITEM_FAVORITES, ITEM_VIEWS, ITEM_WEB_SLUG,
  MOCK_ITEM, MOCK_ITEM_CAR
} from '../../../tests/item.fixtures.spec';
import { TrackingService } from '../../core/tracking/tracking.service';
import { UserService } from '../../core/user/user.service';
import { ItemComponent, showWillisCategories, showKlincCategories } from './item.component';
import { MOCK_USER } from '../../../tests/user.fixtures.spec';
import { MockTrackingService } from '../../../tests/tracking.fixtures.spec';
import { environment } from '../../../environments/environment';
import { Item } from '../../core/item/item';
import {forEach} from "@angular/router/src/utils/collection";

describe('Component: Item', () => {

  let component: ItemComponent;
  let fixture: ComponentFixture<ItemComponent>;
  let userService: UserService;
  let itemService: ItemService;
  let trackingService: TrackingService;

  const MOCK_CLICK_EVENT = {
    stopPropagation(){}
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ItemComponent, CustomCurrencyPipe],
      providers: [
        DecimalPipe,
        {
          provide: ItemService, useValue: {
          getCounters() {
            return Observable.of(ITEM_COUNTERS_DATA);
          },
          reserveItem() {
            return Observable.of({});
          },
        }
        },
        {
          provide: UserService, useValue: {
          me() {
            return Observable.of(MOCK_USER);
          }
        }
        },
        {provide: TrackingService, useClass: MockTrackingService},
        {provide: 'SUBDOMAIN', useValue: 'es'}],
      schemas: [NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(ItemComponent);
    component = TestBed.createComponent(ItemComponent).componentInstance;
    userService = TestBed.get(UserService);
    itemService = TestBed.get(ItemService);
    trackingService = TestBed.get(TrackingService);
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

  it('should track Carfax Display when isCarItem is true',  () => {
    spyOn(trackingService, 'track');
    component.item = MOCK_ITEM_CAR;

    component.ngOnChanges();

    expect(trackingService.track).toHaveBeenCalledWith(TrackingService.CARFAX_CHAT_DISPLAY, {
      category_id: component.item.categoryId,
      item_id: component.item.id
    });
  });

  it('should not track Carfax Display when isCarItem is false',  () => {
    spyOn(trackingService, 'track');
    component.item = { ...MOCK_ITEM, categoryId: 12345678 } as Item;

    component.ngOnChanges();

    expect(trackingService.track).not.toHaveBeenCalled();
  });

  it('should not track Willis Display when categoriId is 10000',  () => {
    spyOn(trackingService, 'track');
    component.item = { ...MOCK_ITEM, categoryId: 10000 } as Item;

    component.ngOnChanges();

    expect(trackingService.track).not.toHaveBeenCalled();
  });

  it('should track Willis Display when showWillisLink ',  () => {
    spyOn(trackingService, 'track');

    Object.values(showWillisCategories).forEach((categoryId) => {
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
  });

  describe('showWillisLink', () => {
    it('should be true when item categoryId is 13100, 12545, or 12900', () => {
      Object.values(showWillisCategories).forEach((categoryId) => {
        component.item = { ...MOCK_ITEM, categoryId} as Item;
        component.ngOnChanges();

        expect(component.showWillisLink).toEqual(true);
      });
    });

    it('should be false when item categoryId is not 13100, 12545 or 12900', () => {
      const hideWillisCategories = [100, 14000];
      Object.values(hideWillisCategories).forEach((categoryId) => {
        component.item = { ...MOCK_ITEM, categoryId} as Item;
        component.ngOnChanges();

        expect(component.showWillisLink).toEqual(false);
      });
    });
  });

  describe('showKlincLink', () => {
    it('should be true when item categoryId is 15000, 16000', () => {
      Object.values(showKlincCategories).forEach((categoryId) => {
        component.item = { ...MOCK_ITEM, categoryId} as Item;
        component.ngOnChanges();

        expect(component.showKlincLink).toEqual(true);
      });
    });

    it('should be false when item categoryId is not 15000, 16000', () => {
      const hideWillisCategories = [100, 14000];
      Object.values(hideWillisCategories).forEach((categoryId) => {
        component.item = { ...MOCK_ITEM, categoryId} as Item;
        component.ngOnChanges();

        expect(component.showKlincLink).toEqual(false);
      });
    });
  });

  describe('clickCarfax', () => {
    it('should track Carfax tap ', () => {
      spyOn(trackingService, 'track');
      component.item = MOCK_ITEM;

      component.clickCarfax(MOCK_CLICK_EVENT);

      expect(trackingService.track).toHaveBeenCalledWith(TrackingService.CARFAX_CHAT_TAP, {
        category_id: component.item.categoryId,
        item_id: component.item.id
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

  describe('clickKlinc', () => {
    it('should track klinc tap ', () => {
      spyOn(trackingService, 'track');
      component.item = MOCK_ITEM;

      component.clickKlinc(MOCK_CLICK_EVENT);

      expect(trackingService.track).toHaveBeenCalledWith(TrackingService.KLINC_LINK_TAP, {
        category_id: component.item.categoryId,
        item_id: component.item.id
      });
    });
  });
});
