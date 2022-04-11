import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ANALYTICS_EVENT_NAMES, ANALYTIC_EVENT_TYPES } from '@core/analytics/analytics-constants';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { MockAnalyticsService } from '@fixtures/analytics.fixtures.spec';
import {
  MOCK_CLICK_ACCEPT_OFFER_EVENT_PROPERTIES_WITH_HPU,
  MOCK_CLICK_ADD_EDIT_ADDRESS_EVENT_PROPERTIES_WITH_FULL_ADDRESS_AND_PO,
  MOCK_CLICK_HELP_TRANSACTIONAL_EVENT_PROPERTIES,
  MOCK_CLICK_ITEM_CARD_EVENT_PROPERTIES,
  MOCK_CLICK_OTHER_PROFILE_EVENT_PROPERTIES,
  MOCK_CLICK_REJECT_OFFER_EVENT_PROPERTIES_WITH_HPU,
  MOCK_CLICK_SCHEDULE_HPU_EVENT_PROPERTIES,
  MOCK_VIEW_ACCEPT_OFFER_EVENT_PROPERTIES_WITH_HPU,
} from '@fixtures/private/delivery/accept-screen/accept-screen-event-properties.fixtures.spec';
import { AcceptScreenTrackingEventsService } from './accept-screen-tracking-events.service';

