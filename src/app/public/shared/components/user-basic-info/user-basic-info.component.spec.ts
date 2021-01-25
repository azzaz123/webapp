import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  MOCK_FULL_USER_FEATURED,
  MOCK_USER_STATS,
} from '@fixtures/user.fixtures.spec';

import { UserBasicInfoComponent } from './user-basic-info.component';

describe('UserBasicInfoComponent', () => {
  const avatarTag = 'tsl-user-avatar';
  const starsTag = 'tsl-stars';
  let component: UserBasicInfoComponent;
  let fixture: ComponentFixture<UserBasicInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserBasicInfoComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserBasicInfoComponent);
    component = fixture.componentInstance;
    component.userInfo = MOCK_FULL_USER_FEATURED;
    component.userStats = MOCK_USER_STATS;
    fixture.detectChanges();
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
});
