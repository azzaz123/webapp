import { Injectable } from '@angular/core';
import {
  ANALYTICS_EVENT_NAMES,
  ANALYTIC_EVENT_TYPES,
  AnalyticsEvent,
  AnalyticsPageView,
  FavoriteUser,
  SCREEN_IDS,
  UnfavoriteUser,
  ViewOtherProfile,
  ViewOwnProfile,
  ViewOwnReviews,
  ViewOtherReviews,
} from '@core/analytics/analytics-constants';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { User } from '@core/user/user';
import { UserStats } from '@core/user/user-stats.interface';
import { Review } from '@private/features/reviews/core/review';
export type FavouriteUserAnalyticsEvent = AnalyticsEvent<FavoriteUser | UnfavoriteUser>;
export type ViewReviewsAnalyticsPageView = AnalyticsPageView<ViewOwnReviews | ViewOtherReviews>;

@Injectable({
  providedIn: 'root',
})
export class PublicProfileTrackingEventsService {
  constructor(private analyticsService: AnalyticsService) {}

  public trackViewOwnProfile(isPro: boolean): void {
    const event: AnalyticsPageView<ViewOwnProfile> = {
      name: ANALYTICS_EVENT_NAMES.ViewOwnProfile,
      attributes: {
        screenId: SCREEN_IDS.MyProfile,
        isPro: isPro,
      },
    };
    this.analyticsService.trackPageView(event);
  }

  public trackViewOtherProfile({ featured, id }: User, numberOfItems: number): void {
    const event: AnalyticsPageView<ViewOtherProfile> = {
      name: ANALYTICS_EVENT_NAMES.ViewOtherProfile,
      attributes: {
        screenId: SCREEN_IDS.Profile,
        isPro: featured,
        sellerUserId: id,
        numberOfItems: numberOfItems,
      },
    };
    this.analyticsService.trackPageView(event);
  }

  public trackViewReviews(user: User, userStats: UserStats, reviews: Review[], isOwnUser: boolean) {
    const event: ViewReviewsAnalyticsPageView = PublicProfileTrackingEventsService.factoryViewReviewsEvent(
      user,
      userStats,
      reviews,
      isOwnUser
    );
    this.analyticsService.trackPageView(event);
  }

  public trackFavouriteOrUnfavouriteUserEvent(user: User, isFavourite: boolean): void {
    const event: FavouriteUserAnalyticsEvent = PublicProfileTrackingEventsService.factoryAnalyticsEvent(user, isFavourite);
    this.analyticsService.trackEvent(event);
  }

  private static factoryViewReviewsEvent(
    { featured, id }: User,
    { ratings }: UserStats,
    reviews: Review[],
    isOwnUser: boolean
  ): ViewReviewsAnalyticsPageView {
    return {
      name: isOwnUser ? ANALYTICS_EVENT_NAMES.ViewOwnReviews : ANALYTICS_EVENT_NAMES.ViewOtherReviews,
      attributes: {
        screenId: isOwnUser ? SCREEN_IDS.OwnReviewsSection : SCREEN_IDS.OtherReviewsSection,
        isPro: featured,
        sellerUserId: isOwnUser ? undefined : id,
        numberOfReviews: reviews.length,
        reviewsScore: ratings.reviews,
      },
    };
  }

  private static factoryAnalyticsEvent({ featured, id }: User, isFavourite: boolean): FavouriteUserAnalyticsEvent {
    return {
      name: isFavourite ? ANALYTICS_EVENT_NAMES.FavoriteUser : ANALYTICS_EVENT_NAMES.UnfavoriteUser,
      eventType: ANALYTIC_EVENT_TYPES.UserPreference,
      attributes: {
        screenId: SCREEN_IDS.Profile,
        isPro: featured,
        sellerUserId: id,
      },
    };
  }
}
