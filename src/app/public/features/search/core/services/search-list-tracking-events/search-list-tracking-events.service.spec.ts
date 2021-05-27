import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { UserService } from '@core/user/user.service';
import { MockAnalyticsService } from '@fixtures/analytics.fixtures.spec';
import { MOCK_ITEM_CARD } from '@fixtures/item-card.fixtures.spec';
import { MockedUserService } from '@fixtures/user.fixtures.spec';
import { MOCK_ITEM_INDEX } from '@public/features/item-detail/core/services/item-detail-track-events/track-events.fixtures.spec';
import { of } from 'rxjs';
import { MOCK_CLICK_ITEM_CARD_EVENT_FROM_SEARCH, MOCK_SEARCH_ID } from './search-list-tracking-events.fixtures.spec';
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
    userService = TestBed.inject(AnalyticsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when user clicks on the item card', () => {
    it('should send track click item card event', () => {
      spyOn(service, 'trackClickItemCardEvent').and.callThrough();
      spyOn(analyticsService, 'trackEvent');

      service.trackClickItemCardEvent(MOCK_ITEM_CARD, MOCK_ITEM_INDEX, MOCK_SEARCH_ID);

      expect(analyticsService.trackEvent).toHaveBeenCalledWith(MOCK_CLICK_ITEM_CARD_EVENT_FROM_SEARCH);
    });
  });

  describe('when user triggers on favourite button', () => {
    beforeEach(() => {
      spyOn(userService, 'isPro').and.returnValue(of(false));
    });

    it('should send favourite item event', () => {
      const event = { ...MOCK_CLICK_ITEM_CARD_EVENT_FROM_SEARCH };
      const searchId = 'searchId';
      event.attributes.searchId = searchId;
      spyOn(service, 'trackFavouriteItemEvent');
      spyOn(analyticsService, 'trackEvent');

      service.trackFavouriteItemEvent(MOCK_ITEM_CARD, searchId);

      expect(analyticsService.trackEvent).toHaveBeenCalledWith(event);
    });
  });

  describe('when user triggers on unfavourite button', () => {
    beforeEach(() => {
      spyOn(userService, 'isPro').and.returnValue(of(false));
    });

    it('should send unfavourite item event', () => {
      spyOn(service, 'trackUnfavouriteItemEvent');

      spyOn(analyticsService, 'trackEvent');

      service.trackUnfavouriteItemEvent(MOCK_ITEM_CARD);

      expect(analyticsService.trackEvent).toHaveBeenCalledWith(MOCK_CLICK_ITEM_CARD_EVENT_FROM_SEARCH);
    });
  });
});
