import { KYC_MODAL_STATUS } from '../enums/kyc-modal-status.enum';

export interface KYCModalProperties {
  status: KYC_MODAL_STATUS;
  title: string;
  description?: string;
  svgPath: string;
  messageCTA: string;
  showZendeskLink?: boolean;
}
