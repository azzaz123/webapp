import { AnalyticsPageView, ANALYTICS_EVENT_NAMES, SCREEN_IDS, ViewWallet } from '@core/analytics/analytics-constants';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { Injectable } from '@angular/core';
import { InnerType } from '@api/core/utils/types';
import { KYC_STATUS } from '@api/core/model/kyc-properties/kyc-status.enum';

const kycBannerStatusToEventAttribute: Partial<Record<KYC_STATUS, KycStatusEventAttribute>> = {
  [KYC_STATUS.PENDING]: 'pending',
  [KYC_STATUS.PENDING_VERIFICATION]: 'inProgress',
  [KYC_STATUS.VERIFIED]: 'verified',
};
type KycStatusEventAttribute = InnerType<ViewWallet, 'kycStatus'> | undefined;

@Injectable()
export class WalletBalanceTrackingEventService {
  constructor(private analyticsService: AnalyticsService) {}

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
