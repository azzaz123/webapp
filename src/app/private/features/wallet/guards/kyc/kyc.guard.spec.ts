import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { KYC_BANNER_TYPES } from '@api/core/model/kyc-properties/constants/kyc-banner-constants';
import { KYCBannerSpecifications } from '@api/core/model/kyc-properties/interfaces/kyc-banner-specifications.interface';
import { KYC_STATUS } from '@api/core/model/kyc-properties/kyc-status.enum';
import { KYCPropertiesService } from '@api/payments/kyc-properties/kyc-properties.service';

import { PRIVATE_PATHS } from '@private/private-routing-constants';
import { of } from 'rxjs';
import { KYCStatusApiService } from '../../services/api/kyc-status-api/kyc-status-api.service';

import { KYCGuard } from './kyc.guard';

describe('KYCGuard', () => {
  const WALLET_URL = PRIVATE_PATHS.WALLET;
  let guard: KYCGuard;
  let kycStatusService: KYCPropertiesService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        KYCGuard,
        KYCPropertiesService,
        KYCStatusApiService,
        {
          provide: Router,
          useValue: {
            navigate() {},
          },
        },
      ],
    });
    guard = TestBed.inject(KYCGuard);
    kycStatusService = TestBed.inject(KYCPropertiesService);
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  describe('when we check the KYC status banner specifications...', () => {
    describe('and the status is pending...', () => {
      beforeEach(() => {
        spyOn(router, 'navigate');
        spyOn(kycStatusService, 'get').and.returnValue(of(KYC_BANNER_SPECIFICATIONS(KYC_STATUS.PENDING)));
      });

      it('should be able to activate the KYC page', () => {
        let result: boolean;

        guard.canActivate().subscribe((isVerificationNeed: boolean) => {
          result = isVerificationNeed;
        });

        expect(result).toBe(true);
      });

      it('should NOT redirect to the wallet page', () => {
        guard.canActivate().subscribe(() => {});

        expect(router.navigate).not.toHaveBeenCalled();
      });
    });

    describe('and the status is rejected...', () => {
      beforeEach(() => {
        spyOn(router, 'navigate');

        spyOn(kycStatusService, 'get').and.returnValue(of(KYC_BANNER_SPECIFICATIONS(KYC_STATUS.REJECTED)));
      });

      it('should be able to activate the KYC page', () => {
        let result: boolean;

        guard.canActivate().subscribe((isVerificationNeed: boolean) => {
          result = isVerificationNeed;
        });

        expect(result).toBe(true);
      });

      it('should NOT redirect to the wallet page', () => {
        guard.canActivate().subscribe(() => {});

        expect(router.navigate).not.toHaveBeenCalled();
      });
    });

    describe('and the status is pending verification...', () => {
      beforeEach(() => {
        spyOn(router, 'navigate');
        spyOn(kycStatusService, 'get').and.returnValue(of(KYC_BANNER_SPECIFICATIONS(KYC_STATUS.PENDING_VERIFICATION)));
      });

      it(`should NOT be able to activate the KYC page`, () => {
        let result: boolean;

        guard.canActivate().subscribe((isVerificationNeed: boolean) => {
          result = isVerificationNeed;
        });

        expect(result).toBe(false);
      });

      it('should redirect to the wallet page', () => {
        guard.canActivate().subscribe(() => {});

        expect(router.navigate).toHaveBeenCalledWith([WALLET_URL]);
      });
    });

    describe('and the status is verified...', () => {
      beforeEach(() => {
        spyOn(router, 'navigate');
        spyOn(kycStatusService, 'get').and.returnValue(of(KYC_BANNER_SPECIFICATIONS(KYC_STATUS.VERIFIED)));
      });

      it(`should NOT be able to activate the KYC page`, () => {
        let result: boolean;

        guard.canActivate().subscribe((isVerificationNeed: boolean) => {
          result = isVerificationNeed;
        });

        expect(result).toBe(false);
      });

      it('should redirect to the wallet page', () => {
        guard.canActivate().subscribe(() => {});

        expect(router.navigate).toHaveBeenCalledWith([WALLET_URL]);
      });
    });

    describe('and the status is not need...', () => {
      beforeEach(() => {
        spyOn(router, 'navigate');
        spyOn(kycStatusService, 'get').and.returnValue(of(KYC_BANNER_SPECIFICATIONS(KYC_STATUS.NO_NEED)));
      });

      it(`should NOT be able to activate the KYC page`, () => {
        let result: boolean;

        guard.canActivate().subscribe((isVerificationNeed: boolean) => {
          result = isVerificationNeed;
        });

        expect(result).toBe(false);
      });

      it('should redirect to the wallet page', () => {
        guard.canActivate().subscribe(() => {});

        expect(router.navigate).toHaveBeenCalledWith([WALLET_URL]);
      });
    });
  });

  function KYC_BANNER_SPECIFICATIONS(kycBannerStatus: KYC_STATUS): KYCBannerSpecifications {
    return KYC_BANNER_TYPES.find((specification) => specification.status === kycBannerStatus);
  }
});
