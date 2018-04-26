import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CatalogProItemComponent } from './catalog-pro-item.component';
import { ItemService } from '../../../../core/item/item.service';
import { TrackingService } from '../../../../core/tracking/tracking.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustomCurrencyPipe } from '../../../../shared/custom-currency/custom-currency.pipe';
import { MockTrackingService } from '../../../../../tests/tracking.fixtures.spec';
import { DecimalPipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { ErrorsService } from '../../../../core/errors/errors.service';
import { MOCK_ITEM, ITEM_ID } from '../../../../../tests/item.fixtures.spec';
import { Observable } from 'rxjs/Observable';
import { MomentModule } from 'angular2-moment';
import { ItemChangeEvent } from '../../../list/catalog-item/item-change.interface';
import { Item } from '../../../../core/item/item';

describe('CatalogProItemComponent', () => {
  let component: CatalogProItemComponent;
  let fixture: ComponentFixture<CatalogProItemComponent>;
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
      declarations: [ CatalogProItemComponent, CustomCurrencyPipe ],
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
    fixture = TestBed.createComponent(CatalogProItemComponent);
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
});
