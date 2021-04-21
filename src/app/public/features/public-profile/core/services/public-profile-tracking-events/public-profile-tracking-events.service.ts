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
  UnfavoriteItem,
  FavoriteItem,
} from '@core/analytics/analytics-constants';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { User } from '@core/user/user';
import { ItemCard } from '@public/core/interfaces/item-card.interface';
export type FavouriteUserAnalyticEvent = AnalyticsEvent<FavoriteUser | UnfavoriteUser>;
export type FavouriteItemAnalyticEvent = AnalyticsEvent<FavoriteItem | UnfavoriteItem>;

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

  public trackFavouriteOrUnfavouriteItemEvent(itemCard: ItemCard, user: User): void {
    const event: FavouriteItemAnalyticEvent = PublicProfileTrackingEventsService.factoryFavouriteUserOrUnfavouriteItemEvent(itemCard, user);
    this.analyticsService.trackEvent(event);
  }

  public trackFavouriteOrUnfavouriteUserEvent(user: User, isFavourite: boolean): void {
    const event: FavouriteUserAnalyticEvent = PublicProfileTrackingEventsService.factoryAnalyticsEvent(user, isFavourite);
    this.analyticsService.trackEvent(event);
  }

  private static factoryAnalyticsEvent({ featured, id }: User, isFavourite: boolean): FavouriteUserAnalyticEvent {
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

  private static factoryFavouriteUserOrUnfavouriteItemEvent(itemCard: ItemCard, { featured }: User): FavouriteItemAnalyticEvent {
    return {
      name: itemCard.flags.favorite ? ANALYTICS_EVENT_NAMES.FavoriteItem : ANALYTICS_EVENT_NAMES.UnfavoriteItem,
      eventType: ANALYTIC_EVENT_TYPES.UserPreference,
      attributes: {
        itemId: itemCard.id,
        categoryId: itemCard.categoryId,
        screenId: SCREEN_IDS.Profile,
        salePrice: itemCard.salePrice,
        isPro: featured,
        title: itemCard.title,
        isBumped: !!itemCard.bumpFlags?.bumped,
      },
    };
  }
}
