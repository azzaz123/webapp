import { ANALYTICS_EVENT_NAMES } from '../resources/analytics-event-names';
import { EVENT_TYPES } from '../resources/analytics-constants';

export interface EventInterface {
    name: ANALYTICS_EVENT_NAMES;
    eventType: EVENT_TYPES;
    attributes: Object;
}