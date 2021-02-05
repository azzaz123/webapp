import { DecimalPipe } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { ErrorsService } from '@core/errors/errors.service';
import { EventService } from '@core/event/event.service';
import { Item } from '@core/item/item';
import { SelectedItemsAction } from '@core/item/item-response.interface';
import { ItemService } from '@core/item/item.service';
import { environment } from '@environments/environment';
import {
  ITEM_ID,
  ITEM_WEB_SLUG,
  MOCK_ITEM,
  ORDER_EVENT,
  PRODUCT_DURATION_MARKET_CODE,
  PRODUCT_RESPONSE,
} from '@fixtures/item.fixtures.spec';
import { ToastService } from '@layout/toast/core/services/toast.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustomCurrencyPipe } from '@shared/pipes';
import * as moment from 'moment';
import { DeviceDetectorService } from 'ngx-device-detector';
import { of, ReplaySubject } from 'rxjs';
import { ItemChangeEvent } from '../../core/item-change.interface';
import { ReactivateModalComponent } from '../../modals/reactivate-modal/reactivate-modal.component';
import { CatalogItemComponent } from './catalog-item.component';

describe('CatalogItemComponent', () => {
  let component: CatalogItemComponent;
  let fixture: ComponentFixture<CatalogItemComponent>;
  let itemService: ItemService;
  let modalService: NgbModal;
  let errorsService: ErrorsService;
  let eventService: EventService;
  let deviceService: DeviceDetectorService;
  const componentInstance = {
    price: null,
    item: null,
  };

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [CatalogItemComponent, CustomCurrencyPipe],
        providers: [
          DecimalPipe,
          EventService,
          ToastService,
          { provide: DeviceDetectorService, useClass: DeviceDetectorService },
          {
            provide: ItemService,
            useValue: {
              selectedItems: [],
              selectedItems$: new ReplaySubject<SelectedItemsAction>(1),
              selectItem() {},
              deselectItem() {},
              deleteItem() {
                return of({});
              },
              reserveItem() {
                return of({});
              },
              reactivateItem() {
                return of({});
              },
              getAvailableReactivationProducts() {},
              canDoAction() {
                return of(true);
              },
              getListingFeeInfo() {
                return of(PRODUCT_RESPONSE);
              },
            },
          },
          {
            provide: NgbModal,
            useValue: {
              open() {
                return {
                  result: Promise.resolve(),
                  componentInstance: componentInstance,
                };
              },
            },
          },
          {
            provide: ErrorsService,
            useValue: {
              i18nError() {},
            },
          },
          { provide: 'SUBDOMAIN', useValue: 'es' },
        ],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(CatalogItemComponent);
    component = fixture.componentInstance;
    component.item = MOCK_ITEM;
    fixture.detectChanges();
    itemService = TestBed.inject(ItemService);
    modalService = TestBed.inject(NgbModal);
    errorsService = TestBed.inject(ErrorsService);
    eventService = TestBed.inject(EventService);
    deviceService = TestBed.inject(DeviceDetectorService);
    appboy.initialize(environment.appboy);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set link', () => {
      expect(component.link).toBe(environment.siteUrl + 'item/' + ITEM_WEB_SLUG);
    });

    describe('selectMode', () => {
      it('should be false when no selected items', () => {
        itemService.selectedItems = [];

        expect(component.selectMode).toBeFalsy();
      });

      it('should be true when selected items', () => {
        itemService.selectedItems.push('id');
        itemService.selectedItems$.next();

        expect(component.selectMode).toBeTruthy();
      });
    });
  });

  describe('featureItem', () => {
    let item: Item;

    beforeEach(fakeAsync(() => {
      item = MOCK_ITEM;
      spyOn(component, 'select');
      component.featureItem(item);
    }));

    it('should set selectedAction', () => {
      expect(itemService.selectedAction).toBe('feature');
    });
    it('should call select', () => {
      expect(component.select).toHaveBeenCalledWith(MOCK_ITEM);
    });
  });

  describe('reserve', () => {
    let item: Item = MOCK_ITEM;

    describe('not reserved', () => {
      beforeEach(() => {
        spyOn(itemService, 'reserveItem').and.returnValue(of({}));
        item.reserved = false;
        component.reserve(item);
      });

      it('should set selectedAction', () => {
        expect(itemService.selectedAction).toBe('reserve');
      });

      it('should call reserveItem from itemService', () => {
        expect(itemService.reserveItem).toHaveBeenCalledWith(MOCK_ITEM.id, true);
        expect(item.reserved).toBeTruthy();
      });
    });

    describe('already reserved', () => {
      beforeEach(() => {
        spyOn(itemService, 'reserveItem').and.callThrough();
        spyOn(eventService, 'emit');
        item = MOCK_ITEM;
        item.reserved = true;

        component.reserve(item);
      });

      it('should call reserve with false', () => {
        expect(itemService.reserveItem).toHaveBeenCalledWith(ITEM_ID, false);
        expect(item.reserved).toBeFalsy();
      });

      it('should emit ITEM_RESERVED event', () => {
        expect(eventService.emit).toHaveBeenCalledWith(EventService.ITEM_RESERVED, item);
      });
    });
  });

  describe('reactivate', () => {
    beforeEach(() => {
      spyOn(itemService, 'getAvailableReactivationProducts').and.returnValue(of(PRODUCT_RESPONSE));
    });

    it('should call getAvailableReactivationProducts', () => {
      component.reactivate(MOCK_ITEM);

      expect(itemService.getAvailableReactivationProducts).toHaveBeenCalledWith(ITEM_ID);
    });

    it('should open dialog and set price', () => {
      spyOn(modalService, 'open').and.callThrough();

      component.reactivate(MOCK_ITEM);

      expect(modalService.open).toHaveBeenCalledWith(ReactivateModalComponent, {
        windowClass: 'modal-standard',
      });
      expect(componentInstance.price).toEqual(PRODUCT_DURATION_MARKET_CODE);
      expect(componentInstance.item).toEqual(MOCK_ITEM);
    });

    it('should emit reactivatedWithBump event if result is bump', fakeAsync(() => {
      spyOn(modalService, 'open').and.returnValue({
        result: Promise.resolve('bump'),
        componentInstance: componentInstance,
      });
      let event: ItemChangeEvent;
      component.itemChange.subscribe((e: ItemChangeEvent) => {
        event = e;
      });

      component.reactivate(MOCK_ITEM);
      tick();

      expect(event).toEqual({
        orderEvent: ORDER_EVENT,
        action: 'reactivatedWithBump',
      });
    }));

    it('should call reactivateItem if result is NOT bump', fakeAsync(() => {
      spyOn(modalService, 'open').and.returnValue({
        result: Promise.resolve('reactivate'),
        componentInstance: componentInstance,
      });
      spyOn(component, 'reactivateItem');
      let event: ItemChangeEvent;
      component.itemChange.subscribe((e: ItemChangeEvent) => {
        event = e;
      });

      component.reactivate(MOCK_ITEM);
      tick();

      expect(component.reactivateItem).toHaveBeenCalledWith(MOCK_ITEM);
    }));

    describe('if it`s a mobile device', () => {
      it('should reactivate the item without showing the modal', () => {
        spyOn(deviceService, 'isMobile').and.returnValue(true);
        spyOn(component, 'reactivateItem');
        spyOn(modalService, 'open');

        component.reactivate(MOCK_ITEM);

        expect(modalService.open).not.toHaveBeenCalled();
        expect(component.reactivateItem).toHaveBeenCalledWith(MOCK_ITEM);
      });
    });
  });

  describe('reactivateItem', () => {
    let item: Item;
    let event: ItemChangeEvent;

    beforeEach(fakeAsync(() => {
      item = MOCK_ITEM;
      spyOn(itemService, 'reactivateItem').and.callThrough();
      spyOn(appboy, 'logCustomEvent');
      component.itemChange.subscribe(($event: ItemChangeEvent) => {
        event = $event;
      });
      component.reactivateItem(item);
    }));

    afterEach(() => {
      event = undefined;
    });

    it('should call reactivateItem', () => {
      expect(itemService.reactivateItem).toHaveBeenCalledWith(ITEM_ID);
    });

    it('should emit the updated item', () => {
      expect(event.item).toEqual(item);
      expect(event.action).toBe('reactivated');
    });

    it('should send appboy ReactivateItem event', () => {
      expect(appboy.logCustomEvent).toHaveBeenCalledWith('ReactivateItem', {
        platform: 'web',
      });
    });
  });

  describe('select', () => {
    it('should set selected true and call selectItem', () => {
      const item: Item = MOCK_ITEM;
      item.selected = false;
      spyOn(itemService, 'selectItem');
      component.select(item);
      expect(item.selected).toBeTruthy();
      expect(itemService.selectItem).toHaveBeenCalledWith(ITEM_ID);
    });
    it('should set selected false and call deselectItem', () => {
      const item: Item = MOCK_ITEM;
      item.selected = true;
      spyOn(itemService, 'deselectItem');
      component.select(item);
      expect(item.selected).toBeFalsy();
      expect(itemService.deselectItem).toHaveBeenCalledWith(ITEM_ID);
    });
    it('should not modify selectedAction if is feature', () => {
      itemService.selectedAction = 'feature';

      component.select(MOCK_ITEM);

      expect(itemService.selectedAction).toBe('feature');
    });

    it('should set selectedAction to none if previous action was featured', () => {
      itemService.selectedAction = 'somethingelse';

      component.select(MOCK_ITEM);

      expect(itemService.selectedAction).toBe('');
    });
  });

  describe('setSold', () => {
    let item: Item;
    let event: ItemChangeEvent;

    describe('can mark as sold', () => {
      beforeEach(fakeAsync(() => {
        item = MOCK_ITEM;
        spyOn(eventService, 'emit');
        spyOn(window as any, 'fbq');
        component.itemChange.subscribe(($event: ItemChangeEvent) => {
          event = $event;
        });

        component.setSold(item);
      }));

      afterEach(() => {
        event = undefined;
      });

      it('should emit the updated item', () => {
        expect(event.item).toEqual(item);
        expect(event.action).toBe('sold');
      });

      it('should emit ITEM_SOLD event', () => {
        expect(eventService.emit).toHaveBeenCalledWith(EventService.ITEM_SOLD, item);
      });

      it('should emit facebook ITEM_SOLD event', () => {
        const facebookEvent = {
          value: MOCK_ITEM.salePrice,
          currency: MOCK_ITEM.currencyCode,
        };

        expect(window['fbq']).toHaveBeenCalledWith('track', 'CompleteRegistration', facebookEvent);
      });
    });
  });

  describe('showListingFee', () => {
    it('should return true when listing fee expiration is more than current time', () => {
      component.item.listingFeeExpiringDate = moment().add(2, 'seconds').valueOf();

      expect(component.showListingFee()).toEqual(true);
    });

    it('should return false when listing fee expiration is less than current time', () => {
      component.item.listingFeeExpiringDate = moment().subtract(2, 'seconds').valueOf();

      expect(component.showListingFee()).toEqual(false);
    });
  });

  describe('listingFeeFewDays', () => {
    it('should return false when listing fee expiration is more than 3 days', () => {
      component.item.listingFeeExpiringDate = moment().add(4, 'days').valueOf();

      expect(component.listingFeeFewDays()).toEqual(false);
    });

    it('should return true when listing fee expiration is less than 3 days', () => {
      component.item.listingFeeExpiringDate = moment().add(2, 'days').valueOf();

      expect(component.listingFeeFewDays()).toEqual(true);
    });
  });

  describe('publishItem', () => {
    const item: Item = MOCK_ITEM;

    it('should get the listing fee information related to the item', () => {
      spyOn(itemService, 'getListingFeeInfo').and.returnValue(of(PRODUCT_RESPONSE));

      component.publishItem();

      expect(itemService.getListingFeeInfo).toHaveBeenCalledWith(item.id);
    });
  });

  describe('onClickInfoElement', () => {
    it('should open the link', () => {
      spyOn(window, 'open');

      component.openItem();

      expect(window.open).toHaveBeenCalledTimes(1);
      expect(window.open).toHaveBeenCalledWith(component.link);
    });
  });

  describe('activateItem', () => {
    it('should emit the item to activate', () => {
      spyOn(component.itemChange, 'emit');
      const item: Item = MOCK_ITEM;

      component.activateItem(item);

      expect(component.itemChange.emit).toHaveBeenCalledWith({
        item,
        action: 'activate',
      });
    });
  });
});
