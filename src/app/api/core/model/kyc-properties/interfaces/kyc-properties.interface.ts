import { KYC_FLOW_STATUS } from '../kyc-flow-status.enum';
import { KYC_STATUS } from '../kyc-status.enum';
import { KYCRefusedReason } from './kyc-refused-reason.interface';

export interface KYCProperties {
  status: KYC_STATUS;
  refusedReason: KYCRefusedReason | null;
  inflowStatus: KYC_FLOW_STATUS;
  outflowStatus: KYC_FLOW_STATUS;
}
