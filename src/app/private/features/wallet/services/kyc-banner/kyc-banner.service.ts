import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { KYC_BANNER_TYPES } from '../../components/kyc-banner/kyc-banner-constants';
import { KYCStatus, KYCBannerSpecifications, KYC_STATUS } from '../../interfaces/kyc/kyc-status.interface';
import { KYCStatusApiService } from '../api/kyc-status-api.service';

@Injectable()
export class KYCBannerService {
  constructor(private KYCStatusApiService: KYCStatusApiService) {}

  public getSpecifications(): Observable<KYCBannerSpecifications | null> {
    return this.KYCStatusApiService.get().pipe(
      map((KYCStatus: KYCStatus) => {
        return KYCStatus.status === KYC_STATUS.NO_NEED
          ? null
          : KYC_BANNER_TYPES.find((specification) => specification.status === KYCStatus.status);
      })
    );
  }
}
