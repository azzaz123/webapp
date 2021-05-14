import { TestBed } from '@angular/core/testing';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MockAnalyticsService } from '@fixtures/analytics.fixtures.spec';
import { MOCK_ITEM } from '@fixtures/item.fixtures.spec';
import {
  AnalyticsEvent,
  ANALYTICS_EVENT_NAMES,
  ANALYTIC_EVENT_TYPES,
  ReactivateItem,
  SCREEN_IDS,
} from '@core/analytics/analytics-constants';
import { UserService } from '@core/user/user.service';
import { Item } from '@core/item/item';
import { CatalogItemTrackingEventService } from './catalog-item-tracking-event.service';

describe('CatalogItemTrackingEventService', () => {
  let service: CatalogItemTrackingEventService;
  let analyticsService: AnalyticsService;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CatalogItemTrackingEventService,
        { provide: AnalyticsService, useClass: MockAnalyticsService },
        {
          provide: UserService,
          useValue: {
            isPro: null,
          },
        },
      ],
    });
    service = TestBed.inject(CatalogItemTrackingEventService);
    analyticsService = TestBed.inject(AnalyticsService);
    userService = TestBed.inject(UserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when item reactivation', () => {
    const item: Item = MOCK_ITEM;
    let event: AnalyticsEvent<ReactivateItem>;

    beforeEach(() => {
      spyOn(service, 'trackReactivateItemEvent').and.callThrough();
      spyOn(analyticsService, 'trackEvent');

      event = {
        name: ANALYTICS_EVENT_NAMES.ReactivateItem,
        eventType: ANALYTIC_EVENT_TYPES.Other,
        attributes: {
          itemId: item.id,
          categoryId: item.categoryId,
          subcategoryId: parseInt(item.extraInfo?.object_type?.id, 10),
          salePrice: item.salePrice,
          title: item.title,
          brand: item.extraInfo?.brand,
          model: item.extraInfo?.model,
          objectType: item.extraInfo?.object_type.name,
          isPro: null,
          screenId: SCREEN_IDS.MyCatalog,
        },
      };
    });

    describe('and user is not pro', () => {
      beforeEach(() => {
        const isPro = false;
        Object.defineProperty(userService, 'isPro', { value: isPro });
        event.attributes.isPro = isPro;
      });

      it('should send click item card event', () => {
        service.trackReactivateItemEvent(item);

        expect(analyticsService.trackEvent).toHaveBeenCalledWith(event);
      });
    });

    describe('and user is pro', () => {
      beforeEach(() => {
        const isPro = true;
        Object.defineProperty(userService, 'isPro', { value: isPro });
        event.attributes.isPro = isPro;
      });

      it('should send click item card event', () => {
        service.trackReactivateItemEvent(item);

        expect(analyticsService.trackEvent).toHaveBeenCalledWith(event);
      });
    });
  });
});
