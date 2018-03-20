/* tslint:disable:no-unused-variable */

import { TestBed } from '@angular/core/testing';
import { UserAvatarComponent } from './user-avatar.component';
import { SanitizedBackgroundDirective } from '../../../shared/sanitized-background/sanitized-background.directive';
import { PLACEHOLDER_AVATAR, User } from '../user';
import { IMAGE, MICRO_NAME, USER_ID } from '../../../../tests/user.fixtures.spec';

describe('Component: UserAvatar', () => {

  let component: UserAvatarComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UserAvatarComponent
      ],
      declarations: [UserAvatarComponent, SanitizedBackgroundDirective]
    });
    component = TestBed.createComponent(UserAvatarComponent).componentInstance;
  });


  describe('with user image', () => {

    beforeEach(() => {
      component.user = new User(USER_ID, MICRO_NAME, IMAGE);
    });

    it('should use the medium image as avatar', () => {
      component.ngOnChanges();

      expect(component['avatar']).toBe('https://dock9.wallapop.com:8080/shnm-portlet/images?pictureId=500002512&pictureSize=W320');
    });

    it('should update imageUrl', () => {
      const imageObject = {
        test: 'test'
      };
      const changes = {
        imageUrl: {
          currentValue: imageObject
        }
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
