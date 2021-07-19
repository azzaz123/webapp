import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { KYC_BANNER_TYPES } from '@private/features/wallet/components/kyc-banner/kyc-banner-constants';
import { KYCBannerSpecifications, KYC_BANNER_STATUS } from '@private/features/wallet/interfaces/kyc/kyc-banner.interface';
import { KYCBannerApiService } from '@private/features/wallet/services/api/kyc-banner-api.service';
import { KYCBannerService } from '@private/features/wallet/services/kyc-banner/kyc-banner.service';
import { PRIVATE_PATHS } from '@private/private-routing-constants';
import { of } from 'rxjs';

import { KYCGuard } from './kyc.guard';

describe('KYCGuard', () => {
  const WALLET_URL = PRIVATE_PATHS.WALLET;
  let guard: KYCGuard;
  let kycBannerService: KYCBannerService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        KYCGuard,
        KYCBannerService,
        KYCBannerApiService,
        {
          provide: Router,
          useValue: {
            navigate() {},
          },
        },
      ],
    });
    guard = TestBed.inject(KYCGuard);
    kycBannerService = TestBed.inject(KYCBannerService);
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  describe('when we check the KYC status banner specifications...', () => {
    describe('and the status is pending...', () => {
      beforeEach(() => {
        spyOn(router, 'navigate');
        spyOn(kycBannerService, 'getSpecifications').and.returnValue(of(KYC_BANNER_SPECIFICATIONS(KYC_BANNER_STATUS.PENDING)));
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

        spyOn(kycBannerService, 'getSpecifications').and.returnValue(of(KYC_BANNER_SPECIFICATIONS(KYC_BANNER_STATUS.REJECTED)));
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
        spyOn(kycBannerService, 'getSpecifications').and.returnValue(of(KYC_BANNER_SPECIFICATIONS(KYC_BANNER_STATUS.PENDING_VERIFICATION)));
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
        spyOn(kycBannerService, 'getSpecifications').and.returnValue(of(KYC_BANNER_SPECIFICATIONS(KYC_BANNER_STATUS.VERIFIED)));
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
        spyOn(kycBannerService, 'getSpecifications').and.returnValue(of(KYC_BANNER_SPECIFICATIONS(KYC_BANNER_STATUS.NO_NEED)));
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

  function KYC_BANNER_SPECIFICATIONS(kycBannerStatus: KYC_BANNER_STATUS): KYCBannerSpecifications {
    return KYC_BANNER_TYPES.find((specification) => specification.status === kycBannerStatus);
  }
});
