import { NgbAlertConfig } from '@ng-bootstrap/ng-bootstrap';

export interface KYCBannerInterface extends NgbAlertConfig {
  status: STATUS_KYC_BANNER_TYPES;
  svgPath: string;
  description: string;
  buttonText: string;
}

export enum STATUS_KYC_BANNER_TYPES {
  PENDING = 'pending',
  PENDING_VERIFICATION = 'pending verification',
  VERIFIED = 'verified',
  REJECTED = 'rejected',
  NO_NEED = 'no need',
}
