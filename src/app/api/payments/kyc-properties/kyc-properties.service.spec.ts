import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { KYC_BANNER_TYPES } from '@api/core/model/kyc-properties/kyc-banner-constants';
import { KYCBannerSpecifications } from '@api/core/model/kyc-properties/kyc-banner-specifications.interface';
import { KYCProperties } from '@api/core/model/kyc-properties/kyc-properties.interface';
import {
  MOCK_KYC_BANNER_NO_NEED,
  MOCK_KYC_BANNER_PENDING,
  MOCK_KYC_BANNER_PENDING_VERIFICATION,
  MOCK_KYC_BANNER_REJECTED,
  MOCK_KYC_BANNER_VERIFIED,
} from '@fixtures/private/wallet/kyc/kyc.fixtures.spec';
import { KYCStatusApiService } from '@private/features/wallet/services/api/kyc-status-api/kyc-status-api.service';
import { of } from 'rxjs';
import { KYCPropertiesService } from './kyc-properties.service';

describe('KYCPropertiesService', () => {
  let service: KYCPropertiesService;
  let kycStatusApiService: KYCStatusApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        KYCPropertiesService,
        {
          provide: KYCStatusApiService,
          useValue: {
            get() {
              return of(MOCK_KYC_BANNER_PENDING_VERIFICATION);
            },
          },
        },
      ],
    });

    service = TestBed.inject(KYCPropertiesService);
    kycStatusApiService = TestBed.inject(KYCStatusApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when getting the kyc banner status', () => {
    it('should request the banner status to the api service', () => {
      spyOn(kycStatusApiService, 'get').and.returnValue(of(MOCK_KYC_BANNER_PENDING_VERIFICATION));

      let request: KYCBannerSpecifications;
      service.getBannerSpecifications().subscribe((result: KYCBannerSpecifications) => {
        request = result;
      });

      expect(kycStatusApiService.get).toHaveBeenCalled();
    });

    describe('and the kyc status is verification pending', () => {
      beforeEach(() => {
        spyOn(kycStatusApiService, 'get').and.returnValue(of(MOCK_KYC_BANNER_PENDING_VERIFICATION));
      });

      it('should return the banner specification', () => {
        let request: KYCBannerSpecifications;

        service.getBannerSpecifications().subscribe((result: KYCBannerSpecifications) => {
          request = result;
        });

        expect(request).toStrictEqual(KYC_BANNER_SPECIFICATIONS(MOCK_KYC_BANNER_PENDING_VERIFICATION));
      });
    });

    describe('and the kyc status is pending', () => {
      beforeEach(() => {
        spyOn(kycStatusApiService, 'get').and.returnValue(of(MOCK_KYC_BANNER_PENDING));
      });

      it('should return the banner specification', () => {
        let request: KYCBannerSpecifications;

        service.getBannerSpecifications().subscribe((result: KYCBannerSpecifications) => {
          request = result;
        });

        expect(request).toStrictEqual(KYC_BANNER_SPECIFICATIONS(MOCK_KYC_BANNER_PENDING));
      });
    });

    describe('and the kyc status is rejected', () => {
      beforeEach(() => {
        spyOn(kycStatusApiService, 'get').and.returnValue(of(MOCK_KYC_BANNER_REJECTED));
      });

      it('should return the banner specification', () => {
        let request: KYCBannerSpecifications;

        service.getBannerSpecifications().subscribe((result: KYCBannerSpecifications) => {
          request = result;
        });

        expect(request).toStrictEqual(KYC_BANNER_SPECIFICATIONS(MOCK_KYC_BANNER_REJECTED));
      });
    });

    describe('and the kyc status is verified', () => {
      beforeEach(() => {
        spyOn(kycStatusApiService, 'get').and.returnValue(of(MOCK_KYC_BANNER_VERIFIED));
      });

      it('should return the banner specification', () => {
        let request: KYCBannerSpecifications;

        service.getBannerSpecifications().subscribe((result: KYCBannerSpecifications) => {
          request = result;
        });

        expect(request).toStrictEqual(KYC_BANNER_SPECIFICATIONS(MOCK_KYC_BANNER_VERIFIED));
      });
    });

    describe('and the kyc status is not needed', () => {
      beforeEach(() => {
        spyOn(kycStatusApiService, 'get').and.returnValue(of(MOCK_KYC_BANNER_NO_NEED));
      });

      it('should return null', () => {
        let request: KYCBannerSpecifications;

        service.getBannerSpecifications().subscribe((result: KYCBannerSpecifications) => {
          request = result;
        });

        expect(request).toStrictEqual(null);
      });
    });
  });

  function KYC_BANNER_SPECIFICATIONS(KYCProperties: KYCProperties): KYCBannerSpecifications {
    return KYC_BANNER_TYPES.find((specification) => specification.status === KYCProperties.status);
  }
});
