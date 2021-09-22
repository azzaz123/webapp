import { MOCK_BASE_64_32KB_IMAGE, MOCK_BASE_64_SMALL_IMAGE } from '@fixtures/base64.fixtures.spec';
import { MOCK_JPEG_IMAGE_BIGGER_32KB } from '@fixtures/jpeg.fixtures.spec';
import { KYCImages } from '@private/features/wallet/interfaces/kyc/kyc-images.interface';
import { MIME_TYPES } from '@shared/enums/mime-types.enum';

export const MOCK_EMPTY_KYC_IMAGES: KYCImages = {
  frontSide: null,
  backSide: null,
};

export const MOCK_KYC_IMAGES_BASE_64: KYCImages = {
  frontSide: MOCK_BASE_64_32KB_IMAGE,
  backSide: MOCK_BASE_64_32KB_IMAGE,
};

export const MOCK_KYC_IMAGES_BASE_64_SMALL: KYCImages = {
  frontSide: MOCK_BASE_64_SMALL_IMAGE,
  backSide: MOCK_BASE_64_SMALL_IMAGE,
};

export const MOCK_KYC_IMAGES_NON_BASE_64: KYCImages = {
  frontSide: MOCK_JPEG_IMAGE_BIGGER_32KB,
  backSide: MOCK_JPEG_IMAGE_BIGGER_32KB,
};

export const MOCK_KYC_IMAGES_BASE_64_BACK_NULL: KYCImages = {
  frontSide: MOCK_BASE_64_32KB_IMAGE,
  backSide: null,
};

export const MOCK_KYC_IMAGES_NON_BASE_64_BACK_NULL: KYCImages = {
  frontSide: MOCK_JPEG_IMAGE_BIGGER_32KB,
  backSide: null,
};

export function MOCK_JPEG_IMG_EVENT() {
  const mockFile = new File([''], 'filename', { type: MIME_TYPES.IMAGE_JPEG });
  return { target: { files: [mockFile], readyState: FileReader.DONE, result: MOCK_BASE_64_SMALL_IMAGE } };
}

export function MOCK_WITHOUT_JPEG_IMG_EVENT() {
  return { target: { files: null, readyState: FileReader.DONE, result: null } };
}

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
