import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { KYCProperties } from '@api/core/model/kyc-properties/interfaces/kyc-properties.interface';
import { KYC_STATUS } from '@api/core/model/kyc-properties/kyc-status.enum';
import { KYCPropertiesService } from '@api/payments/kyc-properties/kyc-properties.service';
import { PRIVATE_PATHS } from '@private/private-routing-constants';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable()
export class KYCGuard implements CanActivate {
  constructor(private kycPropertiesService: KYCPropertiesService, private router: Router) {}

  public canActivate(): Observable<boolean> {
    return this.kycPropertiesService.get().pipe(
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
