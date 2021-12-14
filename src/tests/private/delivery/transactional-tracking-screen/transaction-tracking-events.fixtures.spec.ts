import {
  AnalyticsEvent,
  AnalyticsPageView,
  ANALYTICS_EVENT_NAMES,
  ANALYTIC_EVENT_TYPES,
  ClickActionTappedTransactionalTimeline,
  SCREEN_IDS,
  ViewTransactionalTimeline,
} from '@core/analytics/analytics-constants';
import { ActionNameAnalytics } from '@private/features/delivery/pages/transaction-tracking-screen/services/transaction-tracking-screen-tracking-events/action-name-analytics-type';

export const MOCK_REQUEST_ID_TTS_EVENT = '123';
export const MOCK_ACTION_NAME_EVENT: ActionNameAnalytics = 'Help General Doubts';

export const MOCK_TRACKING_VIEW_TTS_EVENT: AnalyticsPageView<ViewTransactionalTimeline> = {
  name: ANALYTICS_EVENT_NAMES.ViewTransactionalTimeline,
  attributes: {
    screenId: SCREEN_IDS.ShippingTimeline,
    requestId: MOCK_REQUEST_ID_TTS_EVENT,
    source: 'N/A',
    buyerCountry: 'ES',
    sellerCountry: 'IT',
  },
};

export const MOCK_CLICK_ACTION_TTS_EVENT: AnalyticsEvent<ClickActionTappedTransactionalTimeline> = {
  name: ANALYTICS_EVENT_NAMES.ClickActionTappedTransactionalTimeline,
  eventType: ANALYTIC_EVENT_TYPES.Navigation,
  attributes: {
    screenId: SCREEN_IDS.ShippingTimeline,
    requestId: MOCK_REQUEST_ID_TTS_EVENT,
    actionName: MOCK_ACTION_NAME_EVENT,
  },
};
