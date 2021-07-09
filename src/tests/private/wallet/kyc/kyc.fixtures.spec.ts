import { KYCBanner, KYC_BANNER_STATUS } from '@private/features/wallet/interfaces/kyc/kyc-banner.interface';

export const MOCK_KYC_BANNER_PENDING_VERIFICATION: KYCBanner = {
  status: KYC_BANNER_STATUS.PENDING_VERIFICATION,
};

export const MOCK_KYC_BANNER_PENDING: KYCBanner = {
  status: KYC_BANNER_STATUS.PENDING,
};

export const MOCK_KYC_BANNER_REJECTED: KYCBanner = {
  status: KYC_BANNER_STATUS.REJECTED,
};

export const MOCK_KYC_BANNER_VERIFIED: KYCBanner = {
  status: KYC_BANNER_STATUS.VERIFIED,
};

export const MOCK_KYC_BANNER_NO_NEED: KYCBanner = {
  status: KYC_BANNER_STATUS.NO_NEED,
};
