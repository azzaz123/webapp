import { Injectable } from '@angular/core';

import {
  AnalyticsEvent,
  ANALYTICS_EVENT_NAMES,
  ANALYTIC_EVENT_TYPES,
  ConfirmTransferBankAccount,
  SCREEN_IDS,
  SelectTransferAmount,
} from '@core/analytics/analytics-constants';
import { AnalyticsService } from '@core/analytics/analytics.service';

@Injectable()
export class WalletTransferTrackingEventService {
  constructor(private analyticsService: AnalyticsService) {}

  public trackConfirmTransferBankAccount(balance: number, amount: number): void {
    const event: AnalyticsEvent<ConfirmTransferBankAccount> = {
      name: ANALYTICS_EVENT_NAMES.ConfirmTransferBankAccount,
      eventType: ANALYTIC_EVENT_TYPES.Transaction,
      attributes: {
        screenId: SCREEN_IDS.BankTransferConfirm,
        balanceAmount: balance,
        transferAmount: amount,
      },
    };
    this.analyticsService.trackEvent(event);
  }

  public trackSelectTransferAmount(balance: number, amount: number): void {
    const event: AnalyticsEvent<SelectTransferAmount> = {
      name: ANALYTICS_EVENT_NAMES.SelectTransferAmount,
      eventType: ANALYTIC_EVENT_TYPES.UserPreference,
      attributes: {
        screenId: SCREEN_IDS.BankTransferAmount,
        balanceAmount: balance,
        transferAmount: amount,
      },
    };
    this.analyticsService.trackEvent(event);
  }
}
