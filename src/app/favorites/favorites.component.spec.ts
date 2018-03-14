import { async, ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { ItemService } from '../core/item/item.service';
import { MOCK_ITEM } from 'shield';
import { Observable } from 'rxjs/Observable';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FavoritesComponent } from './favorites.component';
import { UserService } from '../core/user/user.service';
import { USERS_STATS_RESPONSE } from '../../tests/user.fixtures.spec';

describe('FavoritesComponent', () => {
  let component: FavoritesComponent;
  let fixture: ComponentFixture<FavoritesComponent>;
  let itemService: ItemService;
  let itemServiceSpy: jasmine.Spy;
  let userService: UserService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FavoritesComponent ],
      providers: [
        { provide: ItemService, useValue: {
          myFavorites () {
            return Observable.of({data: [MOCK_ITEM, MOCK_ITEM], init: 2});
          }
        }
        },
        {
          provide: UserService, useValue: {
            getStats() {
              return Observable.of(USERS_STATS_RESPONSE);
            }
          }
        },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FavoritesComponent);
    component = fixture.componentInstance;
    itemService = TestBed.get(ItemService);
    userService = TestBed.get(UserService);
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('getItems', () => {

    beforeEach(fakeAsync(() => {
      spyOn(component, 'getItems').and.callThrough();
      itemServiceSpy = spyOn(itemService, 'myFavorites').and.callThrough();
    }));

    it('should call myFavorites when component init', () => {
      component.ngOnInit();
      expect(component.getItems).toHaveBeenCalled();
    });

    it('if append argument is false should clear item array', () => {
      component.items = [MOCK_ITEM];
      component.getItems(false);
      expect(component.items).toEqual([MOCK_ITEM, MOCK_ITEM]);
    })

    it('if append argument is not defined should clear item array', () => {
      component.items = [MOCK_ITEM];
      component.getItems();
      expect(component.items).toEqual([MOCK_ITEM, MOCK_ITEM]);
    });

    it('should call myFavorites with items length', () => {
      let init = component.items.length;
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
      itemServiceSpy.and.returnValue(Observable.of({data: [MOCK_ITEM, MOCK_ITEM], init: null}));
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

  describe('loadMore', () => {
    beforeEach(() => {
      spyOn(component, 'getItems');
    });

    it('should call removeItem with item argument', () => {
      component.loadMore();
      expect(component.getItems).toHaveBeenCalledWith(true);
    });
  });

  describe('removeItem', () => {
    it('should remove item', () => {
      const [item1, item2] = component.items = [MOCK_ITEM, MOCK_ITEM];
      const NUMBEROFFAVORITES = 1;
      component.numberOfFavorites = NUMBEROFFAVORITES;
      component.removeItem(item1);
      expect(component.items).toEqual([item2]);
      expect(component.numberOfFavorites).toEqual(NUMBEROFFAVORITES - 1);
    });
  });

  describe('getNumberOfFavorites', () => {
    beforeEach(() => {
      spyOn(component, 'getNumberOfFavorites').and.callThrough();
      spyOn(userService, 'getStats').and.callThrough();
    });

    it('should call getNumberOfFavorites when component init', () => {
      component.ngOnInit();
      expect(component.getNumberOfFavorites).toHaveBeenCalled();
    });

    it('should get number of favorites', () => {
      component.getNumberOfFavorites();
      expect(userService.getStats).toHaveBeenCalled();
      expect(component.numberOfFavorites).toEqual(USERS_STATS_RESPONSE.counters.favorites);
    });
  })
});
