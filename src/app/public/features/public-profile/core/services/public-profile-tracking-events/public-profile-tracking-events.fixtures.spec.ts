import {
  AnalyticsEvent,
  AnalyticsPageView,
  ANALYTICS_EVENT_NAMES,
  ANALYTIC_EVENT_TYPES,
  FavoriteUser,
  SCREEN_IDS,
  UnfavoriteUser,
  ViewOtherProfile,
  ViewOtherReviews,
  ViewOwnProfile,
  ViewOwnReviews,
} from '@core/analytics/analytics-constants';
import { MOCK_REVIEWS } from '@fixtures/review.fixtures.spec';
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

export const MOCK_TRACK_VIEW_OWN_REVIEWS: AnalyticsPageView<ViewOwnReviews> = {
  name: ANALYTICS_EVENT_NAMES.ViewOwnReviews,
  attributes: {
    screenId: SCREEN_IDS.OwnReviewsSection,
    isPro: MOCK_USER.featured,
    numberOfReviews: MOCK_REVIEWS.length,
    reviewsScore: MOCK_USER_STATS.ratings.reviews,
  },
};

export const MOCK_TRACK_VIEW_OTHERS_REVIEWS: AnalyticsPageView<ViewOtherReviews> = {
  name: ANALYTICS_EVENT_NAMES.ViewOtherReviews,
  attributes: {
    screenId: SCREEN_IDS.OtherReviewsSection,
    isPro: MOCK_OTHER_USER.featured,
    sellerUserId: MOCK_OTHER_USER.id,
    numberOfReviews: MOCK_REVIEWS.length,
    reviewsScore: MOCK_USER_STATS.ratings.reviews,
  },
};

export class MockUserProfileTrackEventService {
  trackViewOwnProfile() {}
  trackViewOtherProfile() {}
  trackFavouriteOrUnfavouriteUserEvent() {}
  trackViewOwnReviewsorViewOtherReviews() {}
}
