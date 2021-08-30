import { KYC_MODAL_STATUS_TYPE } from '../enums/kyc-modal-status-type-enum';

export interface KYCModalStatus {
  status: KYC_MODAL_STATUS_TYPE;
  title: string;
  description?: string;
  svgPath: string;
  messageCTA: string;
  link?: string;
}
