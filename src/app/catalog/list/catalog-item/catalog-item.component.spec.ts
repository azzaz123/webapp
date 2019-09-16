import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { CatalogItemComponent } from './catalog-item.component';
import { ItemChangeEvent } from './item-change.interface';
import { Observable, of } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ItemService } from '../../../core/item/item.service';
import { SoldModalComponent } from '../../../shared/modals/sold-modal/sold-modal.component';
import { MomentModule } from 'angular2-moment';
import { CustomCurrencyPipe } from '../../../shared/custom-currency/custom-currency.pipe';
import { DecimalPipe } from '@angular/common';
import { TrackingService } from '../../../core/tracking/tracking.service';
import { ReactivateModalComponent } from '../modals/reactivate-modal/reactivate-modal.component';
import {
  ITEM_ID,
  MOCK_ITEM, ORDER_EVENT, PRODUCT_DURATION_MARKET_CODE,
  PRODUCT_RESPONSE, ITEM_WEB_SLUG
} from '../../../../tests/item.fixtures.spec';
import { ToastrService } from 'ngx-toastr';
import { ErrorsService } from '../../../core/errors/errors.service';
import { MockTrackingService } from '../../../../tests/tracking.fixtures.spec';
import { Item } from '../../../core/item/item';
import { EventService } from '../../../core/event/event.service';
import { environment } from '../../../../environments/environment';
import * as moment from 'moment';
import { ThousandSuffixesPipe } from '../../../shared/number-conversion/thousand-suffixes.pipe';

