import { MOCK_BASE_64_1KB_IMAGE, MOCK_BASE_64_SMALL_IMAGE } from '@fixtures/base64.fixtures.spec';
import { KYCBanner, KYC_BANNER_STATUS } from '@private/features/wallet/interfaces/kyc/kyc-banner.interface';
import { KYCImages } from '@private/features/wallet/interfaces/kyc/kyc-images.interface';
import { MIME_TYPES } from '@shared/enums/mime-types.enum';

const MOCK_IMAGE_NON_BASE_64 =
  'data:image/jpeg,/9j/eF/tURKtURKSxCTdp0ckjOsOTSxCTdp0ckjOsOT/tURKSxCtURKSxCTdp0ckjOsOTTdp0ckjOsOT/tURKSxCTdp0ckjOsOT/tURKSxCTdp0ckjOsOT/tURKSxCTdp0ckjOsOT/tURKSxCTdp0ckjOsOT/tURKSxCTdp0ckjOsOT/tURKSxCTdp0ckjOsOT/tURKSxCTdp0ckjOsOT/tURKSxCTdp0ckjOsOT/tURKSxCTdp0ckjOsOT/tURKSxCTdtURKSxCTdp0ckjOsOtURKSxCTdp0ckjOsOTTtURKSxCTdp0ckjOsOtURKSxCTdp0ckjOsOTTp0ckjOsOT/tURKSxCTdp0ckjOsOT/tURKSxCTtURKSxCTdp0ckjOsOtURKSxCTdp0ckjOsOTTdp0ckjOsOT/tURKSxCTdp0ckjOsOT/tURKSxCTdp0ckjOtURKSxCTdp0ckjOsOtURKSxCTdp0ckjOsOTTsOT/tUtURKSxCTdp0ckjOsOtURKSxCTdp0ckjOsOTTRKSxCTdp0ckjOsOT/tURKSxCTdp0ckjOsOT/tURKSxtURKSxCTdp0ckjtURKSxCTdp0ckjOsOtURKSxCTdp0ckjOsOTTOsOTCTdp0ckjOsOT/tURKSxCTdp0ckjOsOT/tURKSxCTdp0ckjOsOT/tURKSxCTdtURKSxCTdp0ckjOsOTp0ckjtURKSxCTdp0ckjOsOtURKSxCTdp0ckjOsOTTOsOT/tURKtURKSxCTdp0ckjOsOTSxCTdp0ckjOsOT/tURKSxCTdp0cktURKSxCTdp0ckjOsOTjOsOT/tURKtURKSxCTdp0ckjtURKSxCTdp0ckjOsOtURKSxCTdp0ckjOsOTTOsOTSxCTdp0ckjOsOT/tURKSxCTdp0ckjOtURKSxCTdp0ckjOsOTsOT/tURKSxCTdp0ckjOsOtURKSxCTdp0ckjOsOTTtURKSxCTdp0ckjOsOtURKSxCTdp0ckjOsOTTtURKSxCTdp0ckjOsOtURKSxCTdp0ckjOsOTT/tURKSxCTdp0tURKSxCTdp0ckjOsOtURKSxCTdp0ckjOsOTTckjOsOTtURKSxCTdp0ckjOsOT/';

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

export const MOCK_KYC_IMAGES_BACK_DEFINED: KYCImages = {
  frontSide: null,
  backSide: MOCK_BASE_64_1KB_IMAGE,
};

export const MOCK_KYC_IMAGES_BASE_64: KYCImages = {
  frontSide: MOCK_BASE_64_1KB_IMAGE,
  backSide: MOCK_BASE_64_1KB_IMAGE,
};

export const MOCK_KYC_IMAGES_BASE_64_SMALL: KYCImages = {
  frontSide: MOCK_BASE_64_SMALL_IMAGE,
  backSide: MOCK_BASE_64_SMALL_IMAGE,
};

export const MOCK_KYC_IMAGES_NON_BASE_64: KYCImages = {
  frontSide: MOCK_IMAGE_NON_BASE_64,
  backSide: MOCK_IMAGE_NON_BASE_64,
};

export const MOCK_KYC_IMAGES_BASE_64_BACK_NULL: KYCImages = {
  frontSide: MOCK_BASE_64_1KB_IMAGE,
  backSide: null,
};

export const MOCK_KYC_IMAGES_NON_BASE_64_BACK_NULL: KYCImages = {
  frontSide: MOCK_IMAGE_NON_BASE_64,
  backSide: null,
};

function getBlobFromBase64JPEGImage(dataURI: string): Blob {
  let rawBinary: string;

  if (dataURI.split(',')[0].indexOf('base64') >= 0) rawBinary = atob(dataURI.split(',')[1]);
  else rawBinary = unescape(dataURI.split(',')[1]);

  const blobPart: Uint8Array = new Uint8Array(rawBinary.length);
  for (let i = 0; i < rawBinary.length; i++) {
    blobPart[i] = rawBinary.charCodeAt(i);
  }

  return new Blob([blobPart], { type: MIME_TYPES.IMAGE_JPEG });
}

function getRequestIdAsBlob(): Blob {
  return new Blob([JSON.stringify({ id: '1-2' })], { type: MIME_TYPES.APPLICATION_JSON });
}

export function MOCK_KYC_REQUEST_BODY(firstImage: string, secondImage: string): FormData {
  const body = {
    firstImage: getBlobFromBase64JPEGImage(firstImage),
    secondImage: secondImage ? getBlobFromBase64JPEGImage(secondImage) : null,
    request: getRequestIdAsBlob(),
  };
  const bodyAsQueryParams: FormData = new FormData();
  Object.keys(body).forEach((key: string) => bodyAsQueryParams.append(key, body[key]));

  return bodyAsQueryParams;
}
