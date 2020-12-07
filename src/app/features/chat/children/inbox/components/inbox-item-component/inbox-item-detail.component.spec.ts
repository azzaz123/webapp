import { of } from 'rxjs';
/* tslint:disable:no-unused-variable */
import { DecimalPipe } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CookieService } from 'ngx-cookie';
import { InboxItemDetailComponent } from './inbox-item-detail.component';
import { ItemService } from '../../../../core/item/item.service';
import { TrackingService } from '../../../../core/tracking/tracking.service';
import { CustomCurrencyPipe } from '../../../../shared/pipes';
import { ITEM_COUNTERS_DATA } from '../../../../../tests/item.fixtures.spec';
import { MockTrackingService } from '../../../../../tests/tracking.fixtures.spec';
import { environment } from '../../../../../environments/environment.prod';
import { MOCKED_INBOX_CONVERSATIONS } from '../../../../../tests/inbox.fixtures.spec';

describe('Component: Item', () => {
  let component: InboxItemDetailComponent;
  let fixture: ComponentFixture<InboxItemDetailComponent>;
  let itemService: ItemService;
  let trackingService: TrackingService;
  let cookieService: CookieService;

  const MOCK_CLICK_EVENT = {
    stopPropagation() {},
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InboxItemDetailComponent, CustomCurrencyPipe],
      providers: [
        DecimalPipe,
        {
          provide: ItemService,
          useValue: {
            getCounters() {
              return of(ITEM_COUNTERS_DATA);
            },
            reserveItem() {
              return of({});
            },
          },
        },
        {
          provide: CookieService,
          useValue: {
            _value: {},
            put(key, value) {
              this._value[key] = value;
            },
            get(key) {
              return this._value[key];
            },
          },
        },
        { provide: TrackingService, useClass: MockTrackingService },
        { provide: 'SUBDOMAIN', useValue: 'es' },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });
    fixture = TestBed.createComponent(InboxItemDetailComponent);
    component = TestBed.createComponent(InboxItemDetailComponent)
      .componentInstance;
    itemService = TestBed.inject(ItemService);
    trackingService = TestBed.inject(TrackingService);
    cookieService = TestBed.inject(CookieService);
    appboy.initialize(environment.appboy);
  });

  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });

  describe('getCounters', () => {
    it('should add item counters', () => {
      component.item = MOCKED_INBOX_CONVERSATIONS[0].item;

      component.ngOnInit();

      expect(component.item.views).toBe(123);
      expect(component.item.favorites).toBe(456);
    });
  });

  describe('prevent', () => {
    beforeEach(() => {
      component.item = MOCKED_INBOX_CONVERSATIONS[0].item;
    });

    it('should call preventDefault and stopPropagation for the event when itemUrl is "#"', () => {
      const event = new Event('MouseEvent');
      spyOn(event, 'preventDefault');
      spyOn(event, 'stopPropagation');
      component.item.itemUrl = '#';

      component.prevent(event);

      expect(event.preventDefault).toHaveBeenCalled();
      expect(event.stopPropagation).toHaveBeenCalled();
    });

    it('should NOT call preventdefault for the event when itemUrl is not "#"', () => {
      const event = new Event('MouseEvent');
      spyOn(event, 'preventDefault');
      spyOn(event, 'stopPropagation');
      component.item.itemUrl = 'some-other-url';

      component.prevent(event);

      expect(event.preventDefault).not.toHaveBeenCalled();
      expect(event.stopPropagation).not.toHaveBeenCalled();
    });

    it('should call prevent when it is called with true as the second param', () => {
      const event = new Event('MouseEvent');
      spyOn(event, 'preventDefault');
      spyOn(event, 'stopPropagation');
      component.item.itemUrl = 'some-other-url';

      component.prevent(event, true);

      expect(event.preventDefault).toHaveBeenCalled();
      expect(event.stopPropagation).toHaveBeenCalled();
    });
  });

  describe('canEdit', () => {
    beforeEach(() => {
      component.item = MOCKED_INBOX_CONVERSATIONS[0].item;
    });

    it('should return true if the logged in user is the seller and the item has not already been sold', () => {
      component.item.sold = false;
      component.item.isMine = true;

      const expectedValue = component.canEdit();

      expect(expectedValue).toBe(true);
    });

    it('should return false if the logged in user is not the seller of the item', () => {
      component.item.sold = false;
      component.item.isMine = false;

      const expectedValue = component.canEdit();

      expect(expectedValue).toBe(false);
    });

    it('should return false if the item is already sold', () => {
      component.item.isMine = true;
      component.item.sold = true;

      const expectedValue = component.canEdit();

      expect(expectedValue).toBe(false);
    });
  });

  describe('toggleReserve', () => {
    it('should call the reserveItem method on itemService', () => {
      component.item = MOCKED_INBOX_CONVERSATIONS[0].item;
      spyOn(itemService, 'reserveItem').and.callThrough();

      component.toggleReserve();

      expect(itemService.reserveItem).toHaveBeenCalledWith(
        component.item.id,
        component.item.reserved
      );
    });

    it('should invert the boolean value of item.reserved when called', () => {
      component.item = MOCKED_INBOX_CONVERSATIONS[0].item;
      component.item.reserved = true;
      spyOn(itemService, 'reserveItem').and.callThrough();

      component.toggleReserve();

      expect(component.item.reserved).toBe(false);
    });

    it('should call the track method on trackingService when item.reserved is true', () => {
      component.item = MOCKED_INBOX_CONVERSATIONS[0].item;
      component.item.reserved = false;
      spyOn(trackingService, 'track').and.callThrough();

      component.toggleReserve();

      expect(component.item.reserved).toBe(true);
      expect(trackingService.track).toHaveBeenCalledWith(
        TrackingService.CHAT_PRODUCT_RESERVED,
        {
          item_id: MOCKED_INBOX_CONVERSATIONS[0].item.id,
        }
      );
    });
  });

  describe('trackSoldEvent', () => {
    beforeEach(() => {
      component.item = MOCKED_INBOX_CONVERSATIONS[0].item;
    });

    it('should the track method on trackingService when invoked', () => {
      spyOn(trackingService, 'track').and.callThrough();

      component.trackSoldEvent(component.item);

      expect(trackingService.track).toHaveBeenCalledWith(
        TrackingService.CHAT_PRODUCT_SOLD,
        {
          item_id: component.item.id,
        }
      );
    });

    it('should send appboy Sold event', () => {
      spyOn(appboy, 'logCustomEvent');

      component.trackSoldEvent(MOCKED_INBOX_CONVERSATIONS[0].item);

      expect(appboy.logCustomEvent).toHaveBeenCalledWith('Sold', {
        platform: 'web',
      });
    });

    it('should emit ITEM_SOLD event', () => {
      spyOn(window as any, 'fbq');

      component.trackSoldEvent(MOCKED_INBOX_CONVERSATIONS[0].item);

      expect(window['fbq']).toHaveBeenCalledWith(
        'track',
        'CompleteRegistration',
        {
          value: MOCKED_INBOX_CONVERSATIONS[0].item.price.amount,
          currency: MOCKED_INBOX_CONVERSATIONS[0].item.price.currency,
        }
      );
    });
  });
});
