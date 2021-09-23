import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { KYCProperties } from '@api/core/model/kyc-properties/interfaces/kyc-properties.interface';
import { KYCPropertiesService } from '@api/payments/kyc-properties/kyc-properties.service';
import { Observable } from 'rxjs';

@Injectable()
export class WalletResolver implements Resolve<KYCProperties> {
  constructor(private kycPropertiesService: KYCPropertiesService) {}

  resolve(): Observable<KYCProperties> {
    return this.kycPropertiesService.get();
  }
}
