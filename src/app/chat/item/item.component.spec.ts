/* tslint:disable:no-unused-variable */
import { DecimalPipe } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { CustomCurrencyPipe } from '../../shared/custom-currency/custom-currency.pipe';
import { ItemService } from '../../core/item/item.service';
import {
  ITEM_COUNTERS_DATA, ITEM_FAVORITES, ITEM_VIEWS, ITEM_WEB_SLUG,
  MOCK_ITEM
} from '../../../tests/item.fixtures.spec';
import { TrackingService } from '../../core/tracking/tracking.service';
import { UserService } from '../../core/user/user.service';
import { ItemComponent } from './item.component';
import { MOCK_USER } from '../../../tests/user.fixtures.spec';
import { MockTrackingService } from '../../../tests/tracking.fixtures.spec';
import { environment } from '../../../environments/environment';

describe('Component: Item', () => {

  let component: ItemComponent;
  let fixture: ComponentFixture<ItemComponent>;
  let userService: UserService;
  let itemService: ItemService;
  let trackingService: TrackingService;

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

  describe('getCounters', () => {

    it('should add item counters', () => {
      component.item = MOCK_ITEM;

      component.ngOnChanges();

      expect(component.item.views).toBe(ITEM_VIEWS);
      expect(component.item.favorites).toBe(ITEM_FAVORITES);
    });

    it('should not add item counters', () => {
      component.item = MOCK_ITEM;
      component.item.views = 1000;
      component.item.favorites = 1000;

      component.ngOnChanges();

      expect(component.item.views).toBe(1000);
      expect(component.item.favorites).toBe(1000);
    });

  });

  it('should set itemUrl', () => {
    component.item = MOCK_ITEM;

    component.ngOnChanges();

    expect(component.itemUrl).toBe('https://es.wallapop.com/item/' + ITEM_WEB_SLUG);
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

});
