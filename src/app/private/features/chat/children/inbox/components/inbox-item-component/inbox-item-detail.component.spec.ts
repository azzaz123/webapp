import { DecimalPipe } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SITE_URL } from '@configs/site-url.config';
import { ItemService } from '@core/item/item.service';
import { MOCKED_INBOX_CONVERSATIONS } from '@fixtures/chat';
import { ITEM_COUNTERS_DATA } from '@fixtures/item.fixtures.spec';
import { MOCK_SITE_URL } from '@fixtures/site-url.fixtures.spec';
import { CustomCurrencyPipe, ItemDetailRoutePipe } from '@shared/pipes';
import { CookieService } from 'ngx-cookie';
import { of } from 'rxjs';
import { InboxItemDetailComponent } from './inbox-item-detail.component';

describe('Component: Item', () => {
  let component: InboxItemDetailComponent;
  let fixture: ComponentFixture<InboxItemDetailComponent>;
  let itemService: ItemService;
  let cookieService: CookieService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InboxItemDetailComponent, CustomCurrencyPipe, ItemDetailRoutePipe],
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
        {
          provide: SITE_URL,
          useValue: MOCK_SITE_URL,
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });
    fixture = TestBed.createComponent(InboxItemDetailComponent);
    component = TestBed.createComponent(InboxItemDetailComponent).componentInstance;
    itemService = TestBed.inject(ItemService);
    cookieService = TestBed.inject(CookieService);
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
    const event = new Event('MouseEvent');

    beforeEach(() => {
      spyOn(event, 'preventDefault');
      spyOn(event, 'stopPropagation');
    });

    it('should prevent triggering the default click action', () => {
      component.prevent(event);

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
    const event = new Event('MouseEvent');

    it('should call the reserveItem method on itemService', () => {
      component.item = MOCKED_INBOX_CONVERSATIONS[0].item;
      spyOn(itemService, 'reserveItem').and.callThrough();

      component.toggleReserve(event);

      expect(itemService.reserveItem).toHaveBeenCalledWith(component.item.id, component.item.reserved);
    });

    it('should invert the boolean value of item.reserved when called', () => {
      component.item = MOCKED_INBOX_CONVERSATIONS[0].item;
      component.item.reserved = true;
      spyOn(itemService, 'reserveItem').and.callThrough();

      component.toggleReserve(event);

      expect(component.item.reserved).toBe(false);
    });

    it('should invert the boolean value of item.reserved when called', () => {
      component.item = MOCKED_INBOX_CONVERSATIONS[0].item;
      component.item.reserved = false;

      component.toggleReserve(event);

      expect(component.item.reserved).toBe(true);
    });
  });

  describe('trackSoldEvent', () => {
    beforeEach(() => {
      component.item = MOCKED_INBOX_CONVERSATIONS[0].item;
    });

    it('should emit ITEM_SOLD event', () => {
      spyOn(window as any, 'fbq');

      component.trackSoldEvent(MOCKED_INBOX_CONVERSATIONS[0].item);

      expect(window['fbq']).toHaveBeenCalledWith('track', 'CompleteRegistration', {
        value: MOCKED_INBOX_CONVERSATIONS[0].item.price.amount,
        currency: MOCKED_INBOX_CONVERSATIONS[0].item.price.currency,
      });
    });
  });
});
