import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { MockAnalyticsService } from '@fixtures/analytics.fixtures.spec';
import { MOCK_CAR_ITEM_DETAIL } from '@fixtures/item-detail.fixtures.spec';
import { MOCK_ITEM, MOCK_ITEM_GBP } from '@fixtures/item.fixtures.spec';
import { MOCK_OTHER_USER, MOCK_USER } from '@fixtures/user.fixtures.spec';

import { ItemDetailTrackEventsService } from './item-detail-track-events.service';
import {
  MOCK_CLICK_CHAT_BUTTON_EVENT,
  MOCK_FAVORITE_ITEM_EVENT,
  MOCK_UNFAVORITE_ITEM_EVENT,
  MOCK_VIEW_OWN_ITEM_DETAIL_EVENT,
  MOCK_VIEW_OTHERS_CG_DETAIL_EVENT,
} from './track-events.fixtures.spec';

describe('ItemDetailTrackEventsService', () => {
  let service: ItemDetailTrackEventsService;
  let analyticsService: AnalyticsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ItemDetailTrackEventsService, { provide: AnalyticsService, useClass: MockAnalyticsService }],
    });
    service = TestBed.inject(ItemDetailTrackEventsService);
    analyticsService = TestBed.inject(AnalyticsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('trackFavoriteOrUnfavoriteEvent', () => {
    const itemDetail = MOCK_CAR_ITEM_DETAIL;
    it('should send favorite item event if we favorite item', () => {
      itemDetail.item.flags.favorite = true;
      spyOn(service, 'trackFavoriteOrUnfavoriteEvent').and.callThrough();
      spyOn(analyticsService, 'trackEvent');

      service.trackFavoriteOrUnfavoriteEvent(itemDetail);

      expect(analyticsService.trackEvent).toHaveBeenCalledWith(MOCK_FAVORITE_ITEM_EVENT);
      expect(analyticsService.trackEvent).not.toHaveBeenCalledWith(MOCK_UNFAVORITE_ITEM_EVENT);
    });
    it('should send unfavorite item event if we unfavorite item', () => {
      itemDetail.item.flags.favorite = false;
      spyOn(service, 'trackFavoriteOrUnfavoriteEvent').and.callThrough();
      spyOn(analyticsService, 'trackEvent');

      service.trackFavoriteOrUnfavoriteEvent(itemDetail);

      expect(analyticsService.trackEvent).toHaveBeenCalledWith(MOCK_UNFAVORITE_ITEM_EVENT);
      expect(analyticsService.trackEvent).not.toHaveBeenCalledWith(MOCK_FAVORITE_ITEM_EVENT);
    });
  });

  describe('trackChatButton', () => {
    const item = MOCK_ITEM;
    const user = MOCK_USER;
    it('should send track chat button event', () => {
      spyOn(service, 'trackClickChatButton').and.callThrough();
      spyOn(analyticsService, 'trackEvent');

      service.trackClickChatButton(item, user);

      expect(analyticsService.trackEvent).toHaveBeenCalledWith(MOCK_CLICK_CHAT_BUTTON_EVENT);
    });
  });

  describe('trackViewOwnItemDetail', () => {
    const item = MOCK_CAR_ITEM_DETAIL.item;
    const user = MOCK_USER;
    it('should send track view own item detail event', () => {
      spyOn(service, 'trackViewOwnItemDetail').and.callThrough();
      spyOn(analyticsService, 'trackPageView');

      service.trackViewOwnItemDetail(item, user);

      expect(analyticsService.trackPageView).toHaveBeenCalledWith(MOCK_VIEW_OWN_ITEM_DETAIL_EVENT);
    });
  });

  describe('trackViewOthersCGDetailEvent', () => {
    const item = MOCK_ITEM_GBP;
    const user = MOCK_USER;
    it('should send view others CG item detail event', () => {
      spyOn(service, 'trackViewOthersCGDetailEvent').and.callThrough();
      spyOn(analyticsService, 'trackPageView');

      service.trackViewOthersCGDetailEvent(item, user);

      expect(analyticsService.trackPageView).toHaveBeenCalledWith(MOCK_VIEW_OTHERS_CG_DETAIL_EVENT);
    });
  });
});
