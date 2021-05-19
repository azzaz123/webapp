import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import {
  AnalyticsEvent,
  ClickKeyboardSearchButton,
  ANALYTICS_EVENT_NAMES,
  ANALYTIC_EVENT_TYPES,
  SCREEN_IDS,
  CancelSearch,
} from '@core/analytics/analytics-constants';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { MockAnalyticsService } from '@fixtures/analytics.fixtures.spec';
import { TopbarTrackingEventsService } from './topbar-tracking-events.service';

describe('TopbarTrackingEventsService', () => {
  let service: TopbarTrackingEventsService;
  let analyticsService: AnalyticsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TopbarTrackingEventsService, { provide: AnalyticsService, useClass: MockAnalyticsService }],
    });
    service = TestBed.inject(TopbarTrackingEventsService);
    analyticsService = TestBed.inject(AnalyticsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when user click keyaboard search button (enter)', () => {
    const searchText = 'searchText';

    const event: AnalyticsEvent<ClickKeyboardSearchButton> = {
      name: ANALYTICS_EVENT_NAMES.ClickKeyboardSearchButton,
      eventType: ANALYTIC_EVENT_TYPES.Navigation,
      attributes: {
        screenId: SCREEN_IDS.Search,
        searchText: searchText,
      },
    };

    it('should send click keyaboard search button event', () => {
      spyOn(analyticsService, 'trackEvent');

      service.trackClickKeyboardSearchButtonEvent(searchText);

      expect(analyticsService.trackEvent).toHaveBeenCalledWith(event);
    });
  });

  describe('when user cancels the search (cross button)', () => {
    const searchText = 'searchText';

    const event: AnalyticsEvent<CancelSearch> = {
      name: ANALYTICS_EVENT_NAMES.CancelSearch,
      eventType: ANALYTIC_EVENT_TYPES.Navigation,
      attributes: {
        screenId: SCREEN_IDS.Search,
        searchText: searchText,
      },
    };

    it('should send cancel search event', () => {
      spyOn(analyticsService, 'trackEvent');

      service.trackCancelSearchEvent(searchText);

      expect(analyticsService.trackEvent).toHaveBeenCalledWith(event);
    });
  });
});
