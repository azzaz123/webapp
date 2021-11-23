import { KYC_BANNER_TYPES } from '@api/core/model/kyc-properties/constants/kyc-banner-constants';
import { KYCBannerSpecifications } from '@api/core/model/kyc-properties/interfaces/kyc-banner-specifications.interface';
import { KYC_MODAL_STATUS_PROPERTIES } from '@private/features/wallet/modals/kyc/constants/kyc-modal-status-constants';
import { KYC_MODAL_STATUS } from '@private/features/wallet/modals/kyc/enums/kyc-modal-status.enum';
import { KYCModalProperties } from '@private/features/wallet/modals/kyc/interfaces/kyc-modal-properties.interface';

export const MOCK_KYC_BANNER_PENDING: KYCBannerSpecifications = KYC_BANNER_TYPES[0];
export const MOCK_KYC_BANNER_PENDING_VERIFICATION: KYCBannerSpecifications = KYC_BANNER_TYPES[1];
export const MOCK_KYC_BANNER_VERIFIED: KYCBannerSpecifications = KYC_BANNER_TYPES[2];
export const MOCK_KYC_BANNER_REJECTED: KYCBannerSpecifications = KYC_BANNER_TYPES[3];

export const MOCK_IN_PROGRESS_BANNER_PROPERTIES: KYCModalProperties = KYC_MODAL_STATUS_PROPERTIES.find(
  (property) => property.status === KYC_MODAL_STATUS.IN_PROGRESS
);
export const MOCK_SUCCEED_BANNER_PROPERTIES: KYCModalProperties = KYC_MODAL_STATUS_PROPERTIES.find(
  (property) => property.status === KYC_MODAL_STATUS.SUCCEED
);
export const MOCK_ERROR_BANNER_PROPERTIES: KYCModalProperties = KYC_MODAL_STATUS_PROPERTIES.find(
  (property) => property.status === KYC_MODAL_STATUS.ERROR
);
