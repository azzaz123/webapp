import {
  AnalyticsEvent,
  AnalyticsPageView,
  ANALYTICS_EVENT_NAMES,
  ANALYTIC_EVENT_TYPES,
  FavoriteItem,
  ClickItemCard,
  FavoriteUser,
  SCREEN_IDS,
  UnfavoriteItem,
  UnfavoriteUser,
  ViewOtherProfile,
  ViewOtherReviews,
  ViewOwnProfile,
  ViewOwnReviews,
} from '@core/analytics/analytics-constants';
import { MOCK_REVIEWS } from '@fixtures/review.fixtures.spec';
import { MOCK_ITEM_CARD } from '@fixtures/item-card.fixtures.spec';
import { MOCK_OTHER_USER, MOCK_USER, MOCK_USER_STATS } from '@fixtures/user.fixtures.spec';
import { MOCK_ITEM_INDEX } from '@public/features/item-detail/core/services/item-detail-track-events/track-events.fixtures.spec';
import { USER_TYPE } from '@core/user/user.service';

export const MOCK_TRACK_CLICK_ITEM_CARD_EVENT_FROM_PROFILE: AnalyticsEvent<ClickItemCard> = {
  name: ANALYTICS_EVENT_NAMES.ClickItemCard,
  eventType: ANALYTIC_EVENT_TYPES.Navigation,
  attributes: {
    itemId: MOCK_ITEM_CARD.id,
    categoryId: MOCK_ITEM_CARD.categoryId,
    position: MOCK_ITEM_INDEX + 1,
    screenId: SCREEN_IDS.Profile,
    isPro: MOCK_OTHER_USER.featured,
    isCarDealer: MOCK_OTHER_USER?.type === USER_TYPE.PROFESSIONAL,
    salePrice: MOCK_ITEM_CARD.salePrice,
    title: MOCK_ITEM_CARD.title,
    shippingAllowed: !!MOCK_ITEM_CARD.saleConditions?.shipping_allowed,
    sellerUserId: MOCK_ITEM_CARD.ownerId,
    isBumped: !!MOCK_ITEM_CARD.bumpFlags?.bumped,
  },
};

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
    numberOfReviews: MOCK_USER_STATS.counters.publish,
    reviewsScore: MOCK_USER_STATS.ratings.reviews,
  },
};

export const MOCK_TRACK_VIEW_OTHERS_REVIEWS: AnalyticsPageView<ViewOtherReviews> = {
  name: ANALYTICS_EVENT_NAMES.ViewOtherReviews,
  attributes: {
    screenId: SCREEN_IDS.OtherReviewsSection,
    isPro: MOCK_OTHER_USER.featured,
    sellerUserId: MOCK_OTHER_USER.id,
    numberOfReviews: MOCK_USER_STATS.counters.publish,
    reviewsScore: MOCK_USER_STATS.ratings.reviews,
  },
};
export const MOCK_FAVOURITE_ITEM_EVENT_PROFILE: AnalyticsEvent<FavoriteItem> = {
  name: ANALYTICS_EVENT_NAMES.FavoriteItem,
  eventType: ANALYTIC_EVENT_TYPES.UserPreference,
  attributes: {
    itemId: MOCK_ITEM_CARD.id,
    categoryId: MOCK_ITEM_CARD.categoryId,
    screenId: SCREEN_IDS.Profile,
    salePrice: MOCK_ITEM_CARD.salePrice,
    isPro: MOCK_USER.featured,
    title: MOCK_ITEM_CARD.title,
    isBumped: !!MOCK_ITEM_CARD.bumpFlags?.bumped,
  },
};

export const MOCK_UNFAVOURITE_ITEM_EVENT_PROFILE: AnalyticsEvent<UnfavoriteItem> = {
  name: ANALYTICS_EVENT_NAMES.UnfavoriteItem,
  eventType: ANALYTIC_EVENT_TYPES.UserPreference,
  attributes: {
    ...MOCK_FAVOURITE_ITEM_EVENT_PROFILE.attributes,
    isPro: MOCK_USER.featured,
  },
};

export class MockUserProfileTrackEventService {
  trackViewOwnProfile() {}
  trackViewOtherProfile() {}
  trackFavouriteOrUnfavouriteUserEvent() {}
  trackViewOwnReviewsorViewOtherReviews() {}
  trackFavouriteOrUnfavouriteItemEvent() {}
  trackClickItemCardEvent() {}
}
