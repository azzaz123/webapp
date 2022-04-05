import { Injectable } from '@angular/core';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { ViewTransactionPayScreen } from '@core/analytics/resources/events-interfaces/view-transaction-pay-screen.interface';
import { AnalyticsPageView, AnalyticsEvent, ANALYTIC_EVENT_TYPES } from '@core/analytics/analytics-constants';
import { ANALYTICS_EVENT_NAMES } from '@core/analytics/resources/analytics-event-names';
import { ClickAddEditCard } from '@core/analytics/resources/events-interfaces/click-add-edit-card.interface';
import { ClickAddEditAddress } from '@core/analytics/resources/events-interfaces/click-add-edit-address.interface';
import { ClickHelpTransactional } from '@core/analytics/resources/events-interfaces/click-help-transactional.interface';
import { ClickAddPromocodeTransactionPay } from '@core/analytics/resources/events-interfaces/click-add-promocode-transaction-pay.interface';
import { ClickApplyPromocodeTransactionPay } from '@core/analytics/resources/events-interfaces/click-apply-promocode-transaction-pay.interface';
import { PayTransaction } from '@core/analytics/resources/events-interfaces/pay-transaction.interface';
import { TransactionPaymentSuccess } from '@core/analytics/resources/events-interfaces/transaction-payment-success.interface';
import { TransactionCheckoutError } from '@core/analytics/resources/events-interfaces/transaction-checkout-error.interface';

@Injectable({
  providedIn: 'root',
})
export class PayviewTrackingEventsService {
  constructor(private analyticsService: AnalyticsService) {}

  public trackViewTransactionPayScreen(attributes: ViewTransactionPayScreen): void {
    const pageViewEvent: AnalyticsPageView<ViewTransactionPayScreen> = {
      name: ANALYTICS_EVENT_NAMES.ViewTransactionPayScreen,
      attributes,
    };

    this.analyticsService.trackPageView(pageViewEvent);
  }

  public trackClickAddEditCard(attributes: ClickAddEditCard): void {
    const event: AnalyticsEvent<ClickAddEditCard> = {
      name: ANALYTICS_EVENT_NAMES.ClickAddEditCard,
      eventType: ANALYTIC_EVENT_TYPES.Navigation,
      attributes,
    };

    this.analyticsService.trackEvent(event);
  }

  public trackClickAddEditAddress(attributes: ClickAddEditAddress): void {
    const event: AnalyticsEvent<ClickAddEditAddress> = {
      name: ANALYTICS_EVENT_NAMES.ClickAddEditAddress,
      eventType: ANALYTIC_EVENT_TYPES.Navigation,
      attributes,
    };

    this.analyticsService.trackEvent(event);
  }

  public trackClickHelpTransactional(attributes: ClickHelpTransactional): void {
    const event: AnalyticsEvent<ClickHelpTransactional> = {
      name: ANALYTICS_EVENT_NAMES.ClickHelpTransactional,
      eventType: ANALYTIC_EVENT_TYPES.Navigation,
      attributes,
    };

    this.analyticsService.trackEvent(event);
  }

  public trackClickAddPromocodeTransactionPay(attributes: ClickAddPromocodeTransactionPay): void {
    const event: AnalyticsEvent<ClickAddPromocodeTransactionPay> = {
      name: ANALYTICS_EVENT_NAMES.ClickAddPromocodeTransactionPay,
      eventType: ANALYTIC_EVENT_TYPES.UserPreference,
      attributes,
    };

    this.analyticsService.trackEvent(event);
  }

  public trackClickApplyPromocodeTransactionPay(attributes: ClickApplyPromocodeTransactionPay): void {
    const event: AnalyticsEvent<ClickApplyPromocodeTransactionPay> = {
      name: ANALYTICS_EVENT_NAMES.ClickApplyPromocodeTransactionPay,
      eventType: ANALYTIC_EVENT_TYPES.UserPreference,
      attributes,
    };

    this.analyticsService.trackEvent(event);
  }

  public trackPayTransaction(attributes: PayTransaction): void {
    const event: AnalyticsEvent<PayTransaction> = {
      name: ANALYTICS_EVENT_NAMES.PayTransaction,
      eventType: ANALYTIC_EVENT_TYPES.Transaction,
      attributes,
    };

    this.analyticsService.trackEvent(event);
  }

  public trackTransactionPaymentSuccess(attributes: TransactionPaymentSuccess): void {
    const event: AnalyticsEvent<TransactionPaymentSuccess> = {
      name: ANALYTICS_EVENT_NAMES.TransactionPaymentSuccess,
      eventType: ANALYTIC_EVENT_TYPES.Transaction,
      attributes,
    };

    this.analyticsService.trackEvent(event);
  }

  public trackTransactionPaymentError(attributes: TransactionCheckoutError): void {
    const event: AnalyticsEvent<TransactionCheckoutError> = {
      name: ANALYTICS_EVENT_NAMES.TransactionPaymentError,
      eventType: ANALYTIC_EVENT_TYPES.Transaction,
      attributes,
    };

    this.analyticsService.trackEvent(event);
  }
}
