import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import {
  createItemsArray,
  I18nService,
  Item,
  ITEMS_BULK_RESPONSE,
  ITEMS_BULK_RESPONSE_FAILED,
  MOCK_ITEM,
  MockTrackingService,
  TrackingService,
  ITEM_FLAGS
} from 'shield';

import { ListComponent } from './list.component';
import { ItemService } from '../../core/item/item.service';
import { Observable } from 'rxjs/Observable';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import * as _ from 'lodash';
import { ConfirmationModalComponent } from './modals/confirmation-modal/confirmation-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

describe('ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;
  let itemService: ItemService;
  let trackingService: TrackingService;
  let modalService: NgbModal;
  let toastr: ToastrService;
  let trackingServiceSpy: jasmine.Spy;
  let itemerviceSpy: jasmine.Spy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ListComponent],
      providers: [
        I18nService,
        {provide: TrackingService, useClass: MockTrackingService},
        {
          provide: ItemService, useValue: {
          selectedItems: [],
          mine() {
            return Observable.of({data: [MOCK_ITEM, MOCK_ITEM], init: 20});
          },
          deselectItems() {
          },
          bulkDelete() {
          },
          bulkReserve() {
          }
        }
        },
        {
          provide: NgbModal, useValue: {
          open() {
            return {
              result: Promise.resolve(),
              componentInstance: {
                type: null
              }
            };
          }
        }
        },
        {
          provide: ToastrService, useValue: {
          error() {
          }
        }
        }],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    itemService = TestBed.get(ItemService);
    trackingService = TestBed.get(TrackingService);
    modalService = TestBed.get(NgbModal);
    toastr = TestBed.get(ToastrService);
    trackingServiceSpy = spyOn(trackingService, 'track');
    itemerviceSpy = spyOn(itemService, 'mine').and.callThrough();
    spyOn(modalService, 'open').and.callThrough();
    spyOn(toastr, 'error');
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('getItems', () => {
    it('should call mines with default values and set items', () => {
      expect(itemService.mine).toHaveBeenCalledWith(0, 'published');
      expect(component.items.length).toBe(2);
    });
    it('should track the ProductListLoaded event', () => {
      expect(trackingService.track).toHaveBeenCalledWith(TrackingService.PRODUCT_LIST_LOADED, {init: 0});
    });
    it('should track the ProductListSoldViewed if the selectedStatus is sold', () => {
      component['selectedStatus'] = 'sold';
      trackingServiceSpy.calls.reset();
      component.ngOnInit();
      expect(trackingService.track).toHaveBeenCalledWith(TrackingService.PRODUCT_LIST_SOLD_VIEWED, {total_products: 2});
    });
    it('should track the ProductListActiveViewed if the selectedStatus is published', () => {
      component['selectedStatus'] = 'published';
      trackingServiceSpy.calls.reset();
      component.ngOnInit();
      expect(trackingService.track).toHaveBeenCalledWith(TrackingService.PRODUCT_LIST_ACTIVE_VIEWED, {total_products: 2});
    });
    it('should set init', () => {
      expect(component['init']).toBe(20);
    });
    it('should set end true if no init', () => {
      itemerviceSpy.and.returnValue(Observable.of({data: [MOCK_ITEM, MOCK_ITEM], init: null}));
      component.ngOnInit();
      expect(component['end']).toBeTruthy();
    });
  });

  describe('filterByStatus', () => {
    it('should call mines with filtering and reset page', () => {
      component['init'] = 20;
      component.filterByStatus('sold');
      expect(itemService.mine).toHaveBeenCalledWith(0, 'sold');
    });
  });

  describe('loadMore', () => {
    it('should call mines with new page and append items', () => {
      component['init'] = 20;
      component.loadMore();
      expect(itemService.mine).toHaveBeenCalledWith(20, 'published');
      expect(component.items.length).toBe(4);
    });
  });

  describe('item changed', () => {
    const TOTAL: number = 5;
    let item: Item;
    beforeEach(() => {
      component.items = createItemsArray(TOTAL);
      item = component.items[3];
    });
    it('should remove item when deleted', () => {
      component.itemChanged({
        item: item,
        action: 'deleted'
      });
    });
    afterEach(() => {
      expect(component.items.length).toBe(TOTAL - 1);
      expect(_.find(component.items, {'id': item.id})).toBeFalsy();
    });
  });

  describe('deselect', () => {
    it('should call deselectItems', () => {
      spyOn(itemService, 'deselectItems');
      component.deselect();
      expect(itemService.deselectItems).toHaveBeenCalled();
    });
  });

  describe('onAction', () => {
    it('should call delete', () => {
      itemService.selectedAction = 'delete';
      spyOn(component, 'delete');
      component.onAction();
      expect(component.delete).toHaveBeenCalled();
    });
    it('should call reserve', () => {
      itemService.selectedAction = 'reserve';
      spyOn(component, 'reserve');
      component.onAction();
      expect(component.reserve).toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    const TOTAL: number = 5;
    beforeEach(() => {
      component.selectedStatus = 'active';
      component.items = createItemsArray(TOTAL);
    });
    describe('success', () => {
      beforeEach(fakeAsync(() => {
        spyOn(itemService, 'bulkDelete').and.returnValue(Observable.of(ITEMS_BULK_RESPONSE));
        component.delete();
        tick();
      }));
      it('should call modal and bulkDelete', () => {
        expect(modalService.open).toHaveBeenCalledWith(ConfirmationModalComponent);
        expect(itemService.bulkDelete).toHaveBeenCalledWith('active');
      });
      it('should remove deleted items', () => {
        expect(component.items.length).toBe(TOTAL - 3);
        expect(_.find(component.items, {'id': '1'})).toBeFalsy();
        expect(_.find(component.items, {'id': '3'})).toBeFalsy();
        expect(_.find(component.items, {'id': '5'})).toBeFalsy();
      });
      it('should track the ProductListbulkDeleted event', () => {
        expect(trackingService.track).toHaveBeenCalledWith(TrackingService.PRODUCT_LIST_BULK_DELETED, {product_ids: '1, 3, 5'});
      });
    });
    describe('failed', () => {
      beforeEach(fakeAsync(() => {
        spyOn(itemService, 'bulkDelete').and.returnValue(Observable.of(ITEMS_BULK_RESPONSE_FAILED));
        component.delete();
        tick();
      }));
      it('should open error toastr', () => {
        expect(toastr.error).toHaveBeenCalledWith('Some listings have not been deleted due to an error');
      });
    });
  });

  describe('reserve', () => {
    const TOTAL = 5;
    describe('success', () => {
      beforeEach(fakeAsync(() => {
        spyOn(itemService, 'bulkReserve').and.returnValue(Observable.of(ITEMS_BULK_RESPONSE));
        component.items = [];
        for (let i = 1; i <= TOTAL; i++) {
          component.items.push(new Item(i.toString(), i, i.toString(), null, null, null, null, null, null, null, null, {
            'pending': false,
            'sold': false,
            'favorite': false,
            'reserved': false,
            'removed': false,
            'banned': false,
            'expired': false,
            'review_done': false,
            'bumped': false,
            'highlighted': false
          }));
        }
        component.reserve();
        tick();
      }));
      it('should call modal and bulkReserve', () => {
        expect(modalService.open).toHaveBeenCalledWith(ConfirmationModalComponent);
        expect(itemService.bulkReserve).toHaveBeenCalled();
      });
      it('should call the ProductListBulkReserved tracking event', () => {
        expect(trackingService.track).toHaveBeenCalledWith(TrackingService.PRODUCT_LIST_BULK_RESERVED, {product_ids: '1, 3, 5'});
      });
      it('should set items as reserved', () => {
        expect(component.items[0].reserved).toBeTruthy();
        expect(component.items[1].reserved).toBeFalsy();
        expect(component.items[2].reserved).toBeTruthy();
        expect(component.items[3].reserved).toBeFalsy();
        expect(component.items[4].reserved).toBeTruthy();
      });
      it('should not call toastr', () => {
        expect(toastr.error).not.toHaveBeenCalled();
      });
    });
    describe('failed', () => {
      beforeEach(fakeAsync(() => {
        spyOn(itemService, 'bulkReserve').and.returnValue(Observable.of(ITEMS_BULK_RESPONSE_FAILED));
        component.reserve();
        tick();
      }));
      it('should open error toastr', () => {
        expect(toastr.error).toHaveBeenCalledWith('Some listings have not been reserved due to an error');
      });
    });
  });


});
