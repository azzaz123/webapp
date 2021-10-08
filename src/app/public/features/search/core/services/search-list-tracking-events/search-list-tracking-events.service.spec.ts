import { HttpClientTestingModule } from '@angular/common/http/testing';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { UserService } from '@core/user/user.service';
import { MockAnalyticsService } from '@fixtures/analytics.fixtures.spec';
import { MOCK_ITEM_CARD } from '@fixtures/item-card.fixtures.spec';
import { MockedUserService } from '@fixtures/user.fixtures.spec';
import { MOCK_ITEM_INDEX } from '@public/features/item-detail/core/services/item-detail-track-events/track-events.fixtures.spec';
import {
  MOCK_CLICK_ITEM_CARD_EVENT_FROM_SEARCH,
  MOCK_FAVOURITE_ITEM_EVENT_FROM_SEARCH,
  MOCK_SEARCH_ID,
  MOCK_UNFAVOURITE_ITEM_EVENT_FROM_SEARCH,
} from './search-list-tracking-events.fixtures.spec';
import { SearchListTrackingEventsService } from './search-list-tracking-events.service';

describe('SearchListTrackingEventsService', () => {
  let service: SearchListTrackingEventsService;
  let analyticsService: AnalyticsService;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        SearchListTrackingEventsService,
        { provide: AnalyticsService, useClass: MockAnalyticsService },
        { provide: UserService, useClass: MockedUserService },
      ],
    });
    service = TestBed.inject(SearchListTrackingEventsService);
    analyticsService = TestBed.inject(AnalyticsService);
    userService = TestBed.inject(UserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when user clicks on the item card', () => {
    it('should send track click item card event', fakeAsync(() => {
      spyOn(service, 'trackClickItemCardEvent').and.callThrough();
      spyOn(analyticsService, 'trackEvent');

      service.trackClickItemCardEvent(MOCK_ITEM_CARD, MOCK_ITEM_INDEX, MOCK_SEARCH_ID);
      tick();

      expect(analyticsService.trackEvent).toHaveBeenCalledWith(MOCK_CLICK_ITEM_CARD_EVENT_FROM_SEARCH);
    }));
  });

  describe('when user triggers on favourite button', () => {
    it('should send favourite item event', (done) => {
      spyOn(analyticsService, 'trackEvent');

      service.trackFavouriteItemEvent(MOCK_ITEM_CARD, MOCK_FAVOURITE_ITEM_EVENT_FROM_SEARCH.attributes.searchId).then(() => {
        expect(analyticsService.trackEvent).toHaveBeenCalledWith(MOCK_FAVOURITE_ITEM_EVENT_FROM_SEARCH);
        done();
      });
    });
  });

  describe('when user triggers on unfavourite button', () => {
    it('should send unfavourite item event', (done) => {
      spyOn(analyticsService, 'trackEvent');

      service.trackUnfavouriteItemEvent(MOCK_ITEM_CARD).then(() => {
        expect(analyticsService.trackEvent).toHaveBeenCalledWith(MOCK_UNFAVOURITE_ITEM_EVENT_FROM_SEARCH);
        done();
      });
    });
  });
});
