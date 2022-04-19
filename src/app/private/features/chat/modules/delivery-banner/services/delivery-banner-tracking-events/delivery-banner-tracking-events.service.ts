import { Injectable } from '@angular/core';
import {
  AnalyticsEvent,
  ANALYTICS_EVENT_NAMES,
  ANALYTIC_EVENT_TYPES,
  ClickActivateShipping,
  ClickBuy,
  ClickEditItemPrice,
  SaveItemPrice,
} from '@core/analytics/analytics-constants';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { SearchIdService } from '@core/analytics/search/search-id/search-id.service';

@Injectable()
export class DeliveryBannerTrackingEventsService {
  constructor(private analyticsService: AnalyticsService, private searchIdService: SearchIdService) {}

  public trackClickBannerBuy(attributes: ClickBuy): void {
    const event: AnalyticsEvent<ClickBuy> = {
      name: ANALYTICS_EVENT_NAMES.ClickBuy,
      eventType: ANALYTIC_EVENT_TYPES.Navigation,
      attributes: {
        ...attributes,
        searchId: this.searchIdService.getSearchIdByItemId(attributes.itemId),
      },
    };

    this.analyticsService.trackEvent(event);
  }

  public trackClickEditItemPrice(attributes: ClickEditItemPrice): void {
    const event: AnalyticsEvent<ClickEditItemPrice> = {
      name: ANALYTICS_EVENT_NAMES.ClickEditItemPrice,
      eventType: ANALYTIC_EVENT_TYPES.UserPreference,
      attributes,
    };

    this.analyticsService.trackEvent(event);
  }

  public trackClickActivateShipping(attributes: ClickActivateShipping): void {
    const event: AnalyticsEvent<ClickActivateShipping> = {
      name: ANALYTICS_EVENT_NAMES.ClickActivateShipping,
      eventType: ANALYTIC_EVENT_TYPES.Navigation,
      attributes,
    };

    this.analyticsService.trackEvent(event);
  }

  public trackSaveItemPrice(attributes: SaveItemPrice): void {
    const event: AnalyticsEvent<SaveItemPrice> = {
      name: ANALYTICS_EVENT_NAMES.SaveItemPrice,
      eventType: ANALYTIC_EVENT_TYPES.UserPreference,
      attributes,
    };

    this.analyticsService.trackEvent(event);
  }
}
