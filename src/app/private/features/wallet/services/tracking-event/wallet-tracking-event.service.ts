import { Injectable } from '@angular/core';

import {
  AnalyticsEvent,
  ANALYTICS_EVENT_NAMES,
  ANALYTIC_EVENT_TYPES,
  ClickBankDetails,
  ClickHelpWallet,
  SCREEN_IDS,
} from '@core/analytics/analytics-constants';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { InnerType } from '@api/core/utils/types';
import { KYC_STATUS } from '@api/core/model/kyc-properties/kyc-status.enum';
import { KYCProperties } from '@api/core/model/kyc-properties/interfaces/kyc-properties.interface';
import { KYCPropertiesService } from '@api/payments/kyc-properties/kyc-properties.service';

import { take } from 'rxjs/operators';

const kycBannerStatusToEventAttribute: Partial<Record<KYC_STATUS, KycStatusEventAttribute>> = {
  [KYC_STATUS.NO_NEED]: 'verified',
  [KYC_STATUS.PENDING]: 'pending',
  [KYC_STATUS.PENDING_VERIFICATION]: 'inProgress',
  [KYC_STATUS.REJECTED]: 'pending',
  [KYC_STATUS.VERIFIED]: 'verified',
};
type KycStatusEventAttribute = InnerType<ClickBankDetails, 'kycStatus'> | undefined;

@Injectable()
export class WalletTrackingEventService {
  constructor(private analyticsService: AnalyticsService, private kycPropertiesService: KYCPropertiesService) {}

  public trackClickBankDetails(): void {
    this.kycPropertiesService.KYCProperties$.pipe(take(1)).subscribe((kycProperties: KYCProperties) => {
      const { status } = kycProperties;
      const kycStatus = this.mapKycBannerStatusToEventAttribute(status);
      const event = this.generateClickBankDetailsEvent(kycStatus);

      this.analyticsService.trackEvent(event);
    });
  }

  public trackClickHelpWallet(): void {
    const event: AnalyticsEvent<ClickHelpWallet> = {
      name: ANALYTICS_EVENT_NAMES.ClickHelpWallet,
      eventType: ANALYTIC_EVENT_TYPES.Navigation,
      attributes: {
        screenId: SCREEN_IDS.MyWallet,
      },
    };
    this.analyticsService.trackEvent(event);
  }

  private generateClickBankDetailsEvent(kycStatus?: KycStatusEventAttribute): AnalyticsEvent<ClickBankDetails> {
    const event: AnalyticsEvent<ClickBankDetails> = {
      name: ANALYTICS_EVENT_NAMES.ClickBankDetails,
      eventType: ANALYTIC_EVENT_TYPES.Navigation,
      attributes: {
        screenId: SCREEN_IDS.MyWallet,
        kycStatus,
      },
    };
    return event;
  }

  private mapKycBannerStatusToEventAttribute(kycStatus: KYC_STATUS): KycStatusEventAttribute {
    return kycBannerStatusToEventAttribute[kycStatus];
  }
}
