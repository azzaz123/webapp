import { Injectable } from '@angular/core';
import { KYCProperties } from '@api/core/model/kyc-properties/interfaces/kyc-properties.interface';
import { KYC_STATUS } from '@api/core/model/kyc-properties/kyc-status.enum';
import { InnerType } from '@api/core/utils/types';
import { KYCPropertiesService } from '@api/payments/kyc-properties/kyc-properties.service';
import {
  AnalyticsEvent,
  ANALYTICS_EVENT_NAMES,
  ANALYTIC_EVENT_TYPES,
  ClickAddEditBankAccount,
  SCREEN_IDS,
} from '@core/analytics/analytics-constants';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { take } from 'rxjs/operators';

type KycStatusEventAttribute = InnerType<ClickAddEditBankAccount, 'kycStatus'> | undefined;
type AddOrEditEventAttribute = InnerType<ClickAddEditBankAccount, 'addOrEdit'>;
const kycBannerStatusToEventAttribute: Partial<Record<KYC_STATUS, KycStatusEventAttribute>> = {
  [KYC_STATUS.PENDING]: 'pending',
  [KYC_STATUS.PENDING_VERIFICATION]: 'inProgress',
  [KYC_STATUS.VERIFIED]: 'verified',
};

@Injectable()
export class BankAccountTrackingEventsService {
  constructor(private analyticsService: AnalyticsService, private kycPropertiesService: KYCPropertiesService) {}

  public trackClickAddEditBankAccount(isEdit: boolean): void {
    this.kycPropertiesService.KYCProperties$.pipe(take(1)).subscribe((kycProperties: KYCProperties) => {
      const { status } = kycProperties;
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

  private mapKycBannerStatusToEventAttribute(kycStatus: KYC_STATUS): KycStatusEventAttribute {
    return kycBannerStatusToEventAttribute[kycStatus];
  }

  private mapAddOrEditAttribute(isEdit: boolean): AddOrEditEventAttribute {
    return isEdit ? 'edit' : 'add';
  }
}
