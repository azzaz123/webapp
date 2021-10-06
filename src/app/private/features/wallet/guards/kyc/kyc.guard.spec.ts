import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { KYCPropertiesHttpService } from '@api/payments/kyc-properties/http/kyc-properties-http.service';
import { KYCPropertiesService } from '@api/payments/kyc-properties/kyc-properties.service';
import {
  MOCK_KYC_ERROR_PROPERTIES,
  MOCK_KYC_NO_NEED_PROPERTIES,
  MOCK_KYC_PENDING_PROPERTIES,
  MOCK_KYC_PENDING_VERIFICATION_PROPERTIES,
  MOCK_KYC_VERIFIED_PROPERTIES,
} from '@fixtures/private/wallet/kyc/kyc-properties.fixtures.spec';

import { PRIVATE_PATHS } from '@private/private-routing-constants';
import { of } from 'rxjs';

import { KYCGuard } from './kyc.guard';

describe('KYCGuard', () => {
  const WALLET_URL = PRIVATE_PATHS.WALLET;
  let guard: KYCGuard;
  let kycPropertiesService: KYCPropertiesService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        KYCGuard,
        KYCPropertiesService,
        KYCPropertiesHttpService,
        {
          provide: Router,
          useValue: {
            navigate() {},
          },
        },
      ],
    });
    guard = TestBed.inject(KYCGuard);
    kycPropertiesService = TestBed.inject(KYCPropertiesService);
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  describe('when we check the KYC status banner specifications...', () => {
    describe('and the KYC properties are already initialized', () => {
      beforeEach(() => {
        kycPropertiesService.arePropertiesInitialized = true;
        jest.spyOn(kycPropertiesService, 'KYCProperties$', 'get').mockReturnValue(of(MOCK_KYC_PENDING_PROPERTIES));
        spyOn(kycPropertiesService, 'get').and.returnValue(of(MOCK_KYC_PENDING_PROPERTIES));

        guard.canActivate().subscribe();
      });

      it('should NOT request the KYC properties', () => {
        expect(kycPropertiesService.get).not.toHaveBeenCalled();
      });
    });

    describe('and the KYC properties are NOT initialized', () => {
      beforeEach(() => {
        kycPropertiesService.arePropertiesInitialized = false;
        jest.spyOn(kycPropertiesService, 'KYCProperties$', 'get').mockReturnValue(of(MOCK_KYC_PENDING_PROPERTIES));
        spyOn(kycPropertiesService, 'get').and.returnValue(of(MOCK_KYC_PENDING_PROPERTIES));

        guard.canActivate().subscribe();
      });

      it('should request the KYC properties', () => {
        expect(kycPropertiesService.get).toHaveBeenCalledTimes(1);
      });
    });

    beforeEach(() => {
      kycPropertiesService.arePropertiesInitialized = true;
    });

    describe('and the status is pending...', () => {
      beforeEach(() => {
        spyOn(router, 'navigate');
        jest.spyOn(kycPropertiesService, 'KYCProperties$', 'get').mockReturnValue(of(MOCK_KYC_PENDING_PROPERTIES));
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

        jest.spyOn(kycPropertiesService, 'KYCProperties$', 'get').mockReturnValue(of(MOCK_KYC_ERROR_PROPERTIES));
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
        jest.spyOn(kycPropertiesService, 'KYCProperties$', 'get').mockReturnValue(of(MOCK_KYC_PENDING_VERIFICATION_PROPERTIES));
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
        jest.spyOn(kycPropertiesService, 'KYCProperties$', 'get').mockReturnValue(of(MOCK_KYC_VERIFIED_PROPERTIES));
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
        jest.spyOn(kycPropertiesService, 'KYCProperties$', 'get').mockReturnValue(of(MOCK_KYC_NO_NEED_PROPERTIES));
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
});
