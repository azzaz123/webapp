import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { createItemsArray, Item, MOCK_ITEM, MockTrackingService, TrackingService } from 'shield';

import { ListComponent } from './list.component';
import { ItemService } from '../../core/item/item.service';
import { Observable } from 'rxjs/Observable';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import * as _ from 'lodash';

describe('ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;
  let itemService: ItemService;
  let trackingService: TrackingService;
  let trackingServiceSpy: jasmine.Spy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ListComponent],
      providers: [
        {provide: TrackingService, useClass: MockTrackingService},
        {
          provide: ItemService, useValue: {
          mine() {
            return Observable.of([MOCK_ITEM, MOCK_ITEM]);
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
    trackingServiceSpy = spyOn(trackingService, 'track');
    spyOn(itemService, 'mine').and.callThrough();
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('getItems', () => {
    it('should call mines with default values and set items', () => {
      expect(itemService.mine).toHaveBeenCalledWith(1, 'published');
      expect(component.items.length).toBe(2);
    });
    it('should track the ProductListLoaded event', () => {
      expect(trackingService.track).toHaveBeenCalledWith(TrackingService.PRODUCT_LIST_LOADED, {page_number: component['page']});
    });
    it('should track the ProductListSoldViewed if the selectedStatus is sold', () => {
      component['selectedStatus'] = 'solds';
      trackingServiceSpy.calls.reset();
      component.ngOnInit();
      expect(trackingService.track).toHaveBeenCalledWith(TrackingService.PRODUCT_LIST_SOLD_VIEWED, {total_products: 2});
    });
    it('should track the ProductListActiveViewed if the selectedStatus is sold', () => {
      component['selectedStatus'] = 'active';
      trackingServiceSpy.calls.reset();
      component.ngOnInit();
      expect(trackingService.track).toHaveBeenCalledWith(TrackingService.PRODUCT_LIST_ACTIVE_VIEWED, {total_products: 2});
    });
  });

  describe('filterByStatus', () => {
    it('should call mines with filtering and reset page', () => {
      component['page'] = 2;
      component.filterByStatus('sold');
      expect(itemService.mine).toHaveBeenCalledWith(1, 'sold');
    });
  });

  describe('loadMore', () => {
    it('should call mines with new page and append items', () => {
      component.loadMore();
      expect(itemService.mine).toHaveBeenCalledWith(2, 'published');
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

});
