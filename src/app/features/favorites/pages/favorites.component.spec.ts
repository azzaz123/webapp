import { of } from 'rxjs';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { EventEmitter, NO_ERRORS_SCHEMA } from '@angular/core';
import { FavoritesComponent } from './favorites.component';
import { UserService } from '@core/user/user.service';
import { MOCK_USER_STATS } from '@fixtures/user.fixtures.spec';
import { RouterTestingModule } from '@angular/router/testing';
import { RouterLinkWithHref, Routes } from '@angular/router';
import { ItemsPageComponent } from '../components/items-page/items-page.component';
import { ProfilesPageComponent } from '../components/profiles-page/profiles-page.component';
import { ItemService } from '@core/item/item.service';
import { By } from '@angular/platform-browser';
import { ProfileService } from '@core/profile/profile.service';

export class ItemsPageStub {
  onFavoriteItemPageChange: EventEmitter<Boolean> = new EventEmitter(true);
}

export class ProfilesPageStub {
  onFavoriteProfilePageChange: EventEmitter<Boolean> = new EventEmitter(true);
}

const routes: Routes = [
  {
    path: 'products',
    component: ItemsPageComponent,
  },
  {
    path: 'profiles',
    component: ProfilesPageComponent,
  },
];

describe('FavoritemsComponent', () => {
  let component: FavoritesComponent;
  let fixture: ComponentFixture<FavoritesComponent>;
  let itemsPageStub: ItemsPageStub;
  let profilesPageStub: ProfilesPageStub;
  let userService: UserService;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [FavoritesComponent, ItemsPageComponent],
        imports: [RouterTestingModule.withRoutes(routes)],
        providers: [
          ItemsPageStub,
          ProfilesPageStub,
          {
            provide: ItemService,
            useValue: {
              myFavorites() {
                return of({});
              },
            },
          },
          {
            provide: ProfileService,
            useValue: {
              myFavorites() {
                return of();
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
        ],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(FavoritesComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService);
    itemsPageStub = TestBed.inject(ItemsPageStub);
    profilesPageStub = TestBed.inject(ProfilesPageStub);
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('Navigation', () => {
    it('should navigate to favorites/products page after clicking produts tab', fakeAsync(() => {
      fixture.ngZone.run(() => {
        const linkInstance = fixture.debugElement
          .query(By.css('#products-tab'))
          .injector.get(RouterLinkWithHref);
        const element: HTMLElement = fixture.debugElement.query(
          By.css('#products-tab')
        ).nativeElement;

        element.click();
        tick();

        expect(linkInstance['href']).toBe('/products');
      });
    }));

    it('should navigate to favorites/profiles page after clicking profiles tab', fakeAsync(() => {
      fixture.ngZone.run(() => {
        const linkInstance = fixture.debugElement
          .query(By.css('#profiles-tab'))
          .injector.get(RouterLinkWithHref);
        const element: HTMLElement = fixture.debugElement.query(
          By.css('#profiles-tab')
        ).nativeElement;

        element.click();
        tick();

        expect(linkInstance['href']).toBe('/profiles');
      });
    }));
  });

  describe('onActivate', () => {
    it('should remove the number of favorite after user removed favorite product', fakeAsync(() => {
      let originalNumberOfFavorites: number = 5;
      component.numberOfFavorites = originalNumberOfFavorites;
      spyOn(component, 'onActivate').and.callThrough();
      spyOn(
        itemsPageStub.onFavoriteItemPageChange,
        'subscribe'
      ).and.returnValue(of(true));

      component.onActivate(itemsPageStub as ItemsPageComponent);
      tick();
      fixture.detectChanges();

      expect(component.numberOfFavorites).toBe(originalNumberOfFavorites - 1);
    }));

    /* it('should remove the number of favorite after user removed favorite profile', fakeAsync(() => {
      let originalNumberOfFavorites: number = 5;
      component.numberOfFavorites = originalNumberOfFavorites;
      spyOn(component, 'onActivate').and.callThrough();
      spyOn(
        profilesPageStub.onFavoriteProfilePageChange,
        'subscribe'
      ).and.returnValue(of(true));

      component.onActivate(profilesPageStub as ProfilesPageComponent);
      tick();
      fixture.detectChanges();

      expect(component.numberOfFavorites).toBe(originalNumberOfFavorites - 1);
    })); */
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
