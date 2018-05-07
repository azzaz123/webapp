import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CatalogProListComponent } from './catalog-pro-list.component';
import { ItemService } from '../../../core/item/item.service';
import { MOCK_ITEM, ITEMS_BULK_RESPONSE_FAILED, ITEMS_BULK_RESPONSE } from '../../../../tests/item.fixtures.spec';
import { TrackingService } from '../../../core/tracking/tracking.service';
import { MockTrackingService } from '../../../../tests/tracking.fixtures.spec';
import { I18nService } from '../../../core/i18n/i18n.service';
import { Observable } from 'rxjs/Observable';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { USERS_STATS_RESPONSE } from '../../../../tests/user.fixtures.spec';

describe('CatalogProListComponent', () => {
  let component: CatalogProListComponent;
  let fixture: ComponentFixture<CatalogProListComponent>;
  let itemService: ItemService;
  let trackingService: TrackingService;
  let modalService: NgbModal;
  const componentInstance: any = { urgentPrice: jasmine.createSpy('urgentPrice') };
  let trackingServiceSpy: jasmine.Spy;
  let itemServiceSpy: jasmine.Spy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CatalogProListComponent ],
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
          selectItem() {
          },
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
        }
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatalogProListComponent);
    component = fixture.componentInstance;
    itemService = TestBed.get(ItemService);
    trackingService = TestBed.get(TrackingService);
    modalService = TestBed.get(NgbModal);
    trackingServiceSpy = spyOn(trackingService, 'track');
    itemServiceSpy = spyOn(itemService, 'mine').and.callThrough();
    fixture.detectChanges();
  });

  describe('getItems', () => {
    it('should call mine with default values and set items', () => {
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
      itemServiceSpy.and.returnValue(Observable.of({data: [MOCK_ITEM, MOCK_ITEM], init: null}));

      component.ngOnInit();

      expect(component['end']).toBeTruthy();
    });
    it('should set item to upload modal and call urgentPrice', fakeAsync(() => {
      component['uploadModalRef'] = <any>{
        componentInstance: componentInstance
      };

      component.ngOnInit();
      tick();

      expect(component['uploadModalRef'].componentInstance.item).toEqual(component.items[0]);
      expect(component['uploadModalRef'].componentInstance.urgentPrice).toHaveBeenCalled();
    }));
  });

  describe('loadMore', () => {
    it('should call mine with new page and append items', () => {
      component['init'] = 20;
      component.loadMore();

      expect(itemService.mine).toHaveBeenCalledWith(20, 'published');
      expect(component.items.length).toBe(4);
    });
  });

  describe('search', () => {
    it('should call mines with search term and reset page', () => {
      component['page'] = 2;
      component.search('term');

      expect(itemService.mines).toHaveBeenCalledWith(1, 20, 'date_desc', 'active', 'term', true);
    });
    it('should track the ProductListBulkUnselected event', () => {
      component.search('term');

      expect(trackingService.track).toHaveBeenCalledWith(TrackingService.PRODUCT_LIST_FILTERED_BY_TEXT,
        {filter: 'term', order_by: 'date_desc'});
    });
  });

  describe('sort', () => {
    it('should call mines with sorting and reset page', () => {
      component['page'] = 2;
      component.sort('date_asc');

      expect(itemService.mines).toHaveBeenCalledWith(1, 20, 'date_asc', 'active', undefined, true);
    });
    it('should track the ProductListOrderedBy event', () => {
      component['term'] = 'term';
      component.sort('date_asc');

      expect(trackingService.track).toHaveBeenCalledWith(TrackingService.PRODUCT_LIST_ORDERED_BY,
        {filter: component['term'], order_by: 'date_asc'});
    });
  });

  describe('filterByStatus', () => {
    it('should call mines with filtering and reset page', () => {
      component['page'] = 2;
      component.filterByStatus('sold');

      expect(itemService.mines).toHaveBeenCalledWith(1, 20, 'date_desc', 'sold', undefined, true);
    });
  });

  describe('deselect', () => {
    it('should call deselectItems', () => {
      spyOn(itemService, 'deselectItems');
      
      component.deselect();
      
      expect(itemService.deselectItems).toHaveBeenCalled();
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
        
        component.delete(modal);
        tick();
      }));
      it('should call modal and bulkDelete', () => {
        expect(modalService.open).toHaveBeenCalledWith(modal);
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
        
        component.delete(modal);
        tick();
      }));
      it('should open error toastr', () => {
        expect(toastr.error).toHaveBeenCalledWith('Some listings have not been deleted due to an error');
      });
    });
  });

  describe('reserve', () => {
    const TOTAL: number = 5;
    it('should call the ProductListBulkReserved tracking event', fakeAsync(() => {
      spyOn(itemService, 'bulkReserve').and.returnValue(Observable.of(ITEMS_BULK_RESPONSE));
      
      component.reserve(modal);
      tick();
      
      expect(trackingService.track).toHaveBeenCalledWith(TrackingService.PRODUCT_LIST_BULK_RESERVED, {product_ids: '1, 3, 5'});
    }));
    describe('success', () => {
      beforeEach(fakeAsync(() => {
        spyOn(itemService, 'bulkReserve').and.returnValue(Observable.of(ITEMS_BULK_RESPONSE));
        
        component.reserve(modal);
        tick();
      }));
      it('should call modal and bulkReserve', () => {
        expect(toastr.error).not.toHaveBeenCalled();
      });
    });
    describe('failed', () => {
      beforeEach(fakeAsync(() => {
        spyOn(itemService, 'bulkReserve').and.returnValue(Observable.of(ITEMS_BULK_RESPONSE_FAILED));
        
        component.reserve(modal);
        tick();
      }));
      it('should open error toastr', () => {
        expect(toastr.error).toHaveBeenCalledWith('Some listings have not been reserved due to an error');
      });
    });
  });

  describe('getCounters', () => {
    beforeEach(() => {
      spyOn(component, 'getCounters').and.callThrough();
      spyOn(userService, 'getStats').and.callThrough();
    });

    it('should getStats have been called and get the counters', () => {
      component.getCounters();

      expect(userService.getStats).toHaveBeenCalled();
      expect(component.counters).toEqual(USERS_STATS_RESPONSE.counters);
    });
  })
  
});
