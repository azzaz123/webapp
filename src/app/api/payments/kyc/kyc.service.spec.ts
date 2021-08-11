import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
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
  MOCK_KYC_UNKNOWN_ERROR_RESPONSE,
} from '@fixtures/private/wallet/kyc/kyc-errors.fixtures.spec';
import { MOCK_KYC_IMAGES, MOCK_KYC_IMAGES_BASE_64 } from '@fixtures/private/wallet/kyc/kyc.fixtures.spec';
import { of, throwError } from 'rxjs';
import { KYCHttpService } from './http/kyc-http.service';

import { KYCService } from './kyc.service';

describe('KYCService', () => {
  let service: KYCService;
  let kycHttpService: KYCHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [KYCService, KYCHttpService],
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(KYCService);
    kycHttpService = TestBed.inject(KYCHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when requesting the KYC...', () => {
    describe(`and the server don't notify errors`, () => {
      it('should request to the HTTP service the KYC with the specified images', () => {
        spyOn(kycHttpService, 'request').and.returnValue(of(null));

        service.request(MOCK_KYC_IMAGES).subscribe();

        expect(kycHttpService.request).toBeCalledWith(MOCK_KYC_IMAGES);
        expect(kycHttpService.request).toHaveBeenCalledTimes(1);
      });
    });

    describe('and when receiving an error from server', () => {
      describe('and when the error is an unknown error', () => {
        beforeEach(() => {
          spyOn(kycHttpService, 'request').and.returnValue(throwError(MOCK_KYC_UNKNOWN_ERROR_RESPONSE));
        });

        it('should map to generic error', () => {
          let response: KYCError[];

          service.request(MOCK_KYC_IMAGES_BASE_64).subscribe({
            error: (errorResponse: KYCError[]) => (response = errorResponse),
          });

          expect(response[0] instanceof Error).toBe(true);
        });
      });

      describe('and when the error is a mangopay user not found error', () => {
        beforeEach(() => {
          spyOn(kycHttpService, 'request').and.returnValue(throwError(MOCK_KYC_MANGOPAY_USER_NOT_FOUND_RESPONSE));
        });

        it('should map the error', () => {
          let response: KYCError[];

          service.request(MOCK_KYC_IMAGES_BASE_64).subscribe({
            error: (errorResponse: KYCError[]) => (response = errorResponse),
          });

          expect(response[0] instanceof MangopayUserNotFoundError).toBe(true);
        });
      });

      describe('and when the error is a image size exceeded error', () => {
        beforeEach(() => {
          spyOn(kycHttpService, 'request').and.returnValue(throwError(MOCK_KYC_DOCUMENT_IMAGE_SIZE_EXCEEDED_RESPONSE));
        });

        it('should map the error', () => {
          let response: KYCError[];

          service.request(MOCK_KYC_IMAGES_BASE_64).subscribe({
            error: (errorResponse: KYCError[]) => (response = errorResponse),
          });

          expect(response[0] instanceof DocumentImageSizeExceededError).toBe(true);
        });
      });

      describe('and when the error is a kyc document image invalid input file error', () => {
        beforeEach(() => {
          spyOn(kycHttpService, 'request').and.returnValue(throwError(MOCK_KYC_DOCUMENT_IMAGE_INVALID_INPUT_FILE_RESPONSE));
        });

        it('should map the error', () => {
          let response: KYCError[];

          service.request(MOCK_KYC_IMAGES_BASE_64).subscribe({
            error: (errorResponse: KYCError[]) => (response = errorResponse),
          });

          expect(response[0] instanceof DocumentImageIsInvalidInputFileError).toBe(true);
        });
      });

      describe('and when the error is a document image invalid error', () => {
        beforeEach(() => {
          spyOn(kycHttpService, 'request').and.returnValue(throwError(MOCK_KYC_DOCUMENT_IMAGE_INVALID_RESPONSE));
        });

        it('should map the error', () => {
          let response: KYCError[];

          service.request(MOCK_KYC_IMAGES_BASE_64).subscribe({
            error: (errorResponse: KYCError[]) => (response = errorResponse),
          });

          expect(response[0] instanceof DocumentImageIsInvalidError).toBe(true);
        });
      });
    });
  });
});
