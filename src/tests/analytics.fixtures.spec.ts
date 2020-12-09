import {
  AnalyticsEvent,
  AnalyticsPageView,
} from '@core/analytics/analytics-constants';

export class MockAnalyticsService {
  initialize() {}
  trackEvent<T>(_event: AnalyticsEvent<T>) {}
  trackPageView<T>(_page: AnalyticsPageView<T>) {}
  getDeviceId() {}
}
