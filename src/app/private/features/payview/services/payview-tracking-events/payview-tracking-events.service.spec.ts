import { TestBed } from '@angular/core/testing';

import { PayviewTrackingEventsService } from './payview-tracking-events.service';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MockAnalyticsService } from '@fixtures/analytics.fixtures.spec';
import {
  MOCK_VIEW_TRANSACTION_PAY_SCREEN_EVENT_PROPERTIES_WITH_CREDIT_CARD,
  MOCK_ADD_EDIT_CARD_EVENT_WITH_ADD_ACTION,
  MOCK_CLICK_HELP_TRANSACTIONAL_EVENT_PROPERTIES,
  MOCK_CLICK_ADD_PROMOCODE_TRANSACTION_PAY,
  MOCK_CLICK_APPLY_PROMOCODE_TRANSACTION_PAY,
  MOCK_PAY_TRANSACTION_EVENT_WITH_CREDIT_CARD,
  MOCK_TRANSACTION_PAYMENT_SUCCESS_WITH_CREDIT_CARD,
  MOCK_TRANSACTION_PAYMENT_ERROR_WITH_CANCEL_PAYMENT,
  MOCK_CLICK_ADD_EDIT_ADDRESS_EVENT,
} from '@fixtures/private/delivery/payview/payview-event-properties.fixtures.spec';
import { ANALYTICS_EVENT_NAMES } from '@core/analytics/resources/analytics-event-names';
import { ANALYTIC_EVENT_TYPES } from '@core/analytics/analytics-constants';

