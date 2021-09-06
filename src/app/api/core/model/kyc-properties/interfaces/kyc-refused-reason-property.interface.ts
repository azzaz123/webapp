import { KYC_REFUSED_REASON } from '../kyc-refused-reason.enum';

export interface KYCRefusedReasonProperty {
  reason: KYC_REFUSED_REASON;
  translation: string;
}
