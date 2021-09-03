import { KYC_REFUSED_REASON } from './kyc-refused-reason.enum';
import { KYC_STATUS } from './kyc-status.enum';

export interface KYCProperties {
  status: KYC_STATUS;
  refusedReason: KYC_REFUSED_REASON | null;
  documentId: string;
  mangopayUserId: string;
}
