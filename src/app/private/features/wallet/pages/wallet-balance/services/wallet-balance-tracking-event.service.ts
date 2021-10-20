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
import { KYCProperties } from '@api/core/model/kyc-properties/interfaces/kyc-properties.interface';
import { KYCPropertiesService } from '@api/payments/kyc-properties/kyc-properties.service';
import { Money } from '@api/core/model/money.interface';
import { PaymentsWalletsService } from '@api/payments/wallets/payments-wallets.service';

import { finalize } from 'rxjs/operators';
import { forkJoin } from 'rxjs';

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
  constructor(
    private analyticsService: AnalyticsService,
    private paymentsWalletsService: PaymentsWalletsService,
    private kycPropertiesService: KYCPropertiesService
  ) {}

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

  public trackViewWallet(): void {
    let balance: number;
    let status: KYC_STATUS;

    forkJoin([this.paymentsWalletsService.walletBalance$, this.kycPropertiesService.KYCProperties$])
      .pipe(
        finalize(() => {
          const event: AnalyticsPageView<ViewWallet> = {
            name: ANALYTICS_EVENT_NAMES.ViewWallet,
            attributes: {
              screenId: SCREEN_IDS.MyWallet,
              kycStatus: this.mapKycBannerStatusToEventAttribute(status),
              balanceAmount: balance,
            },
          };
          this.analyticsService.trackPageView(event);
        })
      )
      .subscribe(([walletBalance, specifications]: [Money, KYCProperties]) => {
        balance = walletBalance?.amount.total;
        status = specifications.status;
      });
  }

  private mapKycBannerStatusToEventAttribute(kycStatus: KYC_STATUS): KycStatusEventAttribute {
    return kycBannerStatusToEventAttribute[kycStatus];
  }
}
