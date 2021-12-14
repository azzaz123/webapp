import { TestBed } from '@angular/core/testing';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { MockAnalyticsService } from '@fixtures/analytics.fixtures.spec';
import {
  MOCK_ACTION_NAME_EVENT,
  MOCK_CLICK_ACTION_TTS_EVENT,
  MOCK_REQUEST_ID_TTS_EVENT,
  MOCK_TRACKING_VIEW_TTS_EVENT,
} from '@fixtures/private/delivery/transactional-tracking-screen/transaction-tracking-events.fixtures.spec';

import { TransactionTrackingScreenTrackingEventsService } from './transaction-tracking-screen-tracking-events.service';

describe('TransactionTrackingScreenTrackingEventsService', () => {
  let service: TransactionTrackingScreenTrackingEventsService;
  let analyticsService: AnalyticsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TransactionTrackingScreenTrackingEventsService, { provide: AnalyticsService, useClass: MockAnalyticsService }],
    });
    service = TestBed.inject(TransactionTrackingScreenTrackingEventsService);
    analyticsService = TestBed.inject(AnalyticsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when tracking view TTS screen', () => {
    it('should track the page view event ', () => {
      spyOn(analyticsService, 'trackPageView');

      service.trackViewTTSScreen(
        MOCK_REQUEST_ID_TTS_EVENT,
        MOCK_TRACKING_VIEW_TTS_EVENT.attributes.buyerCountry,
        MOCK_TRACKING_VIEW_TTS_EVENT.attributes.sellerCountry
      );

      expect(analyticsService.trackPageView).toHaveBeenCalledTimes(1);
      expect(analyticsService.trackPageView).toHaveBeenCalledWith(MOCK_TRACKING_VIEW_TTS_EVENT);
    });
  });

  describe('when tracking click action TTS event', () => {
    it('should track the event ', () => {
      spyOn(analyticsService, 'trackEvent');

      service.trackClickActionTTS(MOCK_REQUEST_ID_TTS_EVENT, MOCK_ACTION_NAME_EVENT);

      expect(analyticsService.trackEvent).toHaveBeenCalledTimes(1);
      expect(analyticsService.trackEvent).toHaveBeenCalledWith(MOCK_CLICK_ACTION_TTS_EVENT);
    });
  });
});
