import { Injectable } from '@angular/core';
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
import { AnalyticsService } from '@core/analytics/analytics.service';
import { User } from '@core/user/user';

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

  public trackViewOtherProfile(user: User, numberOfItems: number): void {
    const event: AnalyticsPageView<ViewOtherProfile> = {
      name: ANALYTICS_EVENT_NAMES.ViewOtherProfile,
      attributes: {
        screenId: SCREEN_IDS.Profile,
        isPro: user.featured,
        sellerUserId: user.id,
        numberOfItems: numberOfItems,
      },
    };
    this.analyticsService.trackPageView(event);
  }

  public trackFavouriteUserEvent(isPro: boolean, sellerUserId: string): void {
    const event: AnalyticsEvent<FavoriteUser> = {
      name: ANALYTICS_EVENT_NAMES.FavoriteUser,
      eventType: ANALYTIC_EVENT_TYPES.UserPreference,
      attributes: {
        screenId: SCREEN_IDS.Profile,
        isPro: isPro,
        sellerUserId: sellerUserId,
      },
    };
    this.analyticsService.trackEvent(event);
  }

  public trackUnfavouriteUserEvent(isPro: boolean, sellerUserId: string): void {
    const event: AnalyticsEvent<UnfavoriteUser> = {
      name: ANALYTICS_EVENT_NAMES.UnfavoriteUser,
      eventType: ANALYTIC_EVENT_TYPES.UserPreference,
      attributes: {
        screenId: SCREEN_IDS.Profile,
        isPro: isPro,
        sellerUserId: sellerUserId,
      },
    };
    this.analyticsService.trackEvent(event);
  }
}
