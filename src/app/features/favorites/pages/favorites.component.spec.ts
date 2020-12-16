import { of } from 'rxjs';
import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  waitForAsync,
} from '@angular/core/testing';
import { ItemService } from '@core/item/item.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FavoritesComponent } from './favorites.component';
import { UserService } from '@core/user/user.service';
import { MOCK_USER_STATS } from '@fixtures/user.fixtures.spec';
import { MOCK_ITEM } from '@fixtures/item.fixtures.spec';
import { ProfileService } from '@core/profile/profile.service';
import { MOCK_PROFILE } from '@fixtures/profile.fixtures.spec';
import { Router } from '@angular/router';

describe('FavoritesComponent', () => {
  let component: FavoritesComponent;
  let fixture: ComponentFixture<FavoritesComponent>;
  let itemService: ItemService;
  let userService: UserService;
  let profileService: ProfileService;
  let router: Router;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [FavoritesComponent],
        providers: [
          {
            provide: ItemService,
            useValue: {
              myFavorites() {
                return of({ data: [MOCK_ITEM, MOCK_ITEM], init: 2 });
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
            provide: Router,
            useValue: {
              navigateByUrl() {},
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
        ],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(FavoritesComponent);
    component = fixture.componentInstance;
    itemService = TestBed.inject(ItemService);
    userService = TestBed.inject(UserService);
    profileService = TestBed.inject(ProfileService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('onActivate', () => {
    //Todo
    it('should remove the number of favorite after user removed favorite product', () => {
      /*  spyOn(component, 'onActivate').and.callThrough();
      component.onActivate(component); */
    });

    it('should remove the number of favorite after user removed favorite profile', () => {});
  });

  describe('routesByStatus', () => {
    it('should navigate to favorites/products page and number of favorites should be updated if user click on products tab', () => {
      spyOn(component, 'routesByStatus').and.callThrough();
      spyOn(router, 'navigateByUrl');

      component.selectedStatus = 'profiles';
      component.routesByStatus('products');

      expect(router.navigateByUrl).toHaveBeenCalledWith('/favorites/products');
    });

    it('should navigate to favorites/profiles page and number of favorites should be updated if user click on profiles tab', () => {
      spyOn(component, 'routesByStatus').and.callThrough();
      spyOn(router, 'navigateByUrl');

      component.selectedStatus = 'products';
      component.routesByStatus('profiles');

      expect(router.navigateByUrl).toHaveBeenCalledWith('/favorites/profiles');
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
      expect(component.numberOfFavorites).toEqual(
        MOCK_USER_STATS.counters.favorites
      );
    });
  });
});
