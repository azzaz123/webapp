import { PUBLIC_PATHS } from '@public/public-routing-constants';
import { APP_PATHS } from 'app/app-routing-constants';
import { UserProfileRoutePipe } from './user-profile-route.pipe';

const slugName = 'user-slug-';
const userId = '19931006';
const slug = `${slugName}${userId}`;
const hashId = 'ams1993jk';

describe('UserProfileRoutePipe', () => {
  it('should convert the user slug into a valid user profile route', () => {
    const pipe = new UserProfileRoutePipe();
    const expectedPermalink = `${slugName}${hashId}`;
    const expectedRoute = !!APP_PATHS.PUBLIC
      ? `/${APP_PATHS.PUBLIC}/${PUBLIC_PATHS.USER_DETAIL}/${expectedPermalink}`
      : `/${PUBLIC_PATHS.USER_DETAIL}/${expectedPermalink}`;

    const userProfileRoute = pipe.transform(slug, hashId);

    expect(userProfileRoute).toEqual(expectedRoute);
  });
});
