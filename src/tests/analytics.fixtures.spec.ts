import { AnalyticsEvent, PageViewInterface } from '../app/core/analytics/analytics-constants';

export class MockAnalyticsService {
    initialize() { }
    trackEvent<T>(_event: AnalyticsEvent<T>) { }
    trackPageView(_page: PageViewInterface) { }
}

