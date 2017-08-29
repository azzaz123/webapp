/* tslint:disable:no-unused-variable */

import { TestBed } from '@angular/core/testing';
import { UserAvatarComponent } from './user-avatar.component';
import { USER_ID, IMAGE, MICRO_NAME, User, PLACEHOLDER_AVATAR, SanitizedBackgroundDirective } from 'shield';

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

  it('should istantiate it', () => {
    expect(component).toBeDefined();
  });
  describe('with user image', () => {
    it('should use the medium image as avatar', () => {
      component.user = new User(USER_ID, MICRO_NAME, IMAGE);
      component.ngOnChanges();
      expect(component['avatar']).toBe('https://dock9.wallapop.com:8080/shnm-portlet/images?pictureId=500002512&pictureSize=W320');
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
