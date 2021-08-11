import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import {
  MOCK_KYC_BANNER_NO_NEED,
  MOCK_KYC_BANNER_PENDING,
  MOCK_KYC_BANNER_PENDING_VERIFICATION,
  MOCK_KYC_BANNER_REJECTED,
  MOCK_KYC_BANNER_VERIFIED,
} from '@fixtures/private/kyc/kyc.fixtures.spec';
import { of } from 'rxjs';
import { KYC_BANNER_TYPES } from '../../components/kyc-banner/kyc-banner-constants';
import { KYCBanner, KYCBannerSpecifications } from '../../interfaces/kyc/kyc-banner.interface';
import { KYCBannerApiService } from '../api/kyc-banner-api.service';

import { KYCBannerService } from './kyc-banner.service';

describe('KYCBannerService', () => {
  let service: KYCBannerService;
  let kycBannerApiService: KYCBannerApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        KYCBannerService,
        {
          provide: KYCBannerApiService,
          useValue: {
            getKYCBanner() {
              return of(MOCK_KYC_BANNER_PENDING_VERIFICATION);
            },
          },
        },
      ],
    });

    service = TestBed.inject(KYCBannerService);
    kycBannerApiService = TestBed.inject(KYCBannerApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when getting the kyc banner status', () => {
    it('should request the banner status to the api service', () => {
      spyOn(kycBannerApiService, 'getKYCBanner').and.returnValue(of(MOCK_KYC_BANNER_PENDING_VERIFICATION));

      let request: KYCBannerSpecifications;
      service.getSpecifications().subscribe((result: KYCBannerSpecifications) => {
        request = result;
      });

      expect(kycBannerApiService.getKYCBanner).toHaveBeenCalled();
    });

    describe('and the kyc status is verification pending', () => {
      beforeEach(() => {
        spyOn(kycBannerApiService, 'getKYCBanner').and.returnValue(of(MOCK_KYC_BANNER_PENDING_VERIFICATION));
      });

      it('should return the banner specification', () => {
        let request: KYCBannerSpecifications;

        service.getSpecifications().subscribe((result: KYCBannerSpecifications) => {
          request = result;
        });

        expect(request).toStrictEqual(KYC_BANNER_SPECIFICATIONS(MOCK_KYC_BANNER_PENDING_VERIFICATION));
      });
    });

    describe('and the kyc status is pending', () => {
      beforeEach(() => {
        spyOn(kycBannerApiService, 'getKYCBanner').and.returnValue(of(MOCK_KYC_BANNER_PENDING));
      });

      it('should return the banner specification', () => {
        let request: KYCBannerSpecifications;

        service.getSpecifications().subscribe((result: KYCBannerSpecifications) => {
          request = result;
        });

        expect(request).toStrictEqual(KYC_BANNER_SPECIFICATIONS(MOCK_KYC_BANNER_PENDING));
      });
    });

    describe('and the kyc status is rejected', () => {
      beforeEach(() => {
        spyOn(kycBannerApiService, 'getKYCBanner').and.returnValue(of(MOCK_KYC_BANNER_REJECTED));
      });

      it('should return the banner specification', () => {
        let request: KYCBannerSpecifications;

        service.getSpecifications().subscribe((result: KYCBannerSpecifications) => {
          request = result;
        });

        expect(request).toStrictEqual(KYC_BANNER_SPECIFICATIONS(MOCK_KYC_BANNER_REJECTED));
      });
    });

    describe('and the kyc status is verified', () => {
      beforeEach(() => {
        spyOn(kycBannerApiService, 'getKYCBanner').and.returnValue(of(MOCK_KYC_BANNER_VERIFIED));
      });

      it('should return the banner specification', () => {
        let request: KYCBannerSpecifications;

        service.getSpecifications().subscribe((result: KYCBannerSpecifications) => {
          request = result;
        });

        expect(request).toStrictEqual(KYC_BANNER_SPECIFICATIONS(MOCK_KYC_BANNER_VERIFIED));
      });
    });

    describe('and the kyc status is not needed', () => {
      beforeEach(() => {
        spyOn(kycBannerApiService, 'getKYCBanner').and.returnValue(of(MOCK_KYC_BANNER_NO_NEED));
      });

      it('should return null', () => {
        let request: KYCBannerSpecifications;

        service.getSpecifications().subscribe((result: KYCBannerSpecifications) => {
          request = result;
        });

        expect(request).toStrictEqual(null);
      });
    });
  });

  function KYC_BANNER_SPECIFICATIONS(kycBanner: KYCBanner): KYCBannerSpecifications {
    return KYC_BANNER_TYPES.find((specification) => specification.status === kycBanner.status);
  }
});
