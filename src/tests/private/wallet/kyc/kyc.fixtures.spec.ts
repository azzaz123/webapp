import { KYCBanner, KYC_BANNER_STATUS } from '@private/features/wallet/interfaces/kyc/kyc-banner.interface';
import { KYCImages } from '@private/features/wallet/interfaces/kyc/kyc-images.interface';

export const MOCK_KYC_BANNER_PENDING_VERIFICATION: KYCBanner = {
  status: KYC_BANNER_STATUS.PENDING_VERIFICATION,
};

export const MOCK_KYC_BANNER_PENDING: KYCBanner = {
  status: KYC_BANNER_STATUS.PENDING,
};

export const MOCK_KYC_BANNER_REJECTED: KYCBanner = {
  status: KYC_BANNER_STATUS.REJECTED,
};

export const MOCK_KYC_BANNER_VERIFIED: KYCBanner = {
  status: KYC_BANNER_STATUS.VERIFIED,
};

export const MOCK_KYC_BANNER_NO_NEED: KYCBanner = {
  status: KYC_BANNER_STATUS.NO_NEED,
};

export const MOCK_EMPTY_KYC_IMAGES: KYCImages = {
  frontSide: null,
  backSide: null,
};

export const MOCK_KYC_IMAGES_FRONT_DEFINED: KYCImages = {
  frontSide: 'fakeBase64PImage',
  backSide: null,
};

export const MOCK_KYC_IMAGES_BACK_DEFINED: KYCImages = {
  frontSide: null,
  backSide: 'fakeBase64PImage2',
};

export const MOCK_KYC_IMAGES: KYCImages = {
  frontSide: 'fakeBase64PImage',
  backSide: 'fakeBase64PImage2',
};
