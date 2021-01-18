import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { ItemService } from '@core/item/item.service';
import { MOCK_ITEM } from '@fixtures/item.fixtures.spec';
import { of } from 'rxjs';

import { ItemsPageComponent } from './items-page.component';

describe('ItemsPageComponent', () => {
  let component: ItemsPageComponent;
  let itemService: ItemService;
  let itemServiceSpy: jasmine.Spy;
  let fixture: ComponentFixture<ItemsPageComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ItemsPageComponent],
        providers: [
          {
            provide: ItemService,
            useValue: {
              myFavorites() {
                return of({ data: [MOCK_ITEM, MOCK_ITEM], init: 2 });
              },
            },
          },
        ],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemsPageComponent);
    component = fixture.componentInstance;
    itemService = TestBed.inject(ItemService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getItems', () => {
    beforeEach(fakeAsync(() => {
      spyOn(component, 'getItems').and.callThrough();
      itemServiceSpy = spyOn(itemService, 'myFavorites').and.callThrough();
    }));

    it('initiate the page, should load products', () => {
      component.ngOnInit();

      expect(component.getItems).toHaveBeenCalled();
    });

    it('when scrolling the page, should load more products', () => {
      component.items = [MOCK_ITEM];
      component.getItems(true);

      expect(component.items).toEqual([MOCK_ITEM, MOCK_ITEM, MOCK_ITEM]);
    });

    it('should stop ininite scroll if there is no next page of products', () => {
      itemServiceSpy.and.returnValue(
        of({ data: [MOCK_ITEM, MOCK_ITEM], init: null })
      );
      component.getItems();

      expect(component['end']).toBeTruthy();
    });
  });

  describe('onFavoriteChange', () => {
    beforeEach(() => {
      spyOn(component, 'removeItem');
    });

    it('should remove the product if we click on remove', () => {
      component.onFavoriteChange(MOCK_ITEM);

      expect(component.removeItem).toHaveBeenCalledWith(MOCK_ITEM);
    });
  });

  describe('removeItem', () => {
    it('should remove the product and change number of favorites', () => {
      spyOn(component.onFavoriteItemPageChange, 'emit');
      const [item1, item2] = (component.items = [MOCK_ITEM, MOCK_ITEM]);

      component.removeItem(item1);

      expect(component.items).toEqual([item2]);
      expect(component.onFavoriteItemPageChange.emit).toHaveBeenCalledWith(
        component.isItemRemoved
      );
    });
  });

  describe('loadMore', () => {
    it('should load more products', () => {
      spyOn(component, 'loadMore').and.callThrough();
      spyOn(component, 'getItems');

      component.loadMore();

      expect(component.getItems).toHaveBeenCalledWith(true);
    });
  });
});
