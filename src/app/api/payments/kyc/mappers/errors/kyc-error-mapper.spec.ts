import {
  DocumentImageIsInvalidError,
  DocumentImageIsInvalidInputFileError,
  DocumentImageSizeExceededError,
  KYCError,
  MangopayUserNotFoundError,
} from '@api/core/errors/payments/kyc';
import {
  MOCK_KYC_DOCUMENT_IMAGE_INVALID_INPUT_FILE_RESPONSE,
  MOCK_KYC_DOCUMENT_IMAGE_INVALID_RESPONSE,
  MOCK_KYC_DOCUMENT_IMAGE_SIZE_EXCEEDED_RESPONSE,
  MOCK_KYC_MANGOPAY_USER_NOT_FOUND_RESPONSE,
} from '@fixtures/private/kyc/kyc-errors.fixtures.spec';
import { KYCErrorMapper } from './kyc-error-mapper';

const kycErrorMapper = new KYCErrorMapper();

describe('when mapping an error from KYC verification backend', () => {
  describe('and server notifies mangopay user not exists error', () => {
    it('should notify mangopay not user found error', () => {
      let result: KYCError;

      kycErrorMapper.map(MOCK_KYC_MANGOPAY_USER_NOT_FOUND_RESPONSE).subscribe({
        error: (errors) => (result = errors[0]),
      });

      expect(result instanceof MangopayUserNotFoundError).toBe(true);
    });
  });

  describe('and server notifies document image size exceeded error', () => {
    it('should notify image size exceeded error', () => {
      let result: KYCError;

      kycErrorMapper.map(MOCK_KYC_DOCUMENT_IMAGE_SIZE_EXCEEDED_RESPONSE).subscribe({
        error: (errors) => (result = errors[0]),
      });

      expect(result instanceof DocumentImageSizeExceededError).toBe(true);
    });
  });

  describe('and server notifies image is invalid input file error', () => {
    it('should notify invalid image input file', () => {
      let result: KYCError;

      kycErrorMapper.map(MOCK_KYC_DOCUMENT_IMAGE_INVALID_INPUT_FILE_RESPONSE).subscribe({
        error: (errors) => (result = errors[0]),
      });

      expect(result instanceof DocumentImageIsInvalidInputFileError).toBe(true);
    });
  });

  describe('and server notifies image is invalid error', () => {
    it('should notify invalid image error', () => {
      let result: KYCError;

      kycErrorMapper.map(MOCK_KYC_DOCUMENT_IMAGE_INVALID_RESPONSE).subscribe({
        error: (errors) => (result = errors[0]),
      });

      expect(result instanceof DocumentImageIsInvalidError).toBe(true);
    });
  });
});
