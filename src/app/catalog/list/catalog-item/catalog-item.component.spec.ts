import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MOCK_ITEM, Item, TrackingService, MockTrackingService, ITEM_ID } from 'shield';

import { CatalogItemComponent } from './catalog-item.component';
import { ItemChangeEvent } from './item-change.interface';
import { Observable } from 'rxjs/Observable';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationModalComponent } from 'app/catalog/list/modals/confirmation-modal/confirmation-modal.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ItemService } from '../../../core/item/item.service';
import { SoldModalComponent } from '../modals/sold-modal/sold-modal.component';
import { MomentModule } from 'angular2-moment';
import { CustomCurrencyPipe } from '../../../shared/custom-currency/custom-currency.pipe';
import { DecimalPipe } from '@angular/common';

describe('CatalogItemComponent', () => {
  let component: CatalogItemComponent;
  let fixture: ComponentFixture<CatalogItemComponent>;
  let itemService: ItemService;
  let modalService: NgbModal;
  let trackingService: TrackingService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CatalogItemComponent, CustomCurrencyPipe],
      imports: [MomentModule],
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
          }
        }
        },
        {
          provide: NgbModal, useValue: {
          open() {
            return {
              result: Promise.resolve(),
              componentInstance: {
                item: null
              }
            };
          }
        }
        }
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
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('deleteItem', () => {

    let item: Item;

    beforeEach(fakeAsync(() => {
      item = MOCK_ITEM;
      spyOn(component, 'select');
      component.deleteItem(item);
    }));

    it('should set selectedAction', () => {
      expect(itemService.selectedAction).toBe('delete');
    });
    it('should call select', () => {
      expect(component.select).toHaveBeenCalledWith(MOCK_ITEM);
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
        expect(trackingService.track).toHaveBeenCalledWith(TrackingService.PRODUCT_UNRESERVED, {product_id: item.id});
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

    beforeEach(fakeAsync(() => {
      item = MOCK_ITEM;
      spyOn(modalService, 'open').and.callThrough();
      spyOn(trackingService, 'track');
      component.itemChange.subscribe(($event: ItemChangeEvent) => {
        event = $event;
      });
      component.setSold(item);
    }));

    afterEach(() => {
      event = undefined;
    });

    it('should open modal', fakeAsync(() => {
      tick();
      expect(modalService.open).toHaveBeenCalledWith(SoldModalComponent, {windowClass: 'sold'});
    }));

    it('should set sold true', () => {
      expect(item.sold).toBeTruthy();
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
