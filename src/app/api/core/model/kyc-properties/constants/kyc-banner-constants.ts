import { KYC_STATUS } from '@api/core/model/kyc-properties/kyc-status.enum';
import { BANNER_TYPES } from '@shared/banner/banner-types.enum';
import { KYCBannerSpecifications } from '../interfaces/kyc-banner-specifications.interface';

export const KYC_BANNER_TYPES: KYCBannerSpecifications[] = [
  {
    status: KYC_STATUS.PENDING,
    svgPath: '/assets/icons/wallet/kyc/banner/error.svg',
    description: $localize`:@@view_agnostic_kyc_verification_pending_banner_title:Verify your identity to get paid for your sales`,
    buttonText: $localize`:@@view_agnostic_kyc_verification_pending_banner_button:Verify`,
    type: BANNER_TYPES.DANGER,
    dismissible: false,
    isFullHeight: false,
  },
  {
    status: KYC_STATUS.PENDING_VERIFICATION,
    svgPath: '/assets/icons/wallet/kyc/banner/info.svg',
    description: $localize`:@@view_agnostic_kyc_verification_in_progress_banner_title:Identity verification in process`,
    buttonText: $localize`:@@view_agnostic_kyc_verification_in_progress_banner_button:Details`,
    type: BANNER_TYPES.WARNING,
    dismissible: false,
    isFullHeight: false,
  },
  {
    status: KYC_STATUS.VERIFIED,
    svgPath: '/assets/icons/wallet/kyc/banner/info.svg',
    description: $localize`:@@view_agnostic_kyc_verification_succeeded_banner_title:Identity verification has been successful!`,
    buttonText: $localize`:@@view_agnostic_kyc_verification_succeeded_banner_button:Details`,
    type: BANNER_TYPES.SUCCESS,
    dismissible: false,
    isFullHeight: false,
  },
  {
    status: KYC_STATUS.REJECTED,
    svgPath: '/assets/icons/wallet/kyc/banner/error.svg',
    description: $localize`:@@view_agnostic_kyc_verification_error_banner_title:There was a problem with your identity verification`,
    buttonText: $localize`:@@view_agnostic_kyc_verification_error_banner_button:Retry`,
    type: BANNER_TYPES.DANGER,
    dismissible: false,
    isFullHeight: false,
  },
];
