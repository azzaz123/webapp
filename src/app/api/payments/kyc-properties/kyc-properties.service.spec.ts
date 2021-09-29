import { HttpClientTestingModule } from '@angular/common/http/testing';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
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
  const fifteenSeconds = 15000;
  const secondCases = [0, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000, 11000, 12000, 13000, 14000, 15000];

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
    it('should request the kyc properties to the api service', fakeAsync(() => {
      spyOn(kycPropertiesHttpService, 'get').and.returnValue(of(MOCK_KYC_PENDING_PROPERTIES_API));
      let request: KYCProperties;

      const subscription = service.get().subscribe((result: KYCProperties) => {
        request = result;
      });

      tick(0);

      expect(kycPropertiesHttpService.get).toHaveBeenCalledTimes(1);
      expect(request).toStrictEqual(mapKYCPropertiesApiToKYCProperties(MOCK_KYC_PENDING_PROPERTIES_API));
      subscription.unsubscribe();
    }));

    it('should update the KYCProperties subject', fakeAsync(() => {
      spyOn(kycPropertiesHttpService, 'get').and.returnValue(of(MOCK_KYC_PENDING_PROPERTIES_API));
      const subscription = service.get().subscribe();
      let KYCPropertiesSubject: KYCProperties;

      tick(0);
      service.KYCProperties$.subscribe((result: KYCProperties) => {
        KYCPropertiesSubject = result;
      });

      expect(KYCPropertiesSubject).toStrictEqual(mapKYCPropertiesApiToKYCProperties(MOCK_KYC_PENDING_PROPERTIES_API));
      subscription.unsubscribe();
    }));

    describe('and the kyc status is needed...', () => {
      beforeEach(() => {
        spyOn(kycPropertiesHttpService, 'get').and.returnValue(of(MOCK_KYC_PENDING_PROPERTIES_API));
      });

      it.each(secondCases)(
        'should request the properties every 15 seconds',
        fakeAsync((second: number) => {
          const subscription = service.get().subscribe();

          const isLessThan15Seconds = second < fifteenSeconds;
          const expectedCalls = isLessThan15Seconds ? 1 : 2;

          tick(second);

          expect(kycPropertiesHttpService.get).toHaveBeenCalledTimes(expectedCalls);
          subscription.unsubscribe();
        })
      );
    });

    describe('and the kyc status is no need...', () => {
      beforeEach(() => {
        spyOn(kycPropertiesHttpService, 'get').and.returnValue(of(MOCK_KYC_NO_NEED_PROPERTIES_API));
      });

      it.each(secondCases)(
        'should request the properties only one time',
        fakeAsync((second: number) => {
          const subscription = service.get().subscribe();

          tick(second);

          expect(kycPropertiesHttpService.get).toHaveBeenCalledTimes(1);
          subscription.unsubscribe();
        })
      );
    });
  });

  describe('when getting the banner specifications from the KYC properties...', () => {
    describe('and the status requires banner', () => {
      it('should return the banner specifications', () => {
        const rejectedProperties: KYCProperties = mapKYCPropertiesApiToKYCProperties(MOCK_KYC_REJECTED_PROPERTIES_API);

        let bannerSpecification: KYCBannerSpecifications;
        service.getBannerSpecificationsFromProperties(rejectedProperties).subscribe((res) => (bannerSpecification = res));

        expect(bannerSpecification).toStrictEqual(KYC_BANNER_SPECIFICATIONS(rejectedProperties));
      });
    });

    describe('and the banner is not needed', () => {
      it('should NOT return the banner specifications', () => {
        const noNeedProperties: KYCProperties = mapKYCPropertiesApiToKYCProperties(MOCK_KYC_NO_NEED_PROPERTIES_API);

        let bannerSpecification: KYCBannerSpecifications;
        service.getBannerSpecificationsFromProperties(noNeedProperties).subscribe((res) => (bannerSpecification = res));

        expect(bannerSpecification).toBeFalsy();
      });
    });
  });

  function KYC_BANNER_SPECIFICATIONS(KYCProperties: KYCProperties): KYCBannerSpecifications {
    return KYC_BANNER_TYPES.find((specification) => specification.status === KYCProperties.status);
  }
});
