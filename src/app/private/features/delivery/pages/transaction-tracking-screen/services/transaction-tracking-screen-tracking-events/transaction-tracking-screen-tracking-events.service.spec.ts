import { TestBed } from '@angular/core/testing';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { MockAnalyticsService } from '@fixtures/analytics.fixtures.spec';
import {
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

      service.trackViewTTSScreen(MOCK_REQUEST_ID_TTS_EVENT);

      expect(analyticsService.trackPageView).toHaveBeenCalledTimes(1);
      expect(analyticsService.trackPageView).toHaveBeenCalledWith(MOCK_TRACKING_VIEW_TTS_EVENT);
    });
  });
});
