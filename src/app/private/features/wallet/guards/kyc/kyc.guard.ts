import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { KYC_STATUS_STATES } from '@api/core/model/kyc/kyc-status-states.enum';
import { KYCStatus } from '@api/core/model/kyc/kyc-status.interface';
import { KYCStatusService } from '@private/features/wallet/services/kyc-status/kyc-status.service';
import { PRIVATE_PATHS } from '@private/private-routing-constants';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable()
export class KYCGuard implements CanActivate {
  constructor(private kycStatusService: KYCStatusService, private router: Router) {}

  public canActivate(): Observable<boolean> {
    return this.kycStatusService.getSpecifications().pipe(
      map((specifications: KYCStatus) => this.isVerificationNeeded(specifications)),
      tap((isVerificationNeeded: boolean) => {
        if (!isVerificationNeeded) {
          this.router.navigate([PRIVATE_PATHS.WALLET]);
        }
      })
    );
  }

  private isVerificationNeeded(specifications: KYCStatus): boolean {
    return specifications?.status === KYC_STATUS_STATES.PENDING || specifications?.status === KYC_STATUS_STATES.REJECTED;
  }
}
