import { ANALYTICS_EVENT_NAMES } from './resources/analytics-event-names';

// Export helpers to prevent multiple imports when using analytics code
export * from './resources/analytics-event-names';
export * from './resources/analytics-screen-ids';
export * from './resources/events-interfaces';

export enum ANALYTIC_EVENT_TYPES {
  Navigation = 1,
  Location = 2,
  Search = 3,
  Transaction = 4,
  UserContent = 5,
  UserPreference = 6,
  Social = 7,
  Other = 8,
}

export interface AnalyticsPageView<T> {
  name: string;
  attributes: T;
  flags?: Object;
}

export interface AnalyticsEvent<T> {
  name: ANALYTICS_EVENT_NAMES;
  eventType: ANALYTIC_EVENT_TYPES;
  attributes: T;
}
