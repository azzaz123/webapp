import { NgbAlertConfig } from '@ng-bootstrap/ng-bootstrap';
import { KYC_STATUS } from './kyc-status.enum';

export interface KYCBannerSpecifications extends NgbAlertConfig {
  status: KYC_STATUS;
  svgPath: string;
  description: string;
  buttonText: string;
}
