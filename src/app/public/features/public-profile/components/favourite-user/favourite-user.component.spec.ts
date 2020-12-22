import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AccessTokenService } from '@core/http/access-token.service';
import { FavouriteIconModule } from '@public/core/components/favourite-icon/favourite-icon.module';
import { CheckSessionModule } from '@public/core/directives/check-session/check-session.module';
import { of } from 'rxjs/internal/observable/of';
import { PublicProfileService } from '@public/features/public-profile/core/services/public-profile.service';

import { FavouriteUserComponent } from './favourite-user.component';

describe('FavouriteUserComponent', () => {
  let component: FavouriteUserComponent;
  let fixture: ComponentFixture<FavouriteUserComponent>;
  let publicProfileService: PublicProfileService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        FavouriteIconModule,
        CheckSessionModule,
      ],
      declarations: [FavouriteUserComponent],
      providers: [
        {
          provide: AccessTokenService,
          useValue: {
            accessToken: undefined,
          },
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
    it('should update the state correctly if not favourite', () => {
      component.isFavourite = false;

      component.toggleFavourite();

      expect(component.isFavourite).toBeTruthy();
    });

    it('should update the state correctly if favourite', () => {
      component.isFavourite = true;

      component.toggleFavourite();

      expect(component.isFavourite).toBeFalsy();
    });

    it('should call the correct publicProfileService function if not favourite', () => {
      component.isFavourite = false;
      spyOn(publicProfileService, 'markAsFavourite').and.returnValue(of({}));

      component.toggleFavourite();

      expect(publicProfileService.markAsFavourite).toHaveBeenCalledWith(
        component.userId
      );
    });

    it('should call the correct publicProfileService function if favourite', () => {
      component.isFavourite = true;
      spyOn(publicProfileService, 'unmarkAsFavourite').and.returnValue(of({}));

      component.toggleFavourite();

      expect(publicProfileService.unmarkAsFavourite).toHaveBeenCalledWith(
        component.userId
      );
    });
  });
});
