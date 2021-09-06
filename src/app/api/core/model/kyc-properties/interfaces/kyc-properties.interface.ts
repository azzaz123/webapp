import { KYC_STATUS } from '../kyc-status.enum';
import { KYCRefusedReasonProperty } from './kyc-refused-reason-property.interface';

export interface KYCProperties {
  status: KYC_STATUS;
  refusedReason: KYCRefusedReasonProperty | null;
  documentId: string;
  mangopayUserId: string;
}
