import { TestBed } from '@angular/core/testing';
import { ANALYTICS_EVENT_NAMES, ANALYTIC_EVENT_TYPES } from '@core/analytics/analytics-constants';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { MockAnalyticsService } from '@fixtures/analytics.fixtures.spec';
import {
  MOCK_TRACK_CLICK_ACTIVATE_SHIPPING_ATTRIBUTES,
  MOCK_TRACK_CLICK_BANNER_BUY_ATTRIBUTES,
  MOCK_TRACK_CLICK_EDIT_ITEM_PRICE_ATTRIBUTES,
  MOCK_TRACK_SAVE_ITEM_PRICE_ATTRIBUTES,
} from '@fixtures/private/chat/chat-analytics.fixtures.spec';

import { DeliveryBannerTrackingEventsService } from './delivery-banner-tracking-events.service';

describe('DeliveryBannerTrackingEventsService', () => {
  let service: DeliveryBannerTrackingEventsService;
  let analyticsService: AnalyticsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DeliveryBannerTrackingEventsService,
        {
          provide: AnalyticsService,
          useClass: MockAnalyticsService,
        },
      ],
    });
    service = TestBed.inject(DeliveryBannerTrackingEventsService);
    analyticsService = TestBed.inject(AnalyticsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when asking to track click banner buy', () => {
    it('should track the action', () => {
      spyOn(analyticsService, 'trackEvent');

      service.trackClickBannerBuy(MOCK_TRACK_CLICK_BANNER_BUY_ATTRIBUTES);

      expect(analyticsService.trackEvent).toHaveBeenCalledTimes(1);
      expect(analyticsService.trackEvent).toHaveBeenCalledWith({
        name: ANALYTICS_EVENT_NAMES.ClickBuy,
        eventType: ANALYTIC_EVENT_TYPES.Navigation,
        attributes: MOCK_TRACK_CLICK_BANNER_BUY_ATTRIBUTES,
      });
    });
  });

  describe('when asking to track click edit item price', () => {
    it('should track the action', () => {
      spyOn(analyticsService, 'trackEvent');

      service.trackClickEditItemPrice(MOCK_TRACK_CLICK_EDIT_ITEM_PRICE_ATTRIBUTES);

      expect(analyticsService.trackEvent).toHaveBeenCalledTimes(1);
      expect(analyticsService.trackEvent).toHaveBeenCalledWith({
        name: ANALYTICS_EVENT_NAMES.ClickEditItemPrice,
        eventType: ANALYTIC_EVENT_TYPES.UserPreference,
        attributes: MOCK_TRACK_CLICK_EDIT_ITEM_PRICE_ATTRIBUTES,
      });
    });
  });

  describe('when asking to track click activate shipping', () => {
    it('should track the action', () => {
      spyOn(analyticsService, 'trackEvent');

      service.trackClickActivateShipping(MOCK_TRACK_CLICK_ACTIVATE_SHIPPING_ATTRIBUTES);

      expect(analyticsService.trackEvent).toHaveBeenCalledTimes(1);
      expect(analyticsService.trackEvent).toHaveBeenCalledWith({
        name: ANALYTICS_EVENT_NAMES.ClickActivateShipping,
        eventType: ANALYTIC_EVENT_TYPES.Navigation,
        attributes: MOCK_TRACK_CLICK_ACTIVATE_SHIPPING_ATTRIBUTES,
      });
    });
  });

  describe('when asking to track save item price', () => {
    it('should track the action', () => {
      spyOn(analyticsService, 'trackEvent');

      service.trackSaveItemPrice(MOCK_TRACK_SAVE_ITEM_PRICE_ATTRIBUTES);

      expect(analyticsService.trackEvent).toHaveBeenCalledTimes(1);
      expect(analyticsService.trackEvent).toHaveBeenCalledWith({
        name: ANALYTICS_EVENT_NAMES.SaveItemPrice,
        eventType: ANALYTIC_EVENT_TYPES.UserPreference,
        attributes: MOCK_TRACK_SAVE_ITEM_PRICE_ATTRIBUTES,
      });
    });
  });
});