describe('CatalogItemComponent', () => {
  let component: CatalogItemComponent;
  let fixture: ComponentFixture<CatalogItemComponent>;
  let itemService: ItemService;
  let modalService: NgbModal;
  let trackingService: TrackingService;
  let errorsService: ErrorsService;
  let eventService: EventService;
  const componentInstance = {
    price: null,
    item: null
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CatalogItemComponent, CustomCurrencyPipe, ThousandSuffixesPipe],
      imports: [MomentModule],
      providers: [
        DecimalPipe,
        EventService,
        { provide: TrackingService, useClass: MockTrackingService },
        {
          provide: ItemService, useValue: {
            selectedItems: [],
            selectItem() {
            },
            deselectItem() {
            },
            deleteItem() {
              return Observable.of({});
            },
            reserveItem() {
              return Observable.of({});
            },
            reactivateItem() {
              return Observable.of({});
            },
            getAvailableReactivationProducts() {
            },
            canDoAction() {
              return Observable.of(true);
            },
            getListingFeeInfo() {
              return Observable.of(PRODUCT_RESPONSE);
            }
          }
        },
        {
          provide: NgbModal, useValue: {
            open() {
              return {
                result: Promise.resolve(),
                componentInstance: componentInstance
              };
            }
          }
        },
        {
          provide: ToastrService, useValue: {
            error() {
            }
          }
        },
        {
          provide: ErrorsService, useValue: {
            i18nError() {
            }
          }
        },
        { provide: 'SUBDOMAIN', useValue: 'es' }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatalogItemComponent);
    component = fixture.componentInstance;
    component.item = MOCK_ITEM;
    fixture.detectChanges();
    itemService = TestBed.get(ItemService);
    modalService = TestBed.get(NgbModal);
    trackingService = TestBed.get(TrackingService);
    errorsService = TestBed.get(ErrorsService);
    eventService = TestBed.get(EventService);
    appboy.initialize(environment.appboy);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set link', () => {
      expect(component.link).toBe(environment.siteUrl + 'item/' + ITEM_WEB_SLUG);
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
        spyOn(trackingService, 'track');
        spyOn(eventService, 'emit');
        item = MOCK_ITEM;
        item.reserved = true;

        component.reserve(item);
      });

      it('should call reserve with false', () => {
        expect(itemService.reserveItem).toHaveBeenCalledWith(ITEM_ID, false);
        expect(item.reserved).toBeFalsy();
      });

      it('should track the ProductUnReserved event', () => {
        expect(trackingService.track).toHaveBeenCalledWith(TrackingService.PRODUCT_UNRESERVED, { product_id: item.id });
      });

      it('should emit ITEM_RESERVED event', () => {
        expect(eventService.emit).toHaveBeenCalledWith(EventService.ITEM_RESERVED, item);
      });
    });
  });

  describe('reactivate', () => {

    beforeEach(() => {
      spyOn(itemService, 'getAvailableReactivationProducts').and.returnValue(Observable.of(PRODUCT_RESPONSE));
    });

    it('should call getAvailableReactivationProducts', () => {
      component.reactivate(MOCK_ITEM);

      expect(itemService.getAvailableReactivationProducts).toHaveBeenCalledWith(ITEM_ID);
    });

    it('should open dialog and set price', () => {
      spyOn(modalService, 'open').and.callThrough();

      component.reactivate(MOCK_ITEM);

      expect(modalService.open).toHaveBeenCalledWith(ReactivateModalComponent, {
        windowClass: 'modal-standard'
      });
      expect(componentInstance.price).toEqual(PRODUCT_DURATION_MARKET_CODE);
      expect(componentInstance.item).toEqual(MOCK_ITEM);
    });

    it('should emit reactivatedWithBump event if result is bump', fakeAsync(() => {
      spyOn(modalService, 'open').and.returnValue({
        result: Promise.resolve('bump'),
        componentInstance: componentInstance
      });
      let event: ItemChangeEvent;
      component.itemChange.subscribe((e: ItemChangeEvent) => {
        event = e;
      });

      component.reactivate(MOCK_ITEM);
      tick();

      expect(event).toEqual({
        orderEvent: ORDER_EVENT,
        action: 'reactivatedWithBump'
      });
    }));

    it('should call reactivateItem if result is NOT bump', fakeAsync(() => {
      spyOn(modalService, 'open').and.returnValue({
        result: Promise.resolve('reactivate'),
        componentInstance: componentInstance
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
      expect(appboy.logCustomEvent).toHaveBeenCalledWith('ReactivateItem', { platform: 'web' });
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
  });

  describe('setSold', () => {

    let item: Item;
    let event: ItemChangeEvent;

    describe('can mark as sold', () => {
      beforeEach(fakeAsync(() => {
        item = MOCK_ITEM;
        spyOn(trackingService, 'track');
        spyOn(eventService, 'emit');
        spyOn(window, 'fbq');
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

      it('should track the DeleteItem event', () => {
        expect(trackingService.track).toHaveBeenCalledWith(TrackingService.PRODUCT_SOLD, { product_id: item.id });
      });

      it('should emit ITEM_SOLD event', () => {
        expect(eventService.emit).toHaveBeenCalledWith(EventService.ITEM_SOLD, item);
      });

      it('should emit facebook ITEM_SOLD event', () => {
        const facebookEvent = { value: MOCK_ITEM.salePrice, currency: MOCK_ITEM.currencyCode};

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
      spyOn(itemService, 'getListingFeeInfo').and.returnValue(Observable.of(PRODUCT_RESPONSE));

      component.publishItem();

      expect(itemService.getListingFeeInfo).toHaveBeenCalledWith(item.id);
    });

    it('should send PURCHASE_LISTING_FEE_CATALOG tracking event for Sabadell', () => {
      component.paymentMethod = 'SABADELL';
      spyOn(trackingService, 'track');

      component.publishItem();

      expect(trackingService.track)
      .toHaveBeenCalledWith(TrackingService.PURCHASE_LISTING_FEE_CATALOG, {
        item_id: item.id,
        payment_method: 'SABADELL'
      });
    });

    it('should send PURCHASE_LISTING_FEE_CATALOG tracking event for Stripe', () => {
      component.paymentMethod = 'STRIPE';
      spyOn(trackingService, 'track');

      component.publishItem();

      expect(trackingService.track)
        .toHaveBeenCalledWith(TrackingService.PURCHASE_LISTING_FEE_CATALOG, {
          item_id: item.id,
          payment_method: 'STRIPE'
        });
    });
  });
});
