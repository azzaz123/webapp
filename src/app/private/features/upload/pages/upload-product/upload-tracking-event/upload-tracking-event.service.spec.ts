import { TestBed } from '@angular/core/testing';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MockAnalyticsService } from '@fixtures/analytics.fixtures.spec';
import { MOCK_ITEM } from '@fixtures/item.fixtures.spec';
import {
  AnalyticsEvent,
  ANALYTICS_EVENT_NAMES,
  ANALYTIC_EVENT_TYPES,
  ClickHelpTransactional,
  SCREEN_IDS,
} from '@core/analytics/analytics-constants';
import { Item } from '@core/item/item';
import { UploadTrackingEventService } from './upload-tracking-event.service';

describe('UploadTrackingEventService', () => {
  let service: UploadTrackingEventService;
  let analyticsService: AnalyticsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UploadTrackingEventService, { provide: AnalyticsService, useClass: MockAnalyticsService }],
    });
    service = TestBed.inject(UploadTrackingEventService);
    analyticsService = TestBed.inject(AnalyticsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when item edit', () => {
    const item: Item = MOCK_ITEM;
    let event: AnalyticsEvent<ClickHelpTransactional>;

    beforeEach(() => {
      spyOn(analyticsService, 'trackEvent');

      event = {
        name: ANALYTICS_EVENT_NAMES.ClickHelpTransactional,
        eventType: ANALYTIC_EVENT_TYPES.Navigation,
        attributes: {
          screenId: SCREEN_IDS.Upload,
          categoryId: item.categoryId,
          sellerUserId: item.owner,
          itemId: item.id,
          itemPrice: item.salePrice,
          helpName: 'Help Shipping Upload Screen',
        },
      };
    });

    it('should send view track event with mandatory data flag', () => {
      service.trackClickHelpTransactionalEvent(item.categoryId, item.owner, item.salePrice, item.id);

      expect(analyticsService.trackEvent).toHaveBeenCalledWith(event);
    });
  });
});
