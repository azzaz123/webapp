import { Injectable } from '@angular/core';
import {
  AnalyticsEvent,
  AnalyticsPageView,
  ANALYTICS_EVENT_NAMES,
  ANALYTIC_EVENT_TYPES,
  SaveAddress,
  SCREEN_IDS,
  ViewShippingAddress,
} from '@core/analytics/analytics-constants';
import { AnalyticsService } from '@core/analytics/analytics.service';

@Injectable()
export class DeliveryAddressTrackEventsService {
  constructor(private analyticsService: AnalyticsService) {}

  public trackViewShippingAddressScreen(): void {
    const event: AnalyticsPageView<ViewShippingAddress> = {
      name: ANALYTICS_EVENT_NAMES.ViewShippingAddress,
      attributes: {
        screenId: SCREEN_IDS.MyShippingAddress,
      },
    };
    this.analyticsService.trackPageView(event);
  }

  public trackClickSaveButton(): void {
    const event: AnalyticsEvent<SaveAddress> = {
      name: ANALYTICS_EVENT_NAMES.SaveAddress,
      eventType: ANALYTIC_EVENT_TYPES.UserPreference,
      attributes: {
        screenId: SCREEN_IDS.EditAddress,
      },
    };
    this.analyticsService.trackEvent(event);
  }
}
