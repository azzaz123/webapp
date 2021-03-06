import { KYC_MODAL_STATUS } from '@private/features/wallet/modals/kyc/enums/kyc-modal-status.enum';
import { KYCModalProperties } from '../interfaces/kyc-modal-properties.interface';

export const KYC_MODAL_STATUS_PROPERTIES: KYCModalProperties[] = [
  {
    status: KYC_MODAL_STATUS.IN_PROGRESS,
    title: $localize`:@@kyc_documentation_sent_modal_title:Now what?`,
    description: $localize`:@@kyc_documentation_sent_modal_description:It takes us about 1 working day to respond. Once your identity is verified, the money will be available in your wallet.`,
    svgPath: '/assets/icons/wallet/kyc/status/kyc_verification_in_progress.svg',
    messageCTA: $localize`:@@kyc_documentation_sent_modal_ok_button:Understood`,
  },
  {
    status: KYC_MODAL_STATUS.SUCCEED,
    title: $localize`:@@kyc_identity_verified_modal_title:Your identity has already been verified. Congratulations!`,
    description: $localize`:@@kyc_identity_verified_modal_description:The money from the sale is now in your wallet. Hopefully the wait wasn't too long.`,
    svgPath: '/assets/icons/wallet/kyc/status/kyc_verification_succeed.svg',
    messageCTA: $localize`:@@kyc_identity_verified_modal_ok_button:Great`,
  },

  {
    status: KYC_MODAL_STATUS.ERROR,
    title: $localize`:@@kyc_failed_modal_title:We're sorry, we were unable to verify your identity.`,
    svgPath: '/assets/icons/wallet/kyc/status/kyc_verification_failed.svg',
    messageCTA: $localize`:@@kyc_failed_modal_retry_verification_button:Retry verification`,
    showZendeskLink: true,
  },
];
