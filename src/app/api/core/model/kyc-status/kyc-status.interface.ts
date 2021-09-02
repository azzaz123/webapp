import { KYC_REFUSED_REASON } from './kyc-refused-reason.enum';
import { KYC_STATUS_STATES } from './kyc-status-states.enum';

export interface KYCStatus {
  status: KYC_STATUS_STATES;
  refusedReason: KYC_REFUSED_REASON;
  documentId: string;
  mangopayUserId: string;
}
