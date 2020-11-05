/* tslint:disable:no-unused-variable */

import { TestBed } from '@angular/core/testing';
import { UserAvatarComponent } from './user-avatar.component';
import { SanitizedBackgroundDirective } from '../sanitized-background/sanitized-background.directive';
import { PLACEHOLDER_AVATAR, User } from '../../core/user/user';
import { IMAGE, MICRO_NAME, USER_ID } from '../../../tests/user.fixtures.spec';
import { StatusIconComponent } from '../status-icon';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('Component: UserAvatar', () => {
  let component: UserAvatarComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      declarations: [
        UserAvatarComponent,
        SanitizedBackgroundDirective,
        StatusIconComponent,
      ],
      providers: [UserAvatarComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    });
    component = TestBed.createComponent(UserAvatarComponent).componentInstance;
  });

  describe('with user image', () => {
    const IMAGE_URL =
      'https://dock9.wallapop.com:8080/shnm-portlet/images?pictureId=500002512&pictureSize=W320';

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
});
