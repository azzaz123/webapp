/* eslint-disable no-unused-vars, @typescript-eslint/no-unused-vars */

import { TestBed } from '@angular/core/testing';
import { UserCoverComponent } from './user-cover.component';
import { SanitizedBackgroundDirective } from '../sanitized-background/sanitized-background.directive';
import { PLACEHOLDER_COVER, User } from '../../core/user/user';
import { IMAGE, MICRO_NAME, USER_ID } from '../../../tests/user.fixtures.spec';

describe('Component: UserCover', () => {
  let component: UserCoverComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserCoverComponent],
      declarations: [UserCoverComponent, SanitizedBackgroundDirective],
    });
    component = TestBed.createComponent(UserCoverComponent).componentInstance;
  });

  describe('with user image', () => {
    const IMAGE_URL = 'https://dock9.wallapop.com:8080/shnm-portlet/images?pictureId=500002512&pictureSize=W320';

    beforeEach(() => {
      component.user = new User(USER_ID, MICRO_NAME, IMAGE);
      component.user.setCoverImageUrl(IMAGE_URL);
    });

    it('should use the medium image as avatar', () => {
      component.ngOnChanges();

      expect(component['avatar']).toBe(IMAGE_URL);
    });

    it('should update imageCoverUrl', () => {
      const imageObject = {
        test: 'test',
      };
      const changes = {
        imageCoverUrl: {
          currentValue: imageObject,
        },
      };

      component.ngOnChanges(changes);

      expect(component.uploadedCover).toEqual(imageObject);
    });
  });

  describe('without user image', () => {
    it('should the placeholder as avatar', () => {
      component.user = new User(USER_ID, MICRO_NAME, null);

      component.ngOnChanges();

      expect(component['avatar']).toBe(PLACEHOLDER_COVER);
    });
  });
});
