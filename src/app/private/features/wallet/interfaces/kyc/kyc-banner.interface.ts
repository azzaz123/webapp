import { NgbAlertConfig } from '@ng-bootstrap/ng-bootstrap';

export interface KYCBanner {
  status: KYC_BANNER_STATUS;
}

export interface KYCBannerSpecifications extends NgbAlertConfig, KYCBanner {
  svgPath: string;
  description: string;
  buttonText: string;
}

export enum KYC_BANNER_STATUS {
  PENDING = 'pending',
  PENDING_VERIFICATION = 'pending verification',
  VERIFIED = 'verified',
  REJECTED = 'rejected',
  NO_NEED = 'no need',
}
