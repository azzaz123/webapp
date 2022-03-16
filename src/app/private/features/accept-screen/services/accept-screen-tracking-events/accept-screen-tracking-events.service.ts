import { Injectable } from '@angular/core';
import {
  AnalyticsEvent,
  AnalyticsPageView,
  ANALYTICS_EVENT_NAMES,
  ANALYTIC_EVENT_TYPES,
  ClickAcceptOffer,
  ClickAddEditAddress,
  ClickHelpTransactional,
  ClickItemCard,
  ClickOtherProfile,
  ClickRejectOffer,
  ClickScheduleHPU,
  ViewAcceptOffer,
} from '@core/analytics/analytics-constants';
import { AnalyticsService } from '@core/analytics/analytics.service';

@Injectable({
  providedIn: 'root',
})
export class AcceptScreenTrackingEventsService {
  constructor(private analyticsService: AnalyticsService) {}

  public trackViewAcceptOffer(attributes: ViewAcceptOffer): void {
    const pageViewEvent: AnalyticsPageView<ViewAcceptOffer> = {
      name: ANALYTICS_EVENT_NAMES.ViewAcceptOffer,
      attributes,
    };

    this.analyticsService.trackPageView(pageViewEvent);
  }

  public trackClickItemCard(attributes: ClickItemCard): void {
    const event: AnalyticsEvent<ClickItemCard> = {
      name: ANALYTICS_EVENT_NAMES.ClickItemCard,
      eventType: ANALYTIC_EVENT_TYPES.Navigation,
      attributes,
    };

    this.analyticsService.trackEvent(event);
  }

  public trackClickOtherProfile(attributes: ClickOtherProfile): void {
    const event: AnalyticsEvent<ClickOtherProfile> = {
      name: ANALYTICS_EVENT_NAMES.ClickOtherProfile,
      eventType: ANALYTIC_EVENT_TYPES.Navigation,
      attributes,
    };

    this.analyticsService.trackEvent(event);
  }

  public trackClickAcceptOffer(attributes: ClickAcceptOffer): void {
    const event: AnalyticsEvent<ClickAcceptOffer> = {
      name: ANALYTICS_EVENT_NAMES.ClickAcceptOffer,
      eventType: ANALYTIC_EVENT_TYPES.Navigation,
      attributes,
    };

    this.analyticsService.trackEvent(event);
  }

  public trackClickRejectOffer(attributes: ClickRejectOffer): void {
    const event: AnalyticsEvent<ClickRejectOffer> = {
      name: ANALYTICS_EVENT_NAMES.ClickRejectOffer,
      eventType: ANALYTIC_EVENT_TYPES.Navigation,
      attributes,
    };

    this.analyticsService.trackEvent(event);
  }

  public trackClickAddEditAddress(attributes: ClickAddEditAddress): void {
    const event: AnalyticsEvent<ClickAddEditAddress> = {
      name: ANALYTICS_EVENT_NAMES.ClickAddEditAddress,
      eventType: ANALYTIC_EVENT_TYPES.Navigation,
      attributes,
    };

    this.analyticsService.trackEvent(event);
  }

  public trackClickHelpTransactional(attributes: ClickHelpTransactional): void {
    const event: AnalyticsEvent<ClickHelpTransactional> = {
      name: ANALYTICS_EVENT_NAMES.ClickHelpTransactional,
      eventType: ANALYTIC_EVENT_TYPES.Navigation,
      attributes,
    };

    this.analyticsService.trackEvent(event);
  }

  public trackClickScheduleHPU(attributes: ClickScheduleHPU): void {
    const event: AnalyticsEvent<ClickScheduleHPU> = {
      name: ANALYTICS_EVENT_NAMES.ClickScheduleHPU,
      eventType: ANALYTIC_EVENT_TYPES.UserPreference,
      attributes,
    };

    this.analyticsService.trackEvent(event);
  }
}
