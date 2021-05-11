import { TestBed } from '@angular/core/testing';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { MockedUserService } from '@fixtures/user.fixtures.spec';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MockAnalyticsService } from '@fixtures/analytics.fixtures.spec';
import { UserService } from '@core/user/user.service';
import { CatalogItemTrackingEventService } from './catalog-item-tracking-event.service';
import { ITEM_DATA3 } from '@fixtures/item.fixtures.spec';
import {
  AnalyticsEvent,
  ANALYTICS_EVENT_NAMES,
  ANALYTIC_EVENT_TYPES,
  ReactivateItem,
  SCREEN_IDS,
} from '@core/analytics/analytics-constants';

describe('CatalogItemTrackingEventService', () => {
  let service: CatalogItemTrackingEventService;
  let analyticsService: AnalyticsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CatalogItemTrackingEventService,
        { provide: AnalyticsService, useClass: MockAnalyticsService },
        { provide: UserService, useClass: MockedUserService },
      ],
    });
    service = TestBed.inject(CatalogItemTrackingEventService);
    analyticsService = TestBed.inject(AnalyticsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when item reactivation', () => {
    const item = ITEM_DATA3;
    let event: AnalyticsEvent<ReactivateItem>;

    beforeEach(() => {
      spyOn(service, 'trackReactivateItemEvent').and.callThrough();
      spyOn(analyticsService, 'trackEvent');

      event = {
        name: ANALYTICS_EVENT_NAMES.ReactivateItem,
        eventType: ANALYTIC_EVENT_TYPES.Navigation, // TODO check with product
        attributes: {
          itemId: item.id,
          categoryId: service['getCategoryId'](item),
          subcategoryId: parseInt(item.content.extra_info?.object_type?.id, 10),
          salePrice: item.content.sale_price,
          title: item.content.title,
          brand: item.content.extra_info?.brand,
          model: item.content.extra_info?.model,
          objectType: item.content.extra_info?.object_type.name,
          isPro: null,
          screenId: SCREEN_IDS.MyCatalog,
        },
      };
    });

    describe('and user is not pro', () => {
      const isPro = false;
      beforeEach(() => {
        event.attributes.isPro = isPro;
      });

      it('should send click item card event', () => {
        service.trackReactivateItemEvent(item, isPro);

        expect(analyticsService.trackEvent).toHaveBeenCalledWith(event);
      });
    });

    describe('and user is pro', () => {
      const isPro = true;
      beforeEach(() => {
        event.attributes.isPro = isPro;
      });

      it('should send click item card event', () => {
        service.trackReactivateItemEvent(item, isPro);

        expect(analyticsService.trackEvent).toHaveBeenCalledWith(event);
      });
    });
  });
});