describe('PayviewTrackingEventsService', () => {
  let service: PayviewTrackingEventsService;
  let analyticsService: AnalyticsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: AnalyticsService, useClass: MockAnalyticsService }],
    });
    service = TestBed.inject(PayviewTrackingEventsService);
    analyticsService = TestBed.inject(AnalyticsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('and we call to track view transaction pay screen event', () => {
    beforeEach(() => {
      spyOn(analyticsService, 'trackPageView');
      service.trackViewTransactionPayScreen(MOCK_VIEW_TRANSACTION_PAY_SCREEN_EVENT_PROPERTIES_WITH_CREDIT_CARD);
    });

    it('should track the event', () => {
      expect(analyticsService.trackPageView).toHaveBeenCalledTimes(1);
    });

    it('should track the event with specified properties', () => {
      expect(analyticsService.trackPageView).toHaveBeenCalledWith({
        name: ANALYTICS_EVENT_NAMES.ViewTransactionPayScreen,
        attributes: MOCK_VIEW_TRANSACTION_PAY_SCREEN_EVENT_PROPERTIES_WITH_CREDIT_CARD,
      });
    });
  });

  describe('and we call to track click add edit card event', () => {
    beforeEach(() => {
      spyOn(analyticsService, 'trackEvent');
      service.trackClickAddEditCard(MOCK_ADD_EDIT_CARD_EVENT_WITH_ADD_ACTION);
    });

    it('should track the event', () => {
      expect(analyticsService.trackEvent).toHaveBeenCalledTimes(1);
    });

    it('should track the event with specified properties', () => {
      expect(analyticsService.trackEvent).toHaveBeenCalledWith({
        name: ANALYTICS_EVENT_NAMES.ClickAddEditCard,
        eventType: ANALYTIC_EVENT_TYPES.Navigation,
        attributes: MOCK_ADD_EDIT_CARD_EVENT_WITH_ADD_ACTION,
      });
    });
  });

  describe('and we call to track click add edit address event', () => {
    beforeEach(() => {
      spyOn(analyticsService, 'trackEvent');
      service.trackClickAddEditAddress(MOCK_CLICK_ADD_EDIT_ADDRESS_EVENT);
    });

    it('should track the event', () => {
      expect(analyticsService.trackEvent).toHaveBeenCalledTimes(1);
    });

    it('should track the event with specified properties', () => {
      expect(analyticsService.trackEvent).toHaveBeenCalledWith({
        name: ANALYTICS_EVENT_NAMES.ClickAddEditAddress,
        eventType: ANALYTIC_EVENT_TYPES.Navigation,
        attributes: MOCK_CLICK_ADD_EDIT_ADDRESS_EVENT,
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

  describe('and we call to track click add promocode transaction pay event', () => {
    beforeEach(() => {
      spyOn(analyticsService, 'trackEvent');
      service.trackClickAddPromocodeTransactionPay(MOCK_CLICK_ADD_PROMOCODE_TRANSACTION_PAY);
    });

    it('should track the event', () => {
      expect(analyticsService.trackEvent).toHaveBeenCalledTimes(1);
    });

    it('should track the event with specified properties', () => {
      expect(analyticsService.trackEvent).toHaveBeenCalledWith({
        name: ANALYTICS_EVENT_NAMES.ClickAddPromocodeTransactionPay,
        eventType: ANALYTIC_EVENT_TYPES.UserPreference,
        attributes: MOCK_CLICK_ADD_PROMOCODE_TRANSACTION_PAY,
      });
    });
  });

  describe('and we call to track click apply promocode transaction pay event', () => {
    beforeEach(() => {
      spyOn(analyticsService, 'trackEvent');
      service.trackClickApplyPromocodeTransactionPay(MOCK_CLICK_APPLY_PROMOCODE_TRANSACTION_PAY);
    });

    it('should track the event', () => {
      expect(analyticsService.trackEvent).toHaveBeenCalledTimes(1);
    });

    it('should track the event with specified properties', () => {
      expect(analyticsService.trackEvent).toHaveBeenCalledWith({
        name: ANALYTICS_EVENT_NAMES.ClickApplyPromocodeTransactionPay,
        eventType: ANALYTIC_EVENT_TYPES.UserPreference,
        attributes: MOCK_CLICK_APPLY_PROMOCODE_TRANSACTION_PAY,
      });
    });
  });

  describe('and we call to track pay transaction event', () => {
    beforeEach(() => {
      spyOn(analyticsService, 'trackEvent');
      service.trackPayTransaction(MOCK_PAY_TRANSACTION_EVENT_WITH_CREDIT_CARD);
    });

    it('should track the event', () => {
      expect(analyticsService.trackEvent).toHaveBeenCalledTimes(1);
    });

    it('should track the event with specified properties', () => {
      expect(analyticsService.trackEvent).toHaveBeenCalledWith({
        name: ANALYTICS_EVENT_NAMES.PayTransaction,
        eventType: ANALYTIC_EVENT_TYPES.Transaction,
        attributes: MOCK_PAY_TRANSACTION_EVENT_WITH_CREDIT_CARD,
      });
    });
  });

  describe('and we call to track transaction payment success event', () => {
    beforeEach(() => {
      spyOn(analyticsService, 'trackEvent');
      service.trackTransactionPaymentSuccess(MOCK_TRANSACTION_PAYMENT_SUCCESS_WITH_CREDIT_CARD);
    });

    it('should track the event', () => {
      expect(analyticsService.trackEvent).toHaveBeenCalledTimes(1);
    });

    it('should track the event with specified properties', () => {
      expect(analyticsService.trackEvent).toHaveBeenCalledWith({
        name: ANALYTICS_EVENT_NAMES.TransactionPaymentSuccess,
        eventType: ANALYTIC_EVENT_TYPES.Transaction,
        attributes: MOCK_TRANSACTION_PAYMENT_SUCCESS_WITH_CREDIT_CARD,
      });
    });
  });

  describe('and we call to track transaction payment error event', () => {
    beforeEach(() => {
      spyOn(analyticsService, 'trackEvent');
      service.trackTransactionPaymentError(MOCK_TRANSACTION_PAYMENT_ERROR_WITH_CANCEL_PAYMENT);
    });

    it('should track the event', () => {
      expect(analyticsService.trackEvent).toHaveBeenCalledTimes(1);
    });

    it('should track the event with specified properties', () => {
      expect(analyticsService.trackEvent).toHaveBeenCalledWith({
        name: ANALYTICS_EVENT_NAMES.TransactionPaymentError,
        eventType: ANALYTIC_EVENT_TYPES.Transaction,
        attributes: MOCK_TRANSACTION_PAYMENT_ERROR_WITH_CANCEL_PAYMENT,
      });
    });
  });
});
