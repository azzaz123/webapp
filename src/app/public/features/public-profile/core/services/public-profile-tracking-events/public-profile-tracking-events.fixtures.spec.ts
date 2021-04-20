import {
  AnalyticsEvent,
  AnalyticsPageView,
  ANALYTICS_EVENT_NAMES,
  ANALYTIC_EVENT_TYPES,
  FavoriteUser,
  SCREEN_IDS,
  UnfavoriteUser,
  ViewOtherProfile,
  ViewOwnProfile,
} from '@core/analytics/analytics-constants';
import { MOCK_OTHER_USER, MOCK_USER, MOCK_USER_STATS } from '@fixtures/user.fixtures.spec';

export const MOCK_VIEW_OWN_PROFILE_EVENT: AnalyticsPageView<ViewOwnProfile> = {
  name: ANALYTICS_EVENT_NAMES.ViewOwnProfile,
  attributes: {
    screenId: SCREEN_IDS.MyProfile,
    isPro: MOCK_USER.featured,
  },
};

export const MOCK_VIEW_OTHER_PROFILE_EVENT: AnalyticsPageView<ViewOtherProfile> = {
  name: ANALYTICS_EVENT_NAMES.ViewOtherProfile,
  attributes: {
    screenId: SCREEN_IDS.Profile,
    isPro: MOCK_OTHER_USER.featured,
    sellerUserId: MOCK_OTHER_USER.id,
    numberOfItems: MOCK_USER_STATS.counters.publish,
  },
};

export const MOCK_FAVOURITE_USER_EVENT: AnalyticsEvent<FavoriteUser> = {
  name: ANALYTICS_EVENT_NAMES.FavoriteUser,
  eventType: ANALYTIC_EVENT_TYPES.UserPreference,
  attributes: {
    screenId: SCREEN_IDS.Profile,
    isPro: MOCK_OTHER_USER.featured,
    sellerUserId: MOCK_OTHER_USER.id,
  },
};

export const MOCK_UNFAVOURITE_USER_EVENT: AnalyticsEvent<UnfavoriteUser> = {
  name: ANALYTICS_EVENT_NAMES.UnfavoriteUser,
  eventType: ANALYTIC_EVENT_TYPES.UserPreference,
  attributes: {
    screenId: SCREEN_IDS.Profile,
    isPro: MOCK_OTHER_USER.featured,
    sellerUserId: MOCK_OTHER_USER.id,
  },
};

export class MockUserProfileTrackEventService {
  trackViewOwnProfile() {}
  trackViewOtherProfile() {}
  trackFavoriteOrUnfavoriteUserEvent() {}
}
