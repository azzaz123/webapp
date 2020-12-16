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
      //spyOn(component, 'getProfiles').and.callThrough();
      itemServiceSpy = spyOn(itemService, 'myFavorites').and.callThrough();
      /*  profileServiceSpy = spyOn(
        profileService,
        'myFavorites'
      ).and.callThrough(); */
    }));

    it('should call myFavorites when component init', () => {
      component.ngOnInit();

      expect(component.getItems).toHaveBeenCalled();
    });

    it('if append argument is false should clear item array', () => {
      component.items = [MOCK_ITEM];
      component.getItems(false);

      expect(component.items).toEqual([MOCK_ITEM, MOCK_ITEM]);
    });

    it('if append argument is not defined should clear item array', () => {
      component.items = [MOCK_ITEM];
      component.getItems();

      expect(component.items).toEqual([MOCK_ITEM, MOCK_ITEM]);
    });

    it('should call myFavorites with items length', () => {
      const init = component.items.length;
      component.getItems(true);

      expect(itemService.myFavorites).toHaveBeenCalledWith(init);
    });

    it('if append argument is true, current component.item should add ', () => {
      component.items = [MOCK_ITEM];
      component.getItems(true);

      expect(component.items).toEqual([MOCK_ITEM, MOCK_ITEM, MOCK_ITEM]);
    });

    it('should set loading to false', () => {
      component.loading = true;
      component.getItems();

      expect(component.loading).toBeFalsy();
    });

    it('should set end true if no init', () => {
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

    it('should call removeItem with item argument', () => {
      component.onFavoriteChange(MOCK_ITEM);

      expect(component.removeItem).toHaveBeenCalledWith(MOCK_ITEM);
    });
  });
});
