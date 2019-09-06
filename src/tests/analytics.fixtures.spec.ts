import { PageViewInterface } from './../app/core/analytics/interfaces/pageview.interface';
import { EventInterface } from './../app/core/analytics/interfaces/event.interface';
export class MockAnalyticsService {

    initialize() { }
    trackEvent(event: EventInterface) { }
    trackPageView(page: PageViewInterface) { }

}

