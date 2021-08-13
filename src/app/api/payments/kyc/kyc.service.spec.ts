import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { UuidService } from '@core/uuid/uuid.service';
import {
  MOCK_KYC_IMAGES_BASE_64,
  MOCK_KYC_IMAGES_BASE_64_BACK_NULL,
  MOCK_KYC_IMAGES_NON_BASE_64,
  MOCK_KYC_IMAGES_NON_BASE_64_BACK_NULL,
  MOCK_KYC_REQUEST_BODY,
} from '@fixtures/private/wallet/kyc/kyc.fixtures.spec';
import { of } from 'rxjs';
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
    beforeEach(() => {
      spyOn(uuidService, 'getUUID').and.returnValue('1-2');
      spyOn(kycHttpService, 'request').and.returnValue(of(null));
    });

    describe('and we request it with first image and second image', () => {
      describe('and the base images are base 64', () => {
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

      describe('and the base images are NOT base 64', () => {
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
      describe('and the base images are base 64', () => {
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

      describe('and the base images are NOT base 64', () => {
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

  function shouldRequestKYC(): void {
    expect(kycHttpService.request).toHaveBeenCalledTimes(1);
  }

  function shouldDoRequestWithFormattedImages(frontSideImage: string, backSideImage: string) {
    expect(kycHttpService.request).toBeCalledWith(MOCK_KYC_REQUEST_BODY(frontSideImage, backSideImage));
  }
});
