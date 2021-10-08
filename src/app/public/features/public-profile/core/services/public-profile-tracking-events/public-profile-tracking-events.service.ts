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
  UnfavoriteItem,
  FavoriteItem,
  ClickItemCard,
} from '@core/analytics/analytics-constants';
import { UserStats } from '@core/user/user-stats.interface';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { User } from '@core/user/user';
import { ItemCard } from '@public/core/interfaces/item-card.interface';
import { USER_TYPE } from '@core/user/user.service';
export type ViewReviewsAnalyticsPageView = AnalyticsPageView<ViewOwnReviews | ViewOtherReviews>;
export type FavouriteUserAnalyticsEvent = AnalyticsEvent<FavoriteUser | UnfavoriteUser>;
export type FavouriteItemAnalyticsEvent = AnalyticsEvent<FavoriteItem | UnfavoriteItem>;

@Injectable({
  providedIn: 'root',
})
export class PublicProfileTrackingEventsService {
  constructor(private analyticsService: AnalyticsService) {}

  public trackClickItemCardEvent(itemCard: ItemCard, index: number, user?: User): void {
    const event: AnalyticsEvent<ClickItemCard> = {
      name: ANALYTICS_EVENT_NAMES.ClickItemCard,
      eventType: ANALYTIC_EVENT_TYPES.Navigation,
      attributes: {
        itemId: itemCard.id,
        categoryId: itemCard.categoryId,
        position: index + 1,
        screenId: SCREEN_IDS.Profile,
        isPro: user?.featured,
        isCarDealer: user?.type === USER_TYPE.PROFESSIONAL,
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

  public trackViewOwnReviewsorViewOtherReviews(user: User, userStats: UserStats, isOwnUser: boolean): void {
    const event: ViewReviewsAnalyticsPageView = PublicProfileTrackingEventsService.getViewReviewsEvent(user, userStats, isOwnUser);
    this.analyticsService.trackPageView(event);
  }

  public trackFavouriteOrUnfavouriteItemEvent(itemCard: ItemCard, user?: User): void {
    const event: FavouriteItemAnalyticsEvent = PublicProfileTrackingEventsService.getFavouriteItemAnalyticsEvent(itemCard, user);
    this.analyticsService.trackEvent(event);
  }

  public trackFavouriteOrUnfavouriteUserEvent(user: User, isFavourite: boolean): void {
    const event: FavouriteUserAnalyticsEvent = PublicProfileTrackingEventsService.getFavouriteUserAnalyticsEvent(user, isFavourite);
    this.analyticsService.trackEvent(event);
  }

  private static getViewReviewsEvent(
    { featured, id }: User,
    { ratings, counters }: UserStats,
    isOwnUser: boolean
  ): ViewReviewsAnalyticsPageView {
    if (isOwnUser) {
      return {
        name: ANALYTICS_EVENT_NAMES.ViewOwnReviews,
        attributes: {
          screenId: SCREEN_IDS.OwnReviewsSection,
          isPro: featured,
          numberOfReviews: counters.reviews,
          reviewsScore: ratings.reviews,
        },
      };
    }
    return {
      name: ANALYTICS_EVENT_NAMES.ViewOtherReviews,
      attributes: {
        screenId: SCREEN_IDS.OtherReviewsSection,
        isPro: featured,
        sellerUserId: id,
        numberOfReviews: counters.reviews,
        reviewsScore: ratings.reviews,
      },
    };
  }

  private static getFavouriteUserAnalyticsEvent({ featured, id }: User, isFavourite: boolean): FavouriteUserAnalyticsEvent {
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

  private static getFavouriteItemAnalyticsEvent(itemCard: ItemCard, user: User): FavouriteItemAnalyticsEvent {
    return {
      name: itemCard.flags.favorite ? ANALYTICS_EVENT_NAMES.FavoriteItem : ANALYTICS_EVENT_NAMES.UnfavoriteItem,
      eventType: ANALYTIC_EVENT_TYPES.UserPreference,
      attributes: {
        itemId: itemCard.id,
        categoryId: itemCard.categoryId,
        screenId: SCREEN_IDS.Profile,
        salePrice: itemCard.salePrice,
        isPro: user?.featured,
        title: itemCard.title,
        isBumped: !!itemCard.bumpFlags?.bumped,
      },
    };
  }
}
