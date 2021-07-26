import { KYCDocumentation } from '@private/features/wallet/interfaces/kyc/kyc-documentation.interface';
import { KYCNationality } from '@private/features/wallet/interfaces/kyc/kyc-nationality.interface';
import { KYC_TAKE_IMAGE_OPTIONS } from '../components/kyc-image-options/kyc-image-options.enum';

export interface KYCSpecifications {
  nationality: KYCNationality;
  documentation: KYCDocumentation;
  imageMethod: KYC_TAKE_IMAGE_OPTIONS;
}
