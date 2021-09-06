import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { KYCBannerSpecifications } from '@api/core/model/kyc-properties/interfaces/kyc-banner-specifications.interface';
import {
  MOCK_KYC_NO_NEED_PROPERTIES_API,
  MOCK_KYC_PENDING_PROPERTIES_API,
  MOCK_KYC_REJECTED_PROPERTIES_API,
} from '@fixtures/private/wallet/kyc/kyc-properties.fixtures.spec';
import { KYCPropertiesHttpService } from '@api/payments/kyc-properties/http/kyc-properties-http.service';
import { of } from 'rxjs';
import { KYCPropertiesService } from './kyc-properties.service';
import { KYCProperties } from '@api/core/model/kyc-properties/interfaces/kyc-properties.interface';
import { mapKYCPropertiesApiToKYCProperties } from '../kyc/mappers/responses/kyc-properties.mapper';
import { KYC_BANNER_TYPES } from '@api/core/model/kyc-properties/constants/kyc-banner-constants';

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
              return of();
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

  describe('when getting the kyc properties', () => {
    beforeEach(() => {
      spyOn(kycPropertiesHttpService, 'get').and.returnValue(of(MOCK_KYC_PENDING_PROPERTIES_API));
    });

    it('should request the kyc properties to the api service', () => {
      let request: KYCProperties;
      service.get().subscribe((result: KYCProperties) => {
        request = result;
      });

      expect(kycPropertiesHttpService.get).toHaveBeenCalled();
      expect(request).toStrictEqual(mapKYCPropertiesApiToKYCProperties(MOCK_KYC_PENDING_PROPERTIES_API));
    });

    it('should update the KYCProperties subject', () => {
      service.get().subscribe();

      let KYCPropertiesSubject: KYCProperties;
      service.KYCProperties$.subscribe((result: KYCProperties) => {
        KYCPropertiesSubject = result;
      });

      expect(KYCPropertiesSubject).toStrictEqual(mapKYCPropertiesApiToKYCProperties(MOCK_KYC_PENDING_PROPERTIES_API));
    });
  });

  describe('when getting the banner specifications from the KYC properties...', () => {
    describe('and the status requires banner', () => {
      it('should return the banner specifications', () => {
        const rejectedProperties: KYCProperties = mapKYCPropertiesApiToKYCProperties(MOCK_KYC_REJECTED_PROPERTIES_API);

        let bannerSpecification: KYCBannerSpecifications;
        service.getBannerSpecifications(rejectedProperties).subscribe((res) => (bannerSpecification = res));

        expect(bannerSpecification).toStrictEqual(KYC_BANNER_SPECIFICATIONS(rejectedProperties));
      });
    });

    describe('and the banner is not needed', () => {
      it('should NOT return the banner specifications', () => {
        const noNeedProperties: KYCProperties = mapKYCPropertiesApiToKYCProperties(MOCK_KYC_NO_NEED_PROPERTIES_API);

        let bannerSpecification: KYCBannerSpecifications;
        service.getBannerSpecifications(noNeedProperties).subscribe((res) => (bannerSpecification = res));

        expect(bannerSpecification).toStrictEqual(null);
      });
    });
  });

  function KYC_BANNER_SPECIFICATIONS(KYCProperties: KYCProperties): KYCBannerSpecifications {
    return KYC_BANNER_TYPES.find((specification) => specification.status === KYCProperties.status);
  }
});
