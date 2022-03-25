import { TestBed } from '@angular/core/testing';

import { PayviewTrackingEventsService } from './payview-tracking-events.service';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MockAnalyticsService } from '@fixtures/analytics.fixtures.spec';

describe('PayviewTrackingEventsService', () => {
  let service: PayviewTrackingEventsService;
  let analyticsService: AnalyticsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: AnalyticsService, useClass: MockAnalyticsService }],
    });
    service = TestBed.inject(PayviewTrackingEventsService);
    analyticsService = TestBed.inject(AnalyticsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
