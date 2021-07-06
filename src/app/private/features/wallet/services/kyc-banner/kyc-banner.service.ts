import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { KYC_BANNER_TYPES } from '../../components/kyc-banner/kyc-banner-constants';
import { KYCBanner, KYCBannerSpecifications, KYC_BANNER_STATUS } from '../../interfaces/kyc/kyc-banner.interface';
import { KycBannerApiService } from '../api/kyc-banner-api.service';

@Injectable()
export class KycBannerService {
  constructor(private kycBannerApiService: KycBannerApiService) {}

  public getSpecifications(): Observable<KYCBannerSpecifications | null> {
    return this.kycBannerApiService.getKYCBanner().pipe(
      map((KYCBanner: KYCBanner) => {
        return KYCBanner.status === KYC_BANNER_STATUS.NO_NEED
          ? null
          : KYC_BANNER_TYPES.find((specification) => specification.status === KYCBanner.status);
      })
    );
  }
}
