import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { KYCBannerSpecifications, KYC_BANNER_STATUS } from '@private/features/wallet/interfaces/kyc/kyc-banner.interface';
import { KYCBannerService } from '@private/features/wallet/services/kyc-banner/kyc-banner.service';
import { PRIVATE_PATHS } from '@private/private-routing-constants';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable()
export class KycGuard implements CanActivate {
  constructor(private kycBannerService: KYCBannerService, private router: Router) {}

  public canActivate(): Observable<boolean> {
    return this.kycBannerService.getSpecifications().pipe(
      map((specifications: KYCBannerSpecifications) => this.isVerificationNeeded(specifications)),
      tap((isVerificationNeeded: boolean) => {
        if (!isVerificationNeeded) {
          this.router.navigate([PRIVATE_PATHS.WALLET]);
        }
      })
    );
  }

  private isVerificationNeeded(specifications: KYCBannerSpecifications): boolean {
    return specifications?.status === KYC_BANNER_STATUS.PENDING || specifications?.status === KYC_BANNER_STATUS.REJECTED;
  }
}
