import { MOCK_ERROR_RESPONSE } from '@api/fixtures/error-response-api.fixtures.spec';
import { KYCErrorApi, KYCErrorResponseApi } from '@api/payments/kyc/dtos/errors';
import { KYC_ERROR_CODES } from '@api/payments/kyc/mappers/errors/kyc-error-codes.enum';

export const MOCK_KYC_BASE_ERROR_RESPONSE: KYCErrorResponseApi = {
  ...MOCK_ERROR_RESPONSE,
  error: [],
};

export const MOCK_KYC_UNKNOWN_ERROR_RESPONSE: KYCErrorResponseApi<unknown> = {
  ...MOCK_ERROR_RESPONSE,
  error: [{ error_code: 'unknown', message: 'rip' }],
};

export const MOCK_KYC_MANGOPAY_USER_NOT_FOUND: KYCErrorApi<KYC_ERROR_CODES> = {
  error_code: KYC_ERROR_CODES.MANGOPAY_USER_NOT_FOUND,
  message: 'mangopay user not found (ɔ◔‿◔)ɔ ♥',
};

export const MOCK_KYC_DOCUMENT_IMAGE_SIZE_EXCEEDED: KYCErrorApi<KYC_ERROR_CODES> = {
  error_code: KYC_ERROR_CODES.KYC_DOCUMENT_IMAGE_SIZE_EXCEEDED,
  message: 'kyc document image size exceeded (✿◠‿◠)',
};

export const MOCK_KYC_DOCUMENT_IMAGE_INVALID_INPUT_FILE: KYCErrorApi<KYC_ERROR_CODES> = {
  error_code: KYC_ERROR_CODES.KYC_DOCUMENT_IMAGE_INVALID_INPUT_FILE,
  message: 'kyc document image invalid input file ٩(˘◡˘)۶',
};

export const MOCK_KYC_DOCUMENT_IMAGE_INVALID: KYCErrorApi<KYC_ERROR_CODES> = {
  error_code: KYC_ERROR_CODES.KYC_DOCUMENT_IMAGE_INVALID,
  message: 'kyc document image invalid （っ＾▿＾）',
};

export const MOCK_KYC_MANGOPAY_USER_NOT_FOUND_RESPONSE: KYCErrorResponseApi = {
  ...MOCK_KYC_BASE_ERROR_RESPONSE,
  error: [MOCK_KYC_MANGOPAY_USER_NOT_FOUND],
};

export const MOCK_KYC_DOCUMENT_IMAGE_SIZE_EXCEEDED_RESPONSE: KYCErrorResponseApi = {
  ...MOCK_KYC_BASE_ERROR_RESPONSE,
  error: [MOCK_KYC_DOCUMENT_IMAGE_SIZE_EXCEEDED],
};

export const MOCK_KYC_DOCUMENT_IMAGE_INVALID_INPUT_FILE_RESPONSE: KYCErrorResponseApi = {
  ...MOCK_KYC_BASE_ERROR_RESPONSE,
  error: [MOCK_KYC_DOCUMENT_IMAGE_INVALID_INPUT_FILE],
};

export const MOCK_KYC_DOCUMENT_IMAGE_INVALID_RESPONSE: KYCErrorResponseApi = {
  ...MOCK_KYC_BASE_ERROR_RESPONSE,
  error: [MOCK_KYC_DOCUMENT_IMAGE_INVALID],
};