describe('AcceptScreenTrackingEventsService', () => {
  let service: AcceptScreenTrackingEventsService;
  let analyticsService: AnalyticsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: AnalyticsService, useClass: MockAnalyticsService }],
    });
    service = TestBed.inject(AcceptScreenTrackingEventsService);
    analyticsService = TestBed.inject(AnalyticsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('and we call to track view accept offer event', () => {
    beforeEach(() => {
      spyOn(analyticsService, 'trackPageView');
      service.trackViewAcceptOffer(MOCK_VIEW_ACCEPT_OFFER_EVENT_PROPERTIES_WITH_HPU);
    });

    it('should track the event', () => {
      expect(analyticsService.trackPageView).toHaveBeenCalledTimes(1);
    });

    it('should track the event with specified properties', () => {
      expect(analyticsService.trackPageView).toHaveBeenCalledWith({
        name: ANALYTICS_EVENT_NAMES.ViewAcceptOffer,
        attributes: MOCK_VIEW_ACCEPT_OFFER_EVENT_PROPERTIES_WITH_HPU,
      });
    });
  });

  describe('and we call to track click item card event', () => {
    beforeEach(() => {
      spyOn(analyticsService, 'trackEvent');
      service.trackClickItemCard(MOCK_CLICK_ITEM_CARD_EVENT_PROPERTIES);
    });

    it('should track the event', () => {
      expect(analyticsService.trackEvent).toHaveBeenCalledTimes(1);
    });

    it('should track the event with specified properties with shipping allowed', () => {
      expect(analyticsService.trackEvent).toHaveBeenCalledWith({
        name: ANALYTICS_EVENT_NAMES.ClickItemCard,
        eventType: ANALYTIC_EVENT_TYPES.Navigation,
        attributes: MOCK_CLICK_ITEM_CARD_EVENT_PROPERTIES,
      });
    });
  });

  describe('and we call to track click other profile event', () => {
    beforeEach(() => {
      spyOn(analyticsService, 'trackEvent');
      service.trackClickOtherProfile(MOCK_CLICK_OTHER_PROFILE_EVENT_PROPERTIES);
    });

    it('should track the event', () => {
      expect(analyticsService.trackEvent).toHaveBeenCalledTimes(1);
    });

    it('should track the event with specified properties', () => {
      expect(analyticsService.trackEvent).toHaveBeenCalledWith({
        name: ANALYTICS_EVENT_NAMES.ClickOtherProfile,
        eventType: ANALYTIC_EVENT_TYPES.Navigation,
        attributes: MOCK_CLICK_OTHER_PROFILE_EVENT_PROPERTIES,
      });
    });
  });

  describe('and we call to track click accept offer event', () => {
    beforeEach(() => {
      spyOn(analyticsService, 'trackEvent');
      service.trackClickAcceptOffer(MOCK_CLICK_ACCEPT_OFFER_EVENT_PROPERTIES_WITH_HPU);
    });

    it('should track the event', () => {
      expect(analyticsService.trackEvent).toHaveBeenCalledTimes(1);
    });

    it('should track the event with specified properties', () => {
      expect(analyticsService.trackEvent).toHaveBeenCalledWith({
        name: ANALYTICS_EVENT_NAMES.ClickAcceptOffer,
        eventType: ANALYTIC_EVENT_TYPES.Navigation,
        attributes: MOCK_CLICK_ACCEPT_OFFER_EVENT_PROPERTIES_WITH_HPU,
      });
    });
  });

  describe('and we call to track click reject offer event', () => {
    beforeEach(() => {
      spyOn(analyticsService, 'trackEvent');
      service.trackClickRejectOffer(MOCK_CLICK_REJECT_OFFER_EVENT_PROPERTIES_WITH_HPU);
    });

    it('should track the event', () => {
      expect(analyticsService.trackEvent).toHaveBeenCalledTimes(1);
    });

    it('should track the event with specified properties', () => {
      expect(analyticsService.trackEvent).toHaveBeenCalledWith({
        name: ANALYTICS_EVENT_NAMES.ClickRejectOffer,
        eventType: ANALYTIC_EVENT_TYPES.Navigation,
        attributes: MOCK_CLICK_REJECT_OFFER_EVENT_PROPERTIES_WITH_HPU,
      });
    });
  });

  describe('and we call to track click add edit address event', () => {
    beforeEach(() => {
      spyOn(analyticsService, 'trackEvent');
      service.trackClickAddEditAddress(MOCK_CLICK_ADD_EDIT_ADDRESS_EVENT_PROPERTIES_WITH_FULL_ADDRESS_AND_PO);
    });

    it('should track the event', () => {
      expect(analyticsService.trackEvent).toHaveBeenCalledTimes(1);
    });

    it('should track the event with specified properties', () => {
      expect(analyticsService.trackEvent).toHaveBeenCalledWith({
        name: ANALYTICS_EVENT_NAMES.ClickAddEditAddress,
        eventType: ANALYTIC_EVENT_TYPES.Navigation,
        attributes: MOCK_CLICK_ADD_EDIT_ADDRESS_EVENT_PROPERTIES_WITH_FULL_ADDRESS_AND_PO,
      });
    });
  });

  describe('and we call to track click help transactional event', () => {
    beforeEach(() => {
      spyOn(analyticsService, 'trackEvent');
      service.trackClickHelpTransactional(MOCK_CLICK_HELP_TRANSACTIONAL_EVENT_PROPERTIES);
    });

    it('should track the event', () => {
      expect(analyticsService.trackEvent).toHaveBeenCalledTimes(1);
    });

    it('should track the event with specified properties', () => {
      expect(analyticsService.trackEvent).toHaveBeenCalledWith({
        name: ANALYTICS_EVENT_NAMES.ClickHelpTransactional,
        eventType: ANALYTIC_EVENT_TYPES.Navigation,
        attributes: MOCK_CLICK_HELP_TRANSACTIONAL_EVENT_PROPERTIES,
      });
    });
  });

  describe('and we call to track click schedule HPU event', () => {
    beforeEach(() => {
      spyOn(analyticsService, 'trackEvent');
      service.trackClickScheduleHPU(MOCK_CLICK_SCHEDULE_HPU_EVENT_PROPERTIES);
    });

    it('should track the event', () => {
      expect(analyticsService.trackEvent).toHaveBeenCalledTimes(1);
    });

    it('should track the event with specified properties', () => {
      expect(analyticsService.trackEvent).toHaveBeenCalledWith({
        name: ANALYTICS_EVENT_NAMES.ClickScheduleHPU,
        eventType: ANALYTIC_EVENT_TYPES.UserPreference,
        attributes: MOCK_CLICK_SCHEDULE_HPU_EVENT_PROPERTIES,
      });
    });
  });
});
