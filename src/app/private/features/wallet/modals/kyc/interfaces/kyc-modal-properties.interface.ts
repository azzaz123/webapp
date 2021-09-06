import { KYC_MODAL_STATUS_TYPE } from '../enums/kyc-modal-status-type-enum';

export interface KYCModalProperties {
  status: KYC_MODAL_STATUS_TYPE;
  title: string;
  description?: string;
  svgPath: string;
  messageCTA: string;
  messageLink?: string;
  refusedMessage?: string;
}
