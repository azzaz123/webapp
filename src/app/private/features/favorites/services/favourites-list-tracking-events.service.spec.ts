import { TestBed } from '@angular/core/testing';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { MockAnalyticsService } from '@fixtures/analytics.fixtures.spec';
import { MOCK_ITEM } from '@fixtures/item.fixtures.spec';
import { Item } from '@core/item/item';
import { FavouritesListTrackingEventsService } from './favourites-list-tracking-events.service';
import {
  AnalyticsEvent,
  ANALYTICS_EVENT_NAMES,
  ANALYTIC_EVENT_TYPES,
  ClickItemCard,
  SCREEN_IDS,
  UnfavoriteItem,
} from '@core/analytics/analytics-constants';

describe('FavouritesListTrackingEventsService', () => {
  let service: FavouritesListTrackingEventsService;
  let analyticsService: AnalyticsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [FavouritesListTrackingEventsService, { provide: AnalyticsService, useClass: MockAnalyticsService }],
    });
    service = TestBed.inject(FavouritesListTrackingEventsService);
    analyticsService = TestBed.inject(AnalyticsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when user clicks on a favourited item', () => {
    beforeEach(() => {
      spyOn(service, 'trackClickItemCardEvent').and.callThrough();
      spyOn(analyticsService, 'trackEvent');
    });
    const item: Item = MOCK_ITEM;

    it('should send click item card event', () => {
      service.trackClickItemCardEvent(item, 1);

      const MOCK_EVENT: AnalyticsEvent<ClickItemCard> = {
        name: ANALYTICS_EVENT_NAMES.ClickItemCard,
        eventType: ANALYTIC_EVENT_TYPES.Navigation,
        attributes: {
          itemId: item.id,
          categoryId: item.categoryId,
          position: 2,
          screenId: SCREEN_IDS.MyFavoriteItemsSection,
          salePrice: item.salePrice,
          title: item.title,
          isBumped: item.flags?.bumped,
        },
      };

      expect(analyticsService.trackEvent).toHaveBeenCalledWith(MOCK_EVENT);
    });
  });

  describe('when user clicks on unfavourited btn', () => {
    beforeEach(() => {
      spyOn(service, 'trackUnfavouriteItemEvent').and.callThrough();
      spyOn(analyticsService, 'trackEvent');
    });
    const item: Item = MOCK_ITEM;

    it('should send unfavoutie item event', () => {
      service.trackUnfavouriteItemEvent(item);

      const MOCK_EVENT: AnalyticsEvent<UnfavoriteItem> = {
        name: ANALYTICS_EVENT_NAMES.UnfavoriteItem,
        eventType: ANALYTIC_EVENT_TYPES.Navigation,
        attributes: {
          itemId: item.id,
          categoryId: item.categoryId,
          screenId: SCREEN_IDS.MyFavoriteItemsSection,
          salePrice: item.salePrice,
          title: item.title,
          isBumped: item.flags?.bumped,
        },
      };

      expect(analyticsService.trackEvent).toHaveBeenCalledWith(MOCK_EVENT);
    });
  });
});
