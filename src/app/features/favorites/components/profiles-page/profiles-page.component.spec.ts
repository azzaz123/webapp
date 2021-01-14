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

    it('when initiate the page, should not load more profiles', () => {
      component.profiles = [MOCK_PROFILE];
      component.getProfiles();

      expect(component.profiles).toEqual([MOCK_PROFILE, MOCK_PROFILE]);
    });

    it('when scrolling the page, should load more profiles', () => {
      component.profiles = [MOCK_PROFILE];
      component.getProfiles(true);

      expect(component.profiles).toEqual([
        MOCK_PROFILE,
        MOCK_PROFILE,
        MOCK_PROFILE,
      ]);
    });

    it('should stop ininite scroll if there is no next page of profiles', () => {
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

    it('should remove profile if we click on remove', () => {
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
