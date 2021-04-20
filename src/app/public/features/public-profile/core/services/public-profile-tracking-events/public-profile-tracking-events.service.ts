import { Injectable } from '@angular/core';
import {
  AnalyticsPageView,
  ANALYTICS_EVENT_NAMES,
  SCREEN_IDS,
  ViewOtherProfile,
  ViewOwnProfile,
  ViewOwnReviews,
} from '@core/analytics/analytics-constants';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { User } from '@core/user/user';
import { Review } from '@private/features/reviews/core/review';

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

  public trackViewOwnReviews(user: User, reviews: Review[]) {
    const event: AnalyticsPageView<ViewOwnReviews> = {
      name: ANALYTICS_EVENT_NAMES.ViewOwnReviews,
      attributes: {
        screenId: SCREEN_IDS.OwnReviewsSection,
        isPro: user.featured,
        numberOfReviews: reviews.length,
        //reviewsScore: reviews // later check
      },
    };
    this.analyticsService.trackPageView(event);
  }
}
