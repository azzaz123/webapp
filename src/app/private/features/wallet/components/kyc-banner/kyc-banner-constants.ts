import { KYCBannerInterface, STATUS_KYC_BANNER_TYPES } from '../../interfaces/kyc/kyc-banner.interface';

export const KYC_BANNER_TYPES: KYCBannerInterface[] = [
  {
    status: STATUS_KYC_BANNER_TYPES.PENDING,
    svgPath: 'src/assets/icons/wallet/kyc/banner/error.svg',
    description: $localize`:@@view_agnostic_kyc_verification_pending_banner_title:Verify your identity to get paid for your sales`,
    buttonText: $localize`:@@view_agnostic_kyc_verification_pending_banner_button:Verify`,
    type: 'danger',
    dismissible: false,
  },
  {
    status: STATUS_KYC_BANNER_TYPES.PENDING_VERIFICATION,
    svgPath: 'src/assets/icons/wallet/kyc/banner/info.svg',
    description: $localize`:@@view_agnostic_kyc_verification_in_progress_banner_title:Identity verification in process`,
    buttonText: $localize`:@@view_agnostic_kyc_verification_in_progress_banner_button:Details`,
    type: 'warning',
    dismissible: false,
  },
  {
    status: STATUS_KYC_BANNER_TYPES.VERIFIED,
    svgPath: 'src/assets/icons/wallet/kyc/banner/info.svg',
    description: $localize`:@@view_agnostic_kyc_verification_succeeded_banner_title:Identity verification has been successful!`,
    buttonText: $localize`:@@view_agnostic_kyc_verification_succeeded_banner_button:Details`,
    type: 'success',
    dismissible: false,
  },
  {
    status: STATUS_KYC_BANNER_TYPES.REJECTED,
    svgPath: 'src/assets/icons/wallet/kyc/banner/error.svg',
    description: $localize`:@@view_agnostic_kyc_verification_error_banner_title:There was a problem with your identity verification`,
    buttonText: $localize`:@@view_agnostic_kyc_verification_error_banner_button:Retry`,
    type: 'danger',
    dismissible: false,
  },
];
