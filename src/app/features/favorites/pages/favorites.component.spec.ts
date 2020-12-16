import { of } from 'rxjs';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FavoritesComponent } from './favorites.component';
import { UserService } from '@core/user/user.service';
import { MOCK_USER_STATS } from '@fixtures/user.fixtures.spec';
import { RouterTestingModule } from '@angular/router/testing';
import { Routes } from '@angular/router';
import { ItemsPageComponent } from '../components/items-page/items-page.component';
import { ProfilesPageComponent } from '../components/profiles-page/profiles-page.component';

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

describe('FavoritesComponent', () => {
  let component: FavoritesComponent;
  let fixture: ComponentFixture<FavoritesComponent>;
  let userService: UserService;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [FavoritesComponent],
        imports: [RouterTestingModule.withRoutes(routes)],
        providers: [
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
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('onActivate', () => {
    it('should remove the number of favorite after user removed favorite product', () => {});

    it('should remove the number of favorite after user removed favorite profile', () => {});
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
