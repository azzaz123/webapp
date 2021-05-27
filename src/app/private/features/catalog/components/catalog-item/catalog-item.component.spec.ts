import { DecimalPipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, waitForAsync } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { ErrorsService } from '@core/errors/errors.service';
import { EventService } from '@core/event/event.service';
import { I18nService } from '@core/i18n/i18n.service';
import { Item } from '@core/item/item';
import { SelectedItemsAction } from '@core/item/item-response.interface';
import { ItemService } from '@core/item/item.service';
import { UserService } from '@core/user/user.service';
import { environment } from '@environments/environment';
import { MockAnalyticsService } from '@fixtures/analytics.fixtures.spec';
import { ITEM_ID, ITEM_WEB_SLUG, MOCK_ITEM, PRODUCT_RESPONSE } from '@fixtures/item.fixtures.spec';
import { MockedUserService } from '@fixtures/user.fixtures.spec';
import { ToastService } from '@layout/toast/core/services/toast.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ItemRequiredDataService } from '@private/core/services/item-required-data/item-required-data.service';
import { UPLOAD_PATHS } from '@private/features/upload/upload-routing-constants';
import { CustomCurrencyPipe } from '@shared/pipes';
import * as moment from 'moment';
import { DeviceDetectorService } from 'ngx-device-detector';
import { of, ReplaySubject } from 'rxjs';
import { ItemChangeEvent } from '../../core/item-change.interface';
import { CatalogItemTrackingEventService } from '../../core/services/catalog-item-tracking-event.service';
import { CatalogItemComponent } from './catalog-item.component';

describe('CatalogItemComponent', () => {
  let component: CatalogItemComponent;
  let fixture: ComponentFixture<CatalogItemComponent>;
  let itemService: ItemService;
  let eventService: EventService;
  let itemRequiredDataService: ItemRequiredDataService;
  let catalogItemTrackingEventService: CatalogItemTrackingEventService;
  let router: Router;
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
          ItemRequiredDataService,
          CatalogItemTrackingEventService,
          { provide: AnalyticsService, useClass: MockAnalyticsService },
          { provide: UserService, useClass: MockedUserService },
          {
            provide: Router,
            useValue: {
              navigate() {},
            },
          },
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
          I18nService,
          { provide: 'SUBDOMAIN', useValue: 'es' },
        ],
        imports: [HttpClientTestingModule],
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
    eventService = TestBed.inject(EventService);
    itemRequiredDataService = TestBed.inject(ItemRequiredDataService);
    catalogItemTrackingEventService = TestBed.inject(CatalogItemTrackingEventService);
    router = TestBed.inject(Router);
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

  describe('reactivateItem', () => {
    let item: Item;
    let event: ItemChangeEvent;

    beforeEach(fakeAsync(() => {
      item = MOCK_ITEM;
      spyOn(itemService, 'reactivateItem').and.callThrough();

      component.itemChange.subscribe(($event: ItemChangeEvent) => {
        event = $event;
      });
    }));

    afterEach(() => {
      event = undefined;
    });

    it('should check if all required data is informed', () => {
      spyOn(itemRequiredDataService, 'hasMissingRequiredDataByItemId').and.callThrough();

      component.reactivate(item);

      expect(itemRequiredDataService.hasMissingRequiredDataByItemId).toHaveBeenCalledWith(component.item.id);
    });

    it('should track reactivation event', () => {
      jest.spyOn(itemRequiredDataService, 'hasMissingRequiredDataByItemId').mockReturnValue(of(false));
      spyOn(catalogItemTrackingEventService, 'trackReactivateItemEvent').and.callThrough();

      component.reactivate(item);

      expect(catalogItemTrackingEventService.trackReactivateItemEvent).toHaveBeenCalledWith(component.item);
    });

    describe('and item has all required data', () => {
      beforeEach(() => {
        jest.spyOn(itemRequiredDataService, 'hasMissingRequiredDataByItemId').mockReturnValue(of(false));

        component.reactivate(item);
      });

      it('should call reactivateItem', () => {
        expect(itemService.reactivateItem).toHaveBeenCalledWith(ITEM_ID);
      });

      it('should emit the updated item', () => {
        expect(event.item).toEqual(item);
        expect(event.action).toBe('reactivated');
      });
    });

    describe('and item has missing data', () => {
      beforeEach(() => {
        jest.spyOn(itemRequiredDataService, 'hasMissingRequiredDataByItemId').mockReturnValue(of(true));
        spyOn(router, 'navigate');

        component.reactivate(item);
      });

      it('should navigate to reactivation view reactivateItem', () => {
        expect(router.navigate).toHaveBeenCalledWith([`/catalog/edit/${component.item.id}/${UPLOAD_PATHS.REACTIVATE}`]);
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
