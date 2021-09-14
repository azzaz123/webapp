import { KYC_STATUS } from '@api/core/model/kyc-properties/kyc-status.enum';
import { InnerType } from '@api/core/utils/types';
import { ClickAddEditBankAccount } from '@core/analytics/analytics-constants';

export type BankAccountTrackingEventTestCase = {
  isEdit: boolean;
  kycBannerStatus: KYC_STATUS;
  mappedAddOrEditToAnalytics: InnerType<ClickAddEditBankAccount, 'addOrEdit'>;
  mappedBannerStatusToAnalytics?: InnerType<ClickAddEditBankAccount, 'kycStatus'>;
};

export const MOCK_ADD_BANK_ACCOUNT_TRACKING_EVENT_CASES: BankAccountTrackingEventTestCase[] = [
  {
    isEdit: false,
    kycBannerStatus: KYC_STATUS.PENDING,
    mappedAddOrEditToAnalytics: 'add',
    mappedBannerStatusToAnalytics: 'pending',
  },
  {
    isEdit: false,
    kycBannerStatus: KYC_STATUS.PENDING_VERIFICATION,
    mappedAddOrEditToAnalytics: 'add',
    mappedBannerStatusToAnalytics: 'inProgress',
  },
  {
    isEdit: false,
    kycBannerStatus: KYC_STATUS.VERIFIED,
    mappedAddOrEditToAnalytics: 'add',
    mappedBannerStatusToAnalytics: 'verified',
  },
  {
    isEdit: false,
    kycBannerStatus: KYC_STATUS.NO_NEED,
    mappedAddOrEditToAnalytics: 'add',
  },
  {
    isEdit: false,
    kycBannerStatus: KYC_STATUS.REJECTED,
    mappedAddOrEditToAnalytics: 'add',
  },
];

export const MOCK_EDIT_BANK_ACCOUNT_TRACKING_EVENT_CASES: BankAccountTrackingEventTestCase[] = [
  {
    isEdit: true,
    kycBannerStatus: KYC_STATUS.PENDING,
    mappedAddOrEditToAnalytics: 'edit',
    mappedBannerStatusToAnalytics: 'pending',
  },
  {
    isEdit: true,
    kycBannerStatus: KYC_STATUS.PENDING_VERIFICATION,
    mappedAddOrEditToAnalytics: 'edit',
    mappedBannerStatusToAnalytics: 'inProgress',
  },
  {
    isEdit: true,
    kycBannerStatus: KYC_STATUS.VERIFIED,
    mappedAddOrEditToAnalytics: 'edit',
    mappedBannerStatusToAnalytics: 'verified',
  },
  {
    isEdit: true,
    kycBannerStatus: KYC_STATUS.NO_NEED,
    mappedAddOrEditToAnalytics: 'edit',
  },
  {
    isEdit: true,
    kycBannerStatus: KYC_STATUS.REJECTED,
    mappedAddOrEditToAnalytics: 'edit',
  },
];

export const MOCK_BANK_ACCOUNT_TRACKING_EVENTS_CASES: BankAccountTrackingEventTestCase[] = [
  ...MOCK_ADD_BANK_ACCOUNT_TRACKING_EVENT_CASES,
  ...MOCK_EDIT_BANK_ACCOUNT_TRACKING_EVENT_CASES,
];