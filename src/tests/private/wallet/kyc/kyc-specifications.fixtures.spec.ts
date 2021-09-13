import { KYCDocumentation } from '@private/features/wallet/interfaces/kyc/kyc-documentation.interface';
import { KYCNationality } from '@private/features/wallet/interfaces/kyc/kyc-nationality.interface';
import { KYC_TAKE_IMAGE_OPTIONS } from '@private/features/wallet/modals/kyc/components/kyc-image-options/kyc-image-options.enum';
import { KYC_DOCUMENTATION } from '@private/features/wallet/modals/kyc/constants/kyc-documentation-constants';
import { KYC_NATIONALITIES } from '@private/features/wallet/modals/kyc/constants/kyc-nationalities-constants';
import { KYCSpecifications } from '@private/features/wallet/modals/kyc/interfaces/kyc-specifications.interface';
import { MOCK_EMPTY_KYC_IMAGES } from './kyc-images.fixtures.spec';

export const MOCK_KYC_NATIONALITY: KYCNationality = KYC_NATIONALITIES[1];
export const MOCK_KYC_DOCUMENTATION: KYCDocumentation = KYC_DOCUMENTATION[1];

export const MOCK_KYC_SPECIFICATIONS: KYCSpecifications = {
  nationality: KYC_NATIONALITIES[0],
  documentation: KYC_DOCUMENTATION[0],
  imageMethod: KYC_TAKE_IMAGE_OPTIONS.SHOOT,
  images: MOCK_EMPTY_KYC_IMAGES,
};

export const MOCK_EMPTY_KYC_SPECIFICATIONS: KYCSpecifications = {
  nationality: null,
  documentation: null,
  imageMethod: null,
  images: MOCK_EMPTY_KYC_IMAGES,
};
