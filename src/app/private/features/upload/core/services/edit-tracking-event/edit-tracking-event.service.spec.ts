import { TestBed } from '@angular/core/testing';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MockAnalyticsService } from '@fixtures/analytics.fixtures.spec';
import { MOCK_ITEM } from '@fixtures/item.fixtures.spec';
import { AnalyticsPageView, ANALYTICS_EVENT_NAMES, SCREEN_IDS, ViewEditItem } from '@core/analytics/analytics-constants';
import { Item } from '@core/item/item';
import { EditTrackingEventService } from './edit-tracking-event.service';

describe('EditTrackingEventService', () => {
  let service: EditTrackingEventService;
  let analyticsService: AnalyticsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [EditTrackingEventService, { provide: AnalyticsService, useClass: MockAnalyticsService }],
    });
    service = TestBed.inject(EditTrackingEventService);
    analyticsService = TestBed.inject(AnalyticsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when item edit', () => {
    const item: Item = MOCK_ITEM;
    let event: AnalyticsPageView<ViewEditItem>;

    beforeEach(() => {
      spyOn(analyticsService, 'trackPageView');

      event = {
        name: ANALYTICS_EVENT_NAMES.ViewEditItem,
        attributes: {
          screenId: SCREEN_IDS.Upload,
          categoryId: item.categoryId,
          mandatoryAdditionalFields: false,
        },
      };
    });

    describe('and is normal view', () => {
      const isReactivation = false;

      beforeEach(() => {
        event.attributes.mandatoryAdditionalFields = isReactivation;
      });

      it('should send view track event without mandatory data flag', () => {
        service.trackViewEditItemEvent(item.categoryId, isReactivation);

        expect(analyticsService.trackPageView).toHaveBeenCalledWith(event);
      });
    });

    describe('and is reactivation view', () => {
      const isReactivation = true;

      beforeEach(() => {
        event.attributes.mandatoryAdditionalFields = isReactivation;
      });

      it('should send view track event with mandatory data flag', () => {
        service.trackViewEditItemEvent(item.categoryId, isReactivation);

        expect(analyticsService.trackPageView).toHaveBeenCalledWith(event);
      });
    });
  });
});
