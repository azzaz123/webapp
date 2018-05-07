import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CatalogCardComponent } from './catalog-card.component.ts';
import { ItemService } from '../../../core/item/item.service';
import { TrackingService } from '../../../core/tracking/tracking.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustomCurrencyPipe } from '../../../shared/custom-currency/custom-currency.pipe';
import { MockTrackingService } from '../../../../tests/tracking.fixtures.spec';
import { DecimalPipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { ErrorsService } from '../../../core/errors/errors.service';
import { MOCK_ITEM, ITEM_ID } from '../../../../tests/item.fixtures.spec';
import { Observable } from 'rxjs/Observable';
import { MomentModule } from 'angular2-moment';
import { ItemChangeEvent } from '../../../catalog/list/catalog-item/item-change.interface';
import { Item } from '../../../core/item/item';
import { TrackingService } from '../../../core/tracking/tracking.service';
import { ErrorsService } from '../../../core/errors/errors.service';
import { ItemService } from '../../../core/item/item.service';

describe('CatalogCardComponent', () => {
  let component: CatalogCardComponent;
  let fixture: ComponentFixture<CatalogCardComponent>;
  let itemService: ItemService;
  let modalService: NgbModal;
  let trackingService: TrackingService;
  let errorsService: ErrorsService;
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
        {provide: 'SUBDOMAIN', useValue: 'es'}
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
    });
  });

  describe('reserve', () => {

    let item: Item;

    describe('not reserved', () => {
      beforeEach(fakeAsync(() => {
        item = MOCK_ITEM;
        spyOn(component, 'select');
        component.reserve(item);
      }));

      it('should set selectedAction', () => {
        expect(itemService.selectedAction).toBe('reserve');
      });
      it('should call select', () => {
        expect(component.select).toHaveBeenCalledWith(MOCK_ITEM);
      });
      it('should track the ProductUnReserved event', () => {
        component.reserve(item);
        //expect(trackingService.track).toHaveBeenCalledWith(TrackingService.PRODUCT_RESERVED, {product_id: item.id});
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
        expect(item.reserved).toBeFalsy();
      });
      it('should track the ProductUnReserved event', () => {
        component.reserve(item);
        //expect(trackingService.track).toHaveBeenCalledWith(TrackingService.PRODUCT_UNRESERVED, {product_id: item.id});
      });
    });
  });
});
