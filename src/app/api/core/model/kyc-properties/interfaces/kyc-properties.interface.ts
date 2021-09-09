import { KYC_FLOW_STATUS } from '../kyc-flow-status.enum';
import { KYC_STATUS } from '../kyc-status.enum';
import { KYCRefusedReasonProperty } from './kyc-refused-reason-property.interface';

export interface KYCProperties {
  status: KYC_STATUS;
  refusedReason: KYCRefusedReasonProperty | null;
  inflowStatus: KYC_FLOW_STATUS;
  outflowStatus: KYC_FLOW_STATUS;
}
