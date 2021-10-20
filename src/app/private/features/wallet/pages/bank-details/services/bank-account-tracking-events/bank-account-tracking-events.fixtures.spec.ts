import { KYCProperties } from '@api/core/model/kyc-properties/interfaces/kyc-properties.interface';
import { InnerType } from '@api/core/utils/types';
import { ClickAddEditBankAccount } from '@core/analytics/analytics-constants';
import {
  MOCK_KYC_ERROR_PROPERTIES,
  MOCK_KYC_NO_NEED_PROPERTIES,
  MOCK_KYC_PENDING_PROPERTIES,
  MOCK_KYC_PENDING_VERIFICATION_PROPERTIES,
  MOCK_KYC_VERIFIED_PROPERTIES,
} from '@fixtures/private/wallet/kyc/kyc-properties.fixtures.spec';

export type BankAccountTrackingEventTestCase = {
  isEdit: boolean;
  kycProperties: KYCProperties;
  mappedAddOrEditToAnalytics: InnerType<ClickAddEditBankAccount, 'addOrEdit'>;
  mappedBannerStatusToAnalytics?: InnerType<ClickAddEditBankAccount, 'kycStatus'>;
};

export const MOCK_ADD_BANK_ACCOUNT_TRACKING_EVENT_CASES: BankAccountTrackingEventTestCase[] = [
  {
    isEdit: false,
    kycProperties: MOCK_KYC_PENDING_PROPERTIES,
    mappedAddOrEditToAnalytics: 'add',
    mappedBannerStatusToAnalytics: 'pending',
  },
  {
    isEdit: false,
    kycProperties: MOCK_KYC_PENDING_VERIFICATION_PROPERTIES,
    mappedAddOrEditToAnalytics: 'add',
    mappedBannerStatusToAnalytics: 'inProgress',
  },
  {
    isEdit: false,
    kycProperties: MOCK_KYC_VERIFIED_PROPERTIES,
    mappedAddOrEditToAnalytics: 'add',
    mappedBannerStatusToAnalytics: 'verified',
  },
  {
    isEdit: false,
    kycProperties: MOCK_KYC_NO_NEED_PROPERTIES,
    mappedAddOrEditToAnalytics: 'add',
    mappedBannerStatusToAnalytics: 'verified',
  },
  {
    isEdit: false,
    kycProperties: MOCK_KYC_ERROR_PROPERTIES,
    mappedAddOrEditToAnalytics: 'add',
    mappedBannerStatusToAnalytics: 'pending',
  },
];

export const MOCK_EDIT_BANK_ACCOUNT_TRACKING_EVENT_CASES: BankAccountTrackingEventTestCase[] = [
  {
    isEdit: true,
    kycProperties: MOCK_KYC_PENDING_PROPERTIES,
    mappedAddOrEditToAnalytics: 'edit',
    mappedBannerStatusToAnalytics: 'pending',
  },
  {
    isEdit: true,
    kycProperties: MOCK_KYC_PENDING_VERIFICATION_PROPERTIES,
    mappedAddOrEditToAnalytics: 'edit',
    mappedBannerStatusToAnalytics: 'inProgress',
  },
  {
    isEdit: true,
    kycProperties: MOCK_KYC_VERIFIED_PROPERTIES,
    mappedAddOrEditToAnalytics: 'edit',
    mappedBannerStatusToAnalytics: 'verified',
  },
  {
    isEdit: true,
    kycProperties: MOCK_KYC_NO_NEED_PROPERTIES,
    mappedAddOrEditToAnalytics: 'edit',
    mappedBannerStatusToAnalytics: 'verified',
  },
  {
    isEdit: true,
    kycProperties: MOCK_KYC_ERROR_PROPERTIES,
    mappedAddOrEditToAnalytics: 'edit',
    mappedBannerStatusToAnalytics: 'pending',
  },
];

export const MOCK_BANK_ACCOUNT_TRACKING_EVENTS_CASES: BankAccountTrackingEventTestCase[] = [
  ...MOCK_ADD_BANK_ACCOUNT_TRACKING_EVENT_CASES,
  ...MOCK_EDIT_BANK_ACCOUNT_TRACKING_EVENT_CASES,
];
