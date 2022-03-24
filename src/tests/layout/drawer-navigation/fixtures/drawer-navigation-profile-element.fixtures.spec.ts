import { IMAGE, MOCK_USER, MOCK_USER_STATS } from '@fixtures/user.fixtures.spec';
import {
  DrawerNavigationProfileElement,
  DRAWER_NAVIGATION_ELEMENTS,
} from '@layout/drawer-navigation/interfaces/drawer-navigation-element.interface';
import { PRIVATE_PATHS } from '@private/private-routing-constants';

export const MOCK_DRAWER_NAVIGATION_PROFILE_ELEMENT: DrawerNavigationProfileElement = {
  id: DRAWER_NAVIGATION_ELEMENTS.PROFILE,
  professional: MOCK_USER.featured,
  text: MOCK_USER.microName,
  alternativeText: MOCK_USER.microName,
  reviews: MOCK_USER_STATS.ratings.reviews,
  reviews_count: MOCK_USER_STATS.counters.reviews,
  avatar: IMAGE.urls_by_size.medium,
  href: `${PRIVATE_PATHS.PROFILE}`,
  external: false,
};
