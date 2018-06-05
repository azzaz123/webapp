import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CatalogCardComponent } from './catalog-card.component';
import { ItemService } from '../../../core/item/item.service';
import { TrackingService } from '../../../core/tracking/tracking.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustomCurrencyPipe } from '../../../shared/custom-currency/custom-currency.pipe';
import { MockTrackingService } from '../../../../tests/tracking.fixtures.spec';
import { DecimalPipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { ErrorsService } from '../../../core/errors/errors.service';
import { MOCK_ITEM, ITEM_ID, ITEM_DATA3, getMockItemWithPurchases } from '../../../../tests/item.fixtures.spec';
import { Observable } from 'rxjs/Observable';
import { MomentModule } from 'angular2-moment';
import { ItemChangeEvent } from '../../../catalog/list/catalog-item/item-change.interface';
import { Item } from '../../../core/item/item';
import { I18nService } from '../../../core/i18n/i18n.service';
import { environment } from '../../../../environments/environment';
import { EventService } from '../../../core/event/event.service';

describe('CatalogCardComponent', () => {
  let component: CatalogCardComponent;
  let fixture: ComponentFixture<CatalogCardComponent>;
  let itemService: ItemService;
  let modalService: NgbModal;
  let trackingService: TrackingService;
  let errorsService: ErrorsService;
  let i18nService: I18nService;
  let eventService: EventService;
  const modal: any = {modal: true};
  const componentInstance = {
    price: null,
    item: null
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CatalogCardComponent, CustomCurrencyPipe ],
      imports: [ MomentModule ],
      providers: [
        DecimalPipe,
        I18nService,
        {provide: TrackingService, useClass: MockTrackingService},
        {
          provide: ItemService, useValue: {
            selectedItems: [],
            selectItem() {
            },
            deselectItem() {
            },
            reserveItem() {
              return Observable.of({});
            },
            setSold() {
              return Observable.of({});
            },
            cancelAutorenew() {
              return Observable.of({});
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
        {provide: 'SUBDOMAIN', useValue: 'es'},
        EventService
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatalogCardComponent);
    component = fixture.componentInstance;
    component.item = MOCK_ITEM;
    fixture.detectChanges();
    itemService = TestBed.get(ItemService);
    modalService = TestBed.get(NgbModal);
    trackingService = TestBed.get(TrackingService);
    errorsService = TestBed.get(ErrorsService);
    i18nService = TestBed.get(I18nService);
    appboy.initialize(environment.appboy);
    eventService = TestBed.get(EventService);
  });

  describe('select', () => {
    it('should set selected true and call selectItem', () => {
      const item: Item = MOCK_ITEM;
      item.selected = false;
      spyOn(itemService, 'selectItem');

      component.select(item);

      expect(item.selected).toBe(true);
      expect(itemService.selectItem).toHaveBeenCalledWith(ITEM_ID);
    });

    it('should set selected false and call deselectItem', () => {
      const item: Item = MOCK_ITEM;
      item.selected = true;
      spyOn(itemService, 'deselectItem');

      component.select(item);

      expect(item.selected).toBe(false);
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
        spyOn(appboy, 'logCustomEvent');
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
        expect(trackingService.track).toHaveBeenCalledWith(TrackingService.PRODUCT_SOLD, {product_id: item.id});
      });

      it('should send appboy Sold event', () => {
        expect(appboy.logCustomEvent).toHaveBeenCalledWith('Sold', {platform: 'web'});
      });
    });
  });

  describe('reserve', () => {

    let item: Item;

    describe('not reserved', () => {
      beforeEach(fakeAsync(() => {
        spyOn(itemService, 'reserveItem').and.callThrough();
        item = MOCK_ITEM;
        item.reserved = false;
        component.reserve(item);
      }));

      it('should call reserve with false', () => {
        expect(itemService.reserveItem).toHaveBeenCalledWith(ITEM_ID, true);
        expect(item.reserved).toBe(true);
      });
    });

    describe('already reserved', () => {
      beforeEach(() => {
        spyOn(itemService, 'reserveItem').and.callThrough();
        spyOn(trackingService, 'track');
        item = MOCK_ITEM;
        item.reserved = true;
        component.reserve(item);
      });

      it('should call reserve with false', () => {
        expect(itemService.reserveItem).toHaveBeenCalledWith(ITEM_ID, false);
        expect(item.reserved).toBe(false);
      });
    });
  });

  describe('cancel Autorenew', () => {
    beforeEach(fakeAsync(() => {
      spyOn(itemService, 'cancelAutorenew').and.returnValue(Observable.of({'status': 200}));
      spyOn(modalService, 'open').and.callThrough();
      component.cancelAutorenew(MOCK_ITEM, modal);
      tick();
    }));

    it('should set selected true and call selectItem', () => {
      expect(modalService.open).toHaveBeenCalledWith(modal);
      expect(itemService.cancelAutorenew).toHaveBeenCalledWith(MOCK_ITEM.id);
    });
  });

  describe('ngOnInit', () => {

    it('should set the bump name', () => {
      spyOn(i18nService, 'getTranslations').and.callThrough();
      component.item = getMockItemWithPurchases();

      component.ngOnInit();

      expect(i18nService.getTranslations).toHaveBeenCalledWith(component.item.purchases.bump_type);
      expect(component.bumpName).toBe('City Bump');
    });
  });

});
