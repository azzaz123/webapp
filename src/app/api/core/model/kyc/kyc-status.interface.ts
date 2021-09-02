import { KYC_REFUSED_REASON } from '@api/payments/kyc/mappers/responses/kyc-refused-reason.enum';
import { KYC_STATUS } from './kyc-status.enum';

export interface KYCStatus {
  status: KYC_STATUS;
  refusedReason: KYC_REFUSED_REASON;
  documentId: string;
  mangopayUserId: string;
}
