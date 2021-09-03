import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { KYC_STATUS } from '@api/core/model/kyc-properties/kyc-status.enum';
import { KYCProperties } from '@api/core/model/kyc-properties/kyc-properties.interface';
import { KYCStatusService } from '@api/payments/kyc-status/kyc-status.service';
import { PRIVATE_PATHS } from '@private/private-routing-constants';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable()
export class KYCGuard implements CanActivate {
  constructor(private kycStatusService: KYCStatusService, private router: Router) {}

  public canActivate(): Observable<boolean> {
    return this.kycStatusService.get().pipe(
      map((properties: KYCProperties) => this.isVerificationNeeded(properties)),
      tap((isVerificationNeeded: boolean) => {
        if (!isVerificationNeeded) {
          this.router.navigate([PRIVATE_PATHS.WALLET]);
        }
      })
    );
  }

  private isVerificationNeeded(properties: KYCProperties): boolean {
    return properties?.status === KYC_STATUS.PENDING || properties?.status === KYC_STATUS.REJECTED;
  }
}
