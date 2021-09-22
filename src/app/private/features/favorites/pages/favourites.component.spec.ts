import { of } from 'rxjs';
import { ComponentFixture, TestBed, fakeAsync, waitForAsync } from '@angular/core/testing';
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { FavouritesComponent } from './favourites.component';
import { UserService } from '@core/user/user.service';
import { MOCK_USER_STATS } from '@fixtures/user.fixtures.spec';
import { MOCK_ITEM } from '@fixtures/item.fixtures.spec';
import { ProfileService } from '@core/profile/profile.service';
import { MOCK_PROFILE } from '@fixtures/profile.fixtures.spec';
import { MeApiService } from '@api/me/me-api.service';
import { FavouritesListTrackingEventsService } from '../services/favourites-list-tracking-events.service';
import { By } from '@angular/platform-browser';
@Component({
  selector: 'tsl-item-card-favourite',
  template: '',
})
class ItemCardFavouriteComponent {}

describe('FavouritesComponent', () => {
  let component: FavouritesComponent;
  let fixture: ComponentFixture<FavouritesComponent>;
  let meApiService: MeApiService;
  let itemServiceSpy: jasmine.Spy;
  let profileServiceSpy: jasmine.Spy;
  let userService: UserService;
  let profileService: ProfileService;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [FavouritesComponent, ItemCardFavouriteComponent],
        providers: [
          {
            provide: MeApiService,
            useValue: {
              getFavourites() {
                return of({ list: [MOCK_ITEM, MOCK_ITEM], paginationParameter: '2' });
              },
            },
          },
          {
            provide: ProfileService,
            useValue: {
              myFavorites() {
                return of({ data: [MOCK_PROFILE, MOCK_PROFILE], init: 2 });
              },
            },
          },
          {
            provide: UserService,
            useValue: {
              getStats() {
                return of(MOCK_USER_STATS);
              },
            },
          },
          {
            provide: FavouritesListTrackingEventsService,
            useValue: {
              trackClickItemCardEvent() {},
            },
          },
        ],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(FavouritesComponent);
    component = fixture.componentInstance;
    meApiService = TestBed.inject(MeApiService);
    userService = TestBed.inject(UserService);
    profileService = TestBed.inject(ProfileService);
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('getItems', () => {
    beforeEach(fakeAsync(() => {
      spyOn(component, 'getItems').and.callThrough();
      spyOn(component, 'getProfiles').and.callThrough();
      itemServiceSpy = spyOn(meApiService, 'getFavourites').and.callThrough();
      profileServiceSpy = spyOn(profileService, 'myFavorites').and.callThrough();
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

      expect(meApiService.getFavourites).toHaveBeenCalledWith(init.toString());
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
      itemServiceSpy.and.returnValue(of({ data: [MOCK_ITEM, MOCK_ITEM], init: null }));
      component.getItems();

      expect(component['end']).toBeTruthy();
    });
  });

  describe('filterByStatus', () => {
    beforeEach(() => {
      profileServiceSpy = spyOn(profileService, 'myFavorites').and.callThrough();
      itemServiceSpy = spyOn(meApiService, 'getFavourites').and.callThrough();
    });

    it('should call getItems if selected status is profiles', () => {
      spyOn(component, 'getItems').and.callThrough();
      spyOn(component, 'getNumberOfFavorites').and.callThrough();

      component.selectedStatus = 'profiles';
      component.filterByStatus('products');

      expect(component.getItems).toHaveBeenCalled();
      expect(component.getNumberOfFavorites).toHaveBeenCalled();
    });

    it('should call getProfiles if selected status is products', () => {
      spyOn(component, 'getProfiles').and.callThrough();
      spyOn(component, 'getNumberOfFavorites').and.callThrough();

      component.selectedStatus = 'products';
      component.filterByStatus('profiles');

      expect(component.getProfiles).toHaveBeenCalled();
      expect(component.getNumberOfFavorites).toHaveBeenCalled();
    });
  });

  describe('getProfiles', () => {
    beforeEach(() => {
      profileServiceSpy = spyOn(profileService, 'myFavorites').and.callThrough();
      itemServiceSpy = spyOn(meApiService, 'getFavourites').and.callThrough();
    });

    it('if append argument is false should clear the profile array', () => {
      component.profiles = [MOCK_PROFILE];
      component.getProfiles(false);

      expect(component.profiles).toEqual([MOCK_PROFILE, MOCK_PROFILE]);
    });

    it('if append argument is not defined should clear the profile array', () => {
      component.profiles = [MOCK_PROFILE];
      component.getProfiles();

      expect(component.profiles).toEqual([MOCK_PROFILE, MOCK_PROFILE]);
    });

    it('should call myFavorites with profiles length', () => {
      const init = component.profiles.length;
      component.getProfiles(true);

      expect(profileService.myFavorites).toHaveBeenCalledWith(init);
    });

    it('if append argument is true, current component.profile should add the profile', () => {
      component.profiles = [MOCK_PROFILE];
      component.getProfiles(true);

      expect(component.profiles).toEqual([MOCK_PROFILE, MOCK_PROFILE, MOCK_PROFILE]);
    });

    it('should set loading to false', () => {
      component.loading = true;
      component.getProfiles();

      expect(component.loading).toBeFalsy();
    });

    it('should set end true if no init', () => {
      profileServiceSpy.and.returnValue(of({ data: [MOCK_PROFILE, MOCK_PROFILE], init: null }));
      component.getProfiles();

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

  describe('onFavoriteProfileChange', () => {
    beforeEach(() => {
      spyOn(component, 'removeProfile');
    });

    it('should call removeProfile with a profile argument', () => {
      component.onFavoriteProfileChange(MOCK_PROFILE);

      expect(component.removeProfile).toHaveBeenCalledWith(MOCK_PROFILE);
    });
  });

  describe('loadMore', () => {
    beforeEach(() => {
      spyOn(component, 'getItems');
      spyOn(component, 'getProfiles');
    });

    it('should call removeItems with item argument if selectedStatus is products', () => {
      component.selectedStatus = 'products';
      component.loadMore();

      expect(component.getItems).toHaveBeenCalledWith(true);
    });

    it('should call removeProfiles if selectedStatus is profiles', () => {
      component.selectedStatus = 'profiles';
      component.loadMore();

      expect(component.getProfiles).toHaveBeenCalledWith(true);
    });
  });

  describe('removeItem', () => {
    it('should remove item', () => {
      const [item1, item2] = (component.items = [MOCK_ITEM, MOCK_ITEM]);
      const NUMBEROFFAVORITES = 1;

      component.numberOfFavorites = NUMBEROFFAVORITES;
      component.removeItem(item1);

      expect(component.items).toEqual([item2]);
      expect(component.numberOfFavorites).toEqual(NUMBEROFFAVORITES - 1);
    });
  });

  describe('removeProfile', () => {
    it('should remove the profile', () => {
      const [profile1, profile2] = (component.profiles = [MOCK_PROFILE, MOCK_PROFILE]);
      const NUMBEROFFAVORITES = 1;

      component.numberOfFavorites = NUMBEROFFAVORITES;
      component.removeProfile(profile1);

      expect(component.profiles).toEqual([profile2]);
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
      expect(component.numberOfFavorites).toEqual(MOCK_USER_STATS.counters.favorites);
    });
  });

  describe('when clicking a favourited item', () => {
    beforeEach(() => {
      spyOn(component, 'trackClickFavoriteItem').and.callThrough();
    });

    it('should call click tracking method just once and with the correct params', () => {
      const itemList = fixture.debugElement.queryAll(By.directive(ItemCardFavouriteComponent));
      const index = 0;

      itemList[index].triggerEventHandler('click', index);

      expect(component.trackClickFavoriteItem).toHaveBeenCalledWith(index);
      expect(component.trackClickFavoriteItem).toHaveBeenCalledTimes(1);
    });
  });
});
