import { KYCBanner, KYC_BANNER_STATUS } from '@private/features/wallet/interfaces/kyc/kyc-banner.interface';
import { KYCImages } from '@private/features/wallet/interfaces/kyc/kyc-images.interface';
import { MIME_TYPES } from '@shared/enums/mime-types.enum';

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

export const MOCK_KYC_IMAGES_BASE_64: KYCImages = {
  frontSide: 'data:image/jpeg;base64,/9j/eF/tURKSxCTdp0ckjOsOT/',
  backSide: 'data:image/jpeg;base64,/9j/eF/tURKSxCTdp0ck222sOT/',
};

export const MOCK_KYC_IMAGES_BASE_64_BACK_NULL: KYCImages = {
  frontSide: 'data:image/jpeg;base64,/9j/eF/tURKSxCTdp0ckjOsOT/',
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
  return new Blob([JSON.stringify({ id: '1-2' })], { type: 'application/json' });
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
