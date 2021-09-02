import { NgbAlertConfig } from '@ng-bootstrap/ng-bootstrap';
import { KYC_STATUS_STATES } from './kyc-status-states.enum';

export interface KYCBannerSpecifications extends NgbAlertConfig {
  status: KYC_STATUS_STATES;
  svgPath: string;
  description: string;
  buttonText: string;
}
