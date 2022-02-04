import { BannerSpecifications } from '@shared/banner/banner-specifications.interface';
import { KYC_STATUS } from '../kyc-status.enum';

export interface KYCBannerSpecifications extends BannerSpecifications {
  status: KYC_STATUS;
  svgPath: string;
  description: string;
  buttonText: string;
}
