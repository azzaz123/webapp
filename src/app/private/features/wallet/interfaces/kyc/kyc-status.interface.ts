import { NgbAlertConfig } from '@ng-bootstrap/ng-bootstrap';
import { KYC_REFUSED_REASON } from '../../enums/kyc-refused-reason.enum';

export interface KYCStatus {
  status: KYC_STATUS;
  refusedReason: KYC_REFUSED_REASON;
  documentId: string;
  mangopayUserId: string;
}

export interface KYCBannerSpecifications extends NgbAlertConfig {
  status: KYC_STATUS;
  svgPath: string;
  description: string;
  buttonText: string;
}

export enum KYC_STATUS {
  PENDING = 'pending',
  PENDING_VERIFICATION = 'pending verification',
  VERIFIED = 'verified',
  REJECTED = 'rejected',
  NO_NEED = 'no need',
}
