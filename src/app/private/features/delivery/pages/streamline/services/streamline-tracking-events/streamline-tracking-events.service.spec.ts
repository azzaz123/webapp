import { TestBed } from '@angular/core/testing';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { MockAnalyticsService } from '@fixtures/analytics.fixtures.spec';
import { MOCK_VIEW_STREAMLINE_SCREEN_EVENT } from '@public/features/item-detail/core/services/item-detail-track-events/track-events.fixtures.spec';

import { StreamlineTrackingEventsService } from './streamline-tracking-events.service';

describe('StreamlineTrackingEventsService', () => {
  let service: StreamlineTrackingEventsService;
  let analyticsService: AnalyticsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StreamlineTrackingEventsService, { provide: AnalyticsService, useClass: MockAnalyticsService }],
    });
    service = TestBed.inject(StreamlineTrackingEventsService);
    analyticsService = TestBed.inject(AnalyticsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when user views the streamline', () => {
    it('should send track page view event', () => {
      spyOn(analyticsService, 'trackPageView');

      service.trackViewStreamlineScreen();

      expect(analyticsService.trackPageView).toHaveBeenCalledTimes(1);
      expect(analyticsService.trackPageView).toHaveBeenCalledWith(MOCK_VIEW_STREAMLINE_SCREEN_EVENT);
    });
  });
});
