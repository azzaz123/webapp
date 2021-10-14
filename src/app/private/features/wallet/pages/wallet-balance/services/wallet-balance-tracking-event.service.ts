import { Injectable } from '@angular/core';

import {
  AnalyticsEvent,
  AnalyticsPageView,
  ANALYTICS_EVENT_NAMES,
  ANALYTIC_EVENT_TYPES,
  ClickTransferBankAccount,
  SCREEN_IDS,
  ViewWallet,
} from '@core/analytics/analytics-constants';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { InnerType } from '@api/core/utils/types';
import { KYC_STATUS } from '@api/core/model/kyc-properties/kyc-status.enum';

const kycBannerStatusToEventAttribute: Partial<Record<KYC_STATUS, KycStatusEventAttribute>> = {
  [KYC_STATUS.NO_NEED]: 'verified',
  [KYC_STATUS.PENDING]: 'pending',
  [KYC_STATUS.PENDING_VERIFICATION]: 'inProgress',
  [KYC_STATUS.REJECTED]: 'pending',
  [KYC_STATUS.VERIFIED]: 'verified',
};
type KycStatusEventAttribute = InnerType<ViewWallet, 'kycStatus'> | undefined;

@Injectable()
export class WalletBalanceTrackingEventService {
  constructor(private analyticsService: AnalyticsService) {}

  public trackClickTransferBankAccount(balance: number): void {
    const event: AnalyticsEvent<ClickTransferBankAccount> = {
      name: ANALYTICS_EVENT_NAMES.ClickTransferBankAccount,
      eventType: ANALYTIC_EVENT_TYPES.Navigation,
      attributes: {
        screenId: SCREEN_IDS.MyWallet,
        balanceAmount: balance,
      },
    };
    this.analyticsService.trackEvent(event);
  }

  public trackViewWallet(balance: number, status: KYC_STATUS): void {
    const event: AnalyticsPageView<ViewWallet> = {
      name: ANALYTICS_EVENT_NAMES.ViewWallet,
      attributes: {
        screenId: SCREEN_IDS.MyWallet,
        kycStatus: this.mapKycBannerStatusToEventAttribute(status),
        balanceAmount: balance,
      },
    };
    this.analyticsService.trackPageView(event);
  }

  private mapKycBannerStatusToEventAttribute(kycStatus: KYC_STATUS): KycStatusEventAttribute {
    return kycBannerStatusToEventAttribute[kycStatus];
  }
}
