import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import {
  DocumentImageIsInvalidError,
  DocumentImageIsInvalidInputFileError,
  DocumentImageSizeExceededError,
  DocumentImageSizeTooSmallError,
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
import { of, throwError } from 'rxjs';
import { UuidService } from '@core/uuid/uuid.service';
import {
  MOCK_KYC_IMAGES_BASE_64,
  MOCK_KYC_IMAGES_BASE_64_BACK_NULL,
  MOCK_KYC_IMAGES_BASE_64_SMALL,
  MOCK_KYC_IMAGES_NON_BASE_64,
  MOCK_KYC_IMAGES_NON_BASE_64_BACK_NULL,
  MOCK_KYC_REQUEST_BODY,
} from '@fixtures/private/wallet/kyc/kyc.fixtures.spec';
import { KYCHttpService } from './http/kyc-http.service';

import { KYCService } from './kyc.service';

describe('KYCService', () => {
  let service: KYCService;
  let kycHttpService: KYCHttpService;
  let uuidService: UuidService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [KYCService, KYCHttpService, UuidService],
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(KYCService);
    kycHttpService = TestBed.inject(KYCHttpService);
    uuidService = TestBed.inject(UuidService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when we request the KYC verification...', () => {
    describe('and the images are smaller than 1KB', () => {
      beforeEach(() => {
        spyOn(kycHttpService, 'request');
      });

      it('should throw an error', () => {
        let response: KYCError[];

        service.request(MOCK_KYC_IMAGES_BASE_64_SMALL).subscribe({
          error: (errorResponse: KYCError[]) => (response = errorResponse),
        });

        expect(response[0] instanceof DocumentImageSizeTooSmallError).toBe(true);
      });

      it('should not do the KYC request ', () => {
        service.request(MOCK_KYC_IMAGES_BASE_64_SMALL).subscribe();

        expect(kycHttpService.request).not.toHaveBeenCalled();
      });
    });

    describe('and the images are NOT smaller than 1KB', () => {
      describe(`and the server don't notify errors`, () => {
        beforeEach(() => {
          spyOn(uuidService, 'getUUID').and.returnValue('1-2');
          spyOn(kycHttpService, 'request').and.returnValue(of(null));
        });

        describe('and we request it with first image and second image', () => {
          describe('and the base images are in base 64', () => {
            beforeEach(() => {
              service.request(MOCK_KYC_IMAGES_BASE_64).subscribe();
            });

            it('should request the KYC', () => {
              shouldRequestKYC();
            });

            it('should make the request with kyc required formed data', () => {
              shouldDoRequestWithFormattedImages(MOCK_KYC_IMAGES_BASE_64.frontSide, MOCK_KYC_IMAGES_BASE_64.backSide);
            });
          });

          describe('and the base images are NOT in base 64', () => {
            beforeEach(() => {
              service.request(MOCK_KYC_IMAGES_NON_BASE_64).subscribe();
            });

            it('should request the KYC', () => {
              shouldRequestKYC();
            });

            it('should make the request with kyc required formed data', () => {
              shouldDoRequestWithFormattedImages(MOCK_KYC_IMAGES_NON_BASE_64.frontSide, MOCK_KYC_IMAGES_NON_BASE_64.backSide);
            });
          });
        });

        describe('and we request it only with the first image', () => {
          describe('and the base image is in base 64', () => {
            beforeEach(() => {
              service.request(MOCK_KYC_IMAGES_BASE_64_BACK_NULL).subscribe();
            });

            it('should request the KYC', () => {
              shouldRequestKYC();
            });

            it('should make the request with second image null and kyc required formed data', () => {
              shouldDoRequestWithFormattedImages(MOCK_KYC_IMAGES_BASE_64_BACK_NULL.frontSide, null);
            });
          });

          describe('and the base image is NOT in base 64', () => {
            beforeEach(() => {
              service.request(MOCK_KYC_IMAGES_NON_BASE_64_BACK_NULL).subscribe();
            });

            it('should request the KYC', () => {
              shouldRequestKYC();
            });

            it('should make the request with second image null and kyc required formed data', () => {
              shouldDoRequestWithFormattedImages(MOCK_KYC_IMAGES_NON_BASE_64_BACK_NULL.frontSide, null);
            });
          });
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

    function shouldRequestKYC(): void {
      expect(kycHttpService.request).toHaveBeenCalledTimes(1);
    }

    function shouldDoRequestWithFormattedImages(frontSideImage: string, backSideImage: string): void {
      expect(kycHttpService.request).toBeCalledWith(MOCK_KYC_REQUEST_BODY(frontSideImage, backSideImage));
    }
  });
});
