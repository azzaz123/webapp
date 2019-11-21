import { ANALYTICS_EVENT_NAMES } from './resources/analytics-event-names';

export enum EVENT_TYPES {
    Navigation = 1,
    Location = 2,
    Search = 3,
    Transaction = 4,
    UserContent = 5,
    UserPreference = 6,
    Social = 7,
    Other = 8
}

export interface PageViewInterface {
    name: string;
    attributes: Object;
    flags?: Object;
}

export interface EventInterface<T> {
    name: ANALYTICS_EVENT_NAMES;
    eventType: EVENT_TYPES;
    attributes: T;
}
