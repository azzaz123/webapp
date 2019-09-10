import { PageViewInterface } from '../app/core/analytics/events-interfaces/pageview.interface';
import { EventInterface } from '../app/core/analytics/events-interfaces/event.interface';
export class MockAnalyticsService {

    initialize() { }
    trackEvent(event: EventInterface) { }
    trackPageView(page: PageViewInterface) { }

}

