import { NgbAlertConfig } from '@ng-bootstrap/ng-bootstrap';

export interface KYCStatus {
  status: KYC_STATUS;
  documentId: string;
  refusedReason: string;
}

export interface KYCBannerSpecifications extends NgbAlertConfig, KYCStatus {
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
