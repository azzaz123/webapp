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
  ClickItemCard,
} from '@core/analytics/analytics-constants';
import { UserStats } from '@core/user/user-stats.interface';
import { Review } from '@private/features/reviews/core/review';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { User } from '@core/user/user';
import { ItemCard } from '@public/core/interfaces/item-card.interface';
export type ViewReviewsAnalyticsPageView = AnalyticsPageView<ViewOwnReviews | ViewOtherReviews>;
export type FavouriteUserAnalyticEvent = AnalyticsEvent<FavoriteUser | UnfavoriteUser>;

@Injectable({
  providedIn: 'root',
})
export class PublicProfileTrackingEventsService {
  constructor(private analyticsService: AnalyticsService) {}

  public trackClickItemCardEvent(itemCard: ItemCard, user: User, index: number): void {
    const event: AnalyticsEvent<ClickItemCard> = {
      name: ANALYTICS_EVENT_NAMES.ClickItemCard,
      eventType: ANALYTIC_EVENT_TYPES.Navigation,
      attributes: {
        itemId: itemCard.id,
        categoryId: itemCard.categoryId,
        position: index + 1,
        screenId: SCREEN_IDS.Profile,
        isPro: user.featured,
        salePrice: itemCard.salePrice,
        title: itemCard.title,
        shippingAllowed: !!itemCard.saleConditions?.shipping_allowed,
        sellerUserId: itemCard.ownerId,
        isBumped: !!itemCard.bumpFlags?.bumped,
      },
    };
    this.analyticsService.trackEvent(event);
  }

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

  public trackViewOwnReviewsorViewOtherReviews(user: User, userStats: UserStats, reviews: Review[], isOwnUser: boolean) {
    const event: ViewReviewsAnalyticsPageView = PublicProfileTrackingEventsService.factoryViewReviewsEvent(
      user,
      userStats,
      reviews,
      isOwnUser
    );
    this.analyticsService.trackPageView(event);
  }

  public trackFavouriteOrUnfavouriteUserEvent(user: User, isFavourite: boolean): void {
    const event: FavouriteUserAnalyticsEvent = PublicProfileTrackingEventsService.factoryFavouriteUserOrUnfavouriteUserEvent(
      user,
      isFavourite
    );
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

  private static factoryFavouriteUserOrUnfavouriteUserEvent({ featured, id }: User, isFavourite: boolean): FavouriteUserAnalyticsEvent {
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
