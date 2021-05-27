import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MOCK_FULL_USER_FEATURED, MOCK_USER_STATS } from '@fixtures/user.fixtures.spec';
import { PUBLIC_PATHS } from '@public/public-routing-constants';
import { APP_PATHS } from 'app/app-routing-constants';

import { UserBasicInfoComponent } from './user-basic-info.component';

describe('UserBasicInfoComponent', () => {
  const avatarTag = 'tsl-user-avatar';
  const starsTag = 'tsl-stars';
  const mainTag = '.UserBasicInfo';
  let component: UserBasicInfoComponent;
  let fixture: ComponentFixture<UserBasicInfoComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [UserBasicInfoComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserBasicInfoComponent);
    router = TestBed.inject(Router);
    component = fixture.componentInstance;
    component.userInfo = MOCK_FULL_USER_FEATURED;
    component.userStats = MOCK_USER_STATS;
    fixture.detectChanges();

    spyOn(router, 'navigate');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when we show the user basic information...', () => {
    it('should load the user avatar', () => {
      const userImage = fixture.debugElement.query(By.css(avatarTag));
      expect(userImage).toBeTruthy();
    });

    describe('when the user have stats...', () => {
      it('should show the rating stars', () => {
        const userStars = fixture.debugElement.query(By.css(starsTag));
        expect(userStars).toBeTruthy();
      });
    });

    describe('when the user NOT have stats...', () => {
      beforeEach(() => {
        component.userStats = null;
        fixture.detectChanges();
      });
      it('should Not show the rating stars', () => {
        const userStars = fixture.debugElement.query(By.css(starsTag));
        expect(userStars).toBeFalsy();
      });
    });
  });

  describe('when user clicks on user basic info', () => {
    let mainElement;
    beforeEach(() => (mainElement = fixture.debugElement.query(By.css(mainTag)).nativeElement));

    describe('and when info is clickable', () => {
      beforeEach(() => (component.clickable = true));

      it('should redirect to user public profile', () => {
        const expectedRedirectURL = `${APP_PATHS.PUBLIC}/${PUBLIC_PATHS.USER_DETAIL}/${MOCK_FULL_USER_FEATURED.id}`;

        mainElement.click();

        expect(router.navigate).toHaveBeenCalledWith([expectedRedirectURL]);
      });
    });

    describe('and when info is NOT clickable', () => {
      beforeEach(() => (component.clickable = false));

      it('should NOT redirect to user public profile', () => {
        mainElement.click();

        expect(router.navigate).not.toHaveBeenCalled();
      });
    });
  });
});
