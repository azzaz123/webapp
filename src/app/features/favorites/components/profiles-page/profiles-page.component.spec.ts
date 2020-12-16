import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ProfileService } from '@core/profile/profile.service';
import { MOCK_PROFILE } from '@fixtures/profile.fixtures.spec';
import { of } from 'rxjs';

import { ProfilesPageComponent } from './profiles-page.component';

describe('ProfilesPageComponent', () => {
  let component: ProfilesPageComponent;
  let profileService: ProfileService;
  let profileServiceSpy: jasmine.Spy;
  let fixture: ComponentFixture<ProfilesPageComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ProfilesPageComponent],
        providers: [
          {
            provide: ProfileService,
            useValue: {
              myFavorites() {
                return of({ data: [MOCK_PROFILE, MOCK_PROFILE], init: 2 });
              },
            },
          },
        ],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfilesPageComponent);
    component = fixture.componentInstance;
    profileService = TestBed.inject(ProfileService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getProfiles', () => {
    beforeEach(() => {
      profileServiceSpy = spyOn(
        profileService,
        'myFavorites'
      ).and.callThrough();
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

      expect(component.profiles).toEqual([
        MOCK_PROFILE,
        MOCK_PROFILE,
        MOCK_PROFILE,
      ]);
    });

    it('should set loading to false', () => {
      component.loading = true;
      component.getProfiles();

      expect(component.loading).toBeFalsy();
    });

    it('should set end true if no init', () => {
      profileServiceSpy.and.returnValue(
        of({ data: [MOCK_PROFILE, MOCK_PROFILE], init: null })
      );
      component.getProfiles();

      expect(component['end']).toBeTruthy();
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

  describe('removeProfile', () => {
    it('should remove the profile and change number of favorites', () => {
      spyOn(component.onFavoriteProfilePageChange, 'emit');
      const [profile1, profile2] = (component.profiles = [
        MOCK_PROFILE,
        MOCK_PROFILE,
      ]);
      const NUMBEROFFAVORITES = 1;

      component.removeProfile(profile1);

      expect(component.profiles).toEqual([profile2]);
      expect(component.onFavoriteProfilePageChange.emit).toHaveBeenCalledWith(
        component.isProfileRemoved
      );
    });
  });

  describe('loadMore', () => {
    it('should load more products', () => {
      spyOn(component, 'loadMore').and.callThrough();
      spyOn(component, 'getProfiles');

      component.loadMore();

      expect(component.getProfiles).toHaveBeenCalledWith(true);
    });
  });
});
