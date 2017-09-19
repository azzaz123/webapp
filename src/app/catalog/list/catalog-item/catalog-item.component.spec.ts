import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MOCK_ITEM, Item, TrackingService, MockTrackingService, ITEM_ID } from 'shield';

import { CatalogItemComponent } from './catalog-item.component';
import { ItemChangeEvent } from './item-change.interface';
import { Observable } from 'rxjs/Observable';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeleteItemComponent } from 'app/catalog/list/modals/delete-item/delete-item.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ItemService } from '../../../core/item/item.service';

describe('CatalogItemComponent', () => {
  let component: CatalogItemComponent;
  let fixture: ComponentFixture<CatalogItemComponent>;
  let itemService: ItemService;
  let modalService: NgbModal;
  let trackingService: TrackingService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CatalogItemComponent],
      providers: [
        {provide: TrackingService, useClass: MockTrackingService},
        {
          provide: ItemService, useValue: {
          deleteItem() {
            return Observable.of({});
          }
        }
        },
        {
          provide: NgbModal, useValue: {
            open() {
              return {
                result: Promise.resolve()
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
    let event: ItemChangeEvent;

    beforeEach(fakeAsync(() => {
      item = MOCK_ITEM;
      spyOn(itemService, 'deleteItem').and.callThrough();
      spyOn(modalService, 'open').and.callThrough();
      spyOn(trackingService, 'track');
      component.itemChange.subscribe(($event: ItemChangeEvent) => {
        event = $event;
      });
      component.deleteItem(item);
    }));

    afterEach(() => {
      event = undefined;
    });

    it('should open modal and call delete', fakeAsync(() => {
      tick();
      expect(modalService.open).toHaveBeenCalledWith(DeleteItemComponent);
      expect(itemService.deleteItem).toHaveBeenCalledWith(ITEM_ID);
    }));

    it('should emit the updated item', () => {
      expect(event.item).toEqual(item);
      expect(event.action).toBe('deleted');
    });
    it('should track the DeleteItem event', () => {
      expect(trackingService.track).toHaveBeenCalledWith(TrackingService.PRODUCT_DELETED, {product_id: item.id});
    });

  });
});
