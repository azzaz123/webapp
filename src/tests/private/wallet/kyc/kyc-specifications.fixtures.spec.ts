import { KYCBannerSpecifications } from '@api/core/model/kyc-properties/interfaces/kyc-banner-specifications.interface';
import { KYC_STATUS } from '@api/core/model/kyc-properties/kyc-status.enum';
import { KYCDocumentation } from '@private/features/wallet/interfaces/kyc/kyc-documentation.interface';
import { KYCNationality } from '@private/features/wallet/interfaces/kyc/kyc-nationality.interface';
import { KYC_TAKE_IMAGE_OPTIONS } from '@private/features/wallet/modals/kyc/components/kyc-image-options/kyc-image-options.enum';
import { KYC_DOCUMENTATION } from '@private/features/wallet/modals/kyc/constants/kyc-documentation-constants';
import { KYC_NATIONALITIES } from '@private/features/wallet/modals/kyc/constants/kyc-nationalities-constants';
import { KYCSpecifications } from '@private/features/wallet/modals/kyc/interfaces/kyc-specifications.interface';
import { BANNER_TYPES } from '@shared/banner/banner-types.enum';
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

export const MOCK_KYC_SPECIFICATIONS_NO_NEED: KYCBannerSpecifications = {
  status: KYC_STATUS.NO_NEED,
  svgPath: 'svg path',
  description: 'some description',
  buttonText: 'the button text',
  type: BANNER_TYPES.DANGER,
  dismissible: false,
};

export const MOCK_KYC_SPECIFICATIONS_PENDING: KYCBannerSpecifications = {
  status: KYC_STATUS.PENDING,
  svgPath: 'svg path',
  description: 'some description',
  buttonText: 'the button text',
  type: BANNER_TYPES.DANGER,
  dismissible: false,
};

export const MOCK_KYC_SPECIFICATIONS_VERIFIED: KYCBannerSpecifications = {
  status: KYC_STATUS.VERIFIED,
  svgPath: 'svg path',
  description: 'some description',
  buttonText: 'the button text',
  type: BANNER_TYPES.DANGER,
  dismissible: false,
};
