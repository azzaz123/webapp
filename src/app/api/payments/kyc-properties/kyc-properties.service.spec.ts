import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { KYC_BANNER_TYPES } from '@api/core/model/kyc-properties/constants/kyc-banner-constants';
import { KYCBannerSpecifications } from '@api/core/model/kyc-properties/interfaces/kyc-banner-specifications.interface';
import {
  MOCK_KYC_BANNER_NO_NEED,
  MOCK_KYC_BANNER_PENDING,
  MOCK_KYC_BANNER_PENDING_VERIFICATION,
  MOCK_KYC_BANNER_REJECTED,
  MOCK_KYC_BANNER_VERIFIED,
} from '@fixtures/private/wallet/kyc/kyc-properties.fixtures.spec';
import { KYCPropertiesHttpService } from '@api/payments/kyc-properties/http/kyc-properties-http.service';
import { of } from 'rxjs';
import { KYCPropertiesService } from './kyc-properties.service';

describe('KYCPropertiesService', () => {
  let service: KYCPropertiesService;
  let kycPropertiesHttpService: KYCPropertiesHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        KYCPropertiesService,
        {
          provide: KYCPropertiesHttpService,
          useValue: {
            get() {
              return of(MOCK_KYC_BANNER_PENDING_VERIFICATION);
            },
          },
        },
      ],
    });

    service = TestBed.inject(KYCPropertiesService);
    kycPropertiesHttpService = TestBed.inject(KYCPropertiesHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when getting the kyc banner status', () => {
    it('should request the banner status to the api service', () => {
      spyOn(kycPropertiesHttpService, 'get').and.returnValue(of(MOCK_KYC_BANNER_PENDING_VERIFICATION));

      let request: KYCBannerSpecifications;
      service.getBannerSpecifications().subscribe((result: KYCBannerSpecifications) => {
        request = result;
      });

      expect(kycPropertiesHttpService.get).toHaveBeenCalled();
    });

    describe('and the kyc status is verification pending', () => {
      beforeEach(() => {
        spyOn(kycPropertiesHttpService, 'get').and.returnValue(of(MOCK_KYC_BANNER_PENDING_VERIFICATION));
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
        spyOn(kycPropertiesHttpService, 'get').and.returnValue(of(MOCK_KYC_BANNER_PENDING));
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
        spyOn(kycPropertiesHttpService, 'get').and.returnValue(of(MOCK_KYC_BANNER_REJECTED));
      });

      it('should return the banner specification', () => {
        let request: KYCBannerSpecifications;

        service.kycPropertiesHttpService().subscribe((result: KYCBannerSpecifications) => {
          request = result;
        });

        expect(request).toStrictEqual(KYC_BANNER_SPECIFICATIONS(MOCK_KYC_BANNER_REJECTED));
      });
    });

    describe('and the kyc status is verified', () => {
      beforeEach(() => {
        spyOn(kycPropertiesHttpService, 'get').and.returnValue(of(MOCK_KYC_BANNER_VERIFIED));
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
        spyOn(kycPropertiesHttpService, 'get').and.returnValue(of(MOCK_KYC_BANNER_NO_NEED));
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
