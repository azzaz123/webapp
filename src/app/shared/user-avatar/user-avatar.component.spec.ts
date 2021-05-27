/* tslint:disable:no-unused-variable */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserAvatarComponent } from './user-avatar.component';
import { SanitizedBackgroundDirective } from '../sanitized-background/sanitized-background.directive';
import { PLACEHOLDER_AVATAR, User } from '../../core/user/user';
import { IMAGE, MICRO_NAME, USER_ID } from '../../../tests/user.fixtures.spec';
import { StatusIconComponent } from '../status-icon';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { SvgIconComponent } from '@shared/svg-icon/svg-icon.component';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('Component: UserAvatar', () => {
  let fixture: ComponentFixture<UserAvatarComponent>;
  let component: UserAvatarComponent;
  let proBadgeElement: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SvgIconModule, HttpClientTestingModule],
      declarations: [UserAvatarComponent, SanitizedBackgroundDirective, StatusIconComponent],
      providers: [UserAvatarComponent],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserAvatarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('with user image', () => {
    const IMAGE_URL = 'https://dock9.wallapop.com:8080/shnm-portlet/images?pictureId=500002512&pictureSize=W320';

    beforeEach(() => {
      IMAGE.urls_by_size.medium = IMAGE_URL;
      component.user = new User(USER_ID, MICRO_NAME, IMAGE);
    });

    it('should use the medium image as avatar', () => {
      component.ngOnChanges();

      expect(component['avatar']).toBe(IMAGE_URL);
    });

    it('should update imageUrl', () => {
      const imageObject = {
        test: 'test',
      };
      const changes = {
        imageUrl: {
          currentValue: imageObject,
        },
      };

      component.ngOnChanges(changes);

      expect(component.uploadedAvatar).toEqual(imageObject);
    });
  });

  describe('without user image', () => {
    it('should the placeholder as avatar', () => {
      component.user = new User(USER_ID, MICRO_NAME, null);

      component.ngOnChanges();

      expect(component['avatar']).toBe(PLACEHOLDER_AVATAR);
    });
  });

  describe('when component initializes', () => {
    describe('and when PRO badge should be shown', () => {
      beforeEach(() => {
        component.showProBadge = true;
        fixture.detectChanges();
        proBadgeElement = fixture.debugElement.query(By.directive(SvgIconComponent));
      });

      it('should show PRO badge', () => {
        expect(proBadgeElement).toBeTruthy();
      });
    });

    describe('and when PRO badge should NOT be shown', () => {
      beforeEach(() => {
        component.showProBadge = false;
        fixture.detectChanges();
        proBadgeElement = fixture.debugElement.query(By.directive(SvgIconComponent));
      });

      it('should NOT show PRO badge', () => {
        expect(proBadgeElement).toBeFalsy();
      });
    });
  });
});
