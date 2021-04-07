import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { UserService } from '@core/user/user.service';
import { MockAnalyticsService } from '@fixtures/analytics.fixtures.spec';
import { MOCK_CAR } from '@fixtures/car.fixtures.spec';
import { MOCK_CAR_ITEM_DETAIL } from '@fixtures/item-detail.fixtures.spec';
import { MOCK_ITEM, MOCK_ITEM_GBP } from '@fixtures/item.fixtures.spec';
import { MockedUserService, MOCK_USER } from '@fixtures/user.fixtures.spec';
import { SOCIAL_SHARE_CHANNELS } from '@shared/social-share/enums/social-share-channels.enum';
import { of } from 'rxjs';

import { ItemDetailTrackEventsService } from './item-detail-track-events.service';
import {
  MOCK_CLICK_CHAT_BUTTON_EVENT,
  MOCK_FAVORITE_ITEM_EVENT,
  MOCK_UNFAVORITE_ITEM_EVENT,
  MOCK_VIEW_OWN_ITEM_DETAIL_EVENT,
  MOCK_VIEW_OTHERS_CG_DETAIL_EVENT,
  MOCK_VIEW_OTHERS_ITEM_CAR_DETAIL_EVENT,
  MOCK_FB_SHARE_ITEM_EVENT,
  MOCK_TWITTER_SHARE_ITEM_EVENT,
  MOCK_EMAIL_SHARE_ITEM_EVENT,
} from './track-events.fixtures.spec';

describe('ItemDetailTrackEventsService', () => {
  let service: ItemDetailTrackEventsService;
  let analyticsService: AnalyticsService;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ItemDetailTrackEventsService,
        { provide: AnalyticsService, useClass: MockAnalyticsService },
        { provide: UserService, useClass: MockedUserService },
      ],
    });
    service = TestBed.inject(ItemDetailTrackEventsService);
    analyticsService = TestBed.inject(AnalyticsService);
    userService = TestBed.inject(UserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('trackFavoriteOrUnfavoriteEvent', () => {
    beforeEach(() => {
      spyOn(service, 'trackFavoriteOrUnfavoriteEvent').and.callThrough();
      spyOn(analyticsService, 'trackEvent');
    });
    const itemDetail = MOCK_CAR_ITEM_DETAIL;
    it('should send favorite item event if we favorite item', () => {
      itemDetail.item.flags.favorite = true;

      service.trackFavoriteOrUnfavoriteEvent(itemDetail);

      expect(analyticsService.trackEvent).toHaveBeenCalledWith(MOCK_FAVORITE_ITEM_EVENT);
      expect(analyticsService.trackEvent).not.toHaveBeenCalledWith(MOCK_UNFAVORITE_ITEM_EVENT);
    });
    it('should send unfavorite item event if we unfavorite item', () => {
      itemDetail.item.flags.favorite = false;

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

  describe('trackShareItemEvent', () => {
    beforeEach(() => {
      spyOn(service, 'trackShareItemEvent').and.callThrough();
      spyOn(analyticsService, 'trackEvent');
    });
    const item = MOCK_CAR;
    const user = MOCK_USER;
    it('should send track share item event with facebook channel if user click facebook icon', () => {
      const channel = SOCIAL_SHARE_CHANNELS.FACEBOOK;

      service.trackShareItemEvent(channel, item, user);

      expect(analyticsService.trackEvent).toHaveBeenCalledWith(MOCK_FB_SHARE_ITEM_EVENT);
    });

    it('should send track share item event with twitter channel if user click twitter icon', () => {
      const channel = SOCIAL_SHARE_CHANNELS.TWITTER;

      service.trackShareItemEvent(channel, item, user);

      expect(analyticsService.trackEvent).toHaveBeenCalledWith(MOCK_TWITTER_SHARE_ITEM_EVENT);
    });

    it('should send track share item event with email channel if user click email icon', () => {
      const channel = SOCIAL_SHARE_CHANNELS.EMAIL;

      service.trackShareItemEvent(channel, item, user);

      expect(analyticsService.trackEvent).toHaveBeenCalledWith(MOCK_EMAIL_SHARE_ITEM_EVENT);
    });
  });

  describe('trackViewOthersItemCarDetailEvent', () => {
    const item = MOCK_CAR;
    const user = MOCK_USER;
    beforeEach(() => {
      spyOn(analyticsService, 'trackPageView');
    });
    it('should send view others Car item detail event with true carDealer if user is professional', () => {
      spyOn(service, 'trackViewOthersItemCarDetailEvent').and.callThrough();

      service.trackViewOthersItemCarDetailEvent(item, user);

      expect(analyticsService.trackPageView).toHaveBeenCalledWith(MOCK_VIEW_OTHERS_ITEM_CAR_DETAIL_EVENT);
    });

    it('should send view others Car item detail event with false carDealer if user is not professional', () => {
      const mockVIewOthersItemCarDetailNonCarDealer = { ...MOCK_VIEW_OTHERS_ITEM_CAR_DETAIL_EVENT };
      mockVIewOthersItemCarDetailNonCarDealer.attributes.isCarDealer = false;
      spyOn(userService, 'isProfessional').and.returnValue(of(false));
      spyOn(service, 'trackViewOthersItemCarDetailEvent').and.callThrough();

      service.trackViewOthersItemCarDetailEvent(item, user);

      expect(analyticsService.trackPageView).toHaveBeenCalledWith(mockVIewOthersItemCarDetailNonCarDealer);
    });
  });
});
