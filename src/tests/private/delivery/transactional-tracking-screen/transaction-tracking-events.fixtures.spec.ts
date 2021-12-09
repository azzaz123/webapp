import { AnalyticsPageView, ANALYTICS_EVENT_NAMES, SCREEN_IDS, ViewTransactionalTimeline } from '@core/analytics/analytics-constants';

export const MOCK_REQUEST_ID_TTS_EVENT = '123';
export const MOCK_TRACKING_VIEW_TTS_EVENT: AnalyticsPageView<ViewTransactionalTimeline> = {
  name: ANALYTICS_EVENT_NAMES.ViewTransactionalTimeline,
  attributes: {
    screenId: SCREEN_IDS.ShippingTimeline,
    requestId: MOCK_REQUEST_ID_TTS_EVENT,
    source: 'N/A',
  },
};
