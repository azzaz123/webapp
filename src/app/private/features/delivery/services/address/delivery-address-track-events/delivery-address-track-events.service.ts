import { Injectable } from '@angular/core';
import { AnalyticsEvent, ANALYTICS_EVENT_NAMES, ANALYTIC_EVENT_TYPES, SaveAddress, SCREEN_IDS } from '@core/analytics/analytics-constants';
import { AnalyticsService } from '@core/analytics/analytics.service';

@Injectable()
export class DeliveryAddressTrackEventsService {
  constructor(private analyticsService: AnalyticsService) {}

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
