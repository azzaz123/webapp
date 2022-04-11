import { IMAGE, MOCK_USER, MOCK_USER_STATS } from '@fixtures/user.fixtures.spec';
import { SIDEBAR_NAVIGATION_ELEMENTS } from '@private/layout/components/sidebar/interfaces/sidebar-navigation-element.interface';
import { SidebarNavigationProfileElement } from '@private/layout/components/sidebar/interfaces/sidebar-navigation-profile-element.interface';
import { PRIVATE_PATHS } from '@private/private-routing-constants';

export const MOCK_SIDEBAR_NAVIGATION_PROFILE_ELEMENT: SidebarNavigationProfileElement = {
  id: SIDEBAR_NAVIGATION_ELEMENTS.PROFILE,
  isPro: MOCK_USER.featured,
  text: MOCK_USER.microName,
  alternativeText: MOCK_USER.microName,
  reviews: MOCK_USER_STATS.ratings.reviews,
  reviews_count: MOCK_USER_STATS.counters.reviews,
  avatar: IMAGE.urls_by_size.medium,
  href: `${PRIVATE_PATHS.PROFILE}`,
  external: false,
};
