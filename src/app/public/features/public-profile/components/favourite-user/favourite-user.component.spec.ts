import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AccessTokenService } from '@core/http/access-token.service';
import { CheckSessionModule } from '@public/core/directives/check-session/check-session.module';
import { of } from 'rxjs/internal/observable/of';
import { PublicProfileService } from '@public/features/public-profile/core/services/public-profile.service';

import { FavouriteUserComponent } from './favourite-user.component';
import { FavouriteIconModule } from '@public/shared/components/favourite-icon/favourite-icon.module';
import { PublicUserApiService } from '@public/core/services/api/public-user/public-user-api.service';
import { throwError } from 'rxjs';
import { SITE_URL } from '@configs/site-url.config';
import { MOCK_SITE_URL } from '@fixtures/site-url.fixtures.spec';

describe('FavouriteUserComponent', () => {
  let component: FavouriteUserComponent;
  let fixture: ComponentFixture<FavouriteUserComponent>;
  let publicProfileService: PublicProfileService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, FavouriteIconModule, CheckSessionModule],
      declarations: [FavouriteUserComponent],
      providers: [
        PublicUserApiService,
        PublicProfileService,
        {
          provide: AccessTokenService,
          useValue: {
            accessToken: undefined,
          },
        },
        {
          provide: SITE_URL,
          useValue: MOCK_SITE_URL,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FavouriteUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    publicProfileService = TestBed.inject(PublicProfileService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when user clicks the button', () => {
    it('should call the correct publicProfileService function if not favourite', () => {
      component.isFavourite = false;
      spyOn(publicProfileService, 'markAsFavourite').and.returnValue(of({}));

      component.toggleFavourite();

      expect(publicProfileService.markAsFavourite).toHaveBeenCalledWith(component.userId);
    });

    it('should call the correct publicProfileService function if favourite', () => {
      component.isFavourite = true;
      spyOn(publicProfileService, 'unmarkAsFavourite').and.returnValue(of({}));

      component.toggleFavourite();

      expect(publicProfileService.unmarkAsFavourite).toHaveBeenCalledWith(component.userId);
    });

    describe('and the petition succeed...', () => {
      describe('and is not favourite...', () => {
        beforeEach(() => {
          component.isFavourite = false;
        });

        it('should emit the updated value', () => {
          spyOn(publicProfileService, 'markAsFavourite').and.returnValue(of({}));
          spyOn(component.userFavouriteChanged, 'emit');

          component.toggleFavourite();

          expect(component.userFavouriteChanged.emit).toHaveBeenCalledWith(component.isFavourite);
        });

        it('should update the state correctly', () => {
          component.toggleFavourite();

          expect(component.isFavourite).toBe(true);
        });
      });

      describe('and is favourite...', () => {
        beforeEach(() => {
          component.isFavourite = true;
        });

        it('should emit the updated value', () => {
          spyOn(publicProfileService, 'unmarkAsFavourite').and.returnValue(of({}));
          spyOn(component.userFavouriteChanged, 'emit');

          component.toggleFavourite();

          expect(component.userFavouriteChanged.emit).toHaveBeenCalledWith(component.isFavourite);
        });

        it('should update the state correctly', () => {
          component.toggleFavourite();

          expect(component.isFavourite).toBe(false);
        });
      });
    });

    describe('and the petition fails...', () => {
      it('should revert the favourite state if not favourite', () => {
        spyOn(publicProfileService, 'markAsFavourite').and.returnValue(throwError('network error'));
        component.isFavourite = false;

        component.toggleFavourite();

        expect(component.isFavourite).toBe(false);
      });
      it('should revert the favourite state if favourite', () => {
        spyOn(publicProfileService, 'unmarkAsFavourite').and.returnValue(throwError('network error'));
        component.isFavourite = true;

        component.toggleFavourite();

        expect(component.isFavourite).toBe(true);
      });
    });
  });
});
