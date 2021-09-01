import { Injectable } from '@angular/core';
import { InnerType } from '@api/core/utils/types';
import {
  AnalyticsEvent,
  ANALYTICS_EVENT_NAMES,
  ANALYTIC_EVENT_TYPES,
  ClickAddEditBankAccount,
  SCREEN_IDS,
} from '@core/analytics/analytics-constants';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { KYCBanner, KYC_BANNER_STATUS } from '@private/features/wallet/interfaces/kyc/kyc-banner.interface';
import { KYCBannerApiService } from '@private/features/wallet/services/api/kyc-banner-api.service';

type KycStatusEventAttribute = InnerType<ClickAddEditBankAccount, 'kycStatus'> | undefined;
type AddOrEditEventAttribute = InnerType<ClickAddEditBankAccount, 'addOrEdit'>;

@Injectable({
  providedIn: 'root',
})
export class BankAccountTrackingEventsService {
  constructor(private analyticsService: AnalyticsService, private kYCBannerApiService: KYCBannerApiService) {}

  public trackClickAddEditBankAccount(isEdit: boolean): void {
    this.kYCBannerApiService.getKYCBanner().subscribe((kycBanner: KYCBanner) => {
      const { status } = kycBanner;
      const addOrEdit = this.mapAddOrEditAttribute(isEdit);
      const kycStatus = this.mapKycBannerStatusToEventAttribute(status);
      const event = this.generateAddEditBankAccountEvent(addOrEdit, kycStatus);

      this.analyticsService.trackEvent(event);
    });
  }

  private generateAddEditBankAccountEvent(
    addOrEdit: AddOrEditEventAttribute,
    kycStatus?: KycStatusEventAttribute
  ): AnalyticsEvent<ClickAddEditBankAccount> {
    const event: AnalyticsEvent<ClickAddEditBankAccount> = {
      name: ANALYTICS_EVENT_NAMES.ClickAddEditBankAccount,
      eventType: ANALYTIC_EVENT_TYPES.Other,
      attributes: {
        screenId: SCREEN_IDS.MyBankDetails,
        addOrEdit,
        kycStatus,
      },
    };

    return event;
  }

  private mapKycBannerStatusToEventAttribute(kycStatus: KYC_BANNER_STATUS): KycStatusEventAttribute {
    if (kycStatus === KYC_BANNER_STATUS.PENDING) {
      return 'pending';
    }
    if (kycStatus === KYC_BANNER_STATUS.PENDING_VERIFICATION) {
      return 'inProgress';
    }
    if (kycStatus === KYC_BANNER_STATUS.VERIFIED) {
      return 'verified';
    }
    return;
  }

  private mapAddOrEditAttribute(isEdit: boolean): AddOrEditEventAttribute {
    return isEdit ? 'edit' : 'add';
  }
}
