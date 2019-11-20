import { EventInterface, PageViewInterface } from '../app/core/analytics/resources/analytics-constants';

export class MockAnalyticsService {
    initialize() { }
    trackEvent(_event: EventInterface) { }
    trackPageView(_page: PageViewInterface) { }
}

