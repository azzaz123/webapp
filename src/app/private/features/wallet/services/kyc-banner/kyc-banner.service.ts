import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { KYC_BANNER_TYPES } from '../../components/kyc-banner/kyc-banner-constants';
import { KYCBanner, KYCBannerSpecifications } from '../../interfaces/kyc/kyc-banner.interface';
import { KycBannerApiService } from '../api/kyc-banner-api.service';

@Injectable()
export class KycBannerService {
  constructor(private kycBannerApiService: KycBannerApiService) {}

  public getSpecifications(): Observable<KYCBannerSpecifications> {
    return this.kycBannerApiService
      .getKYCBanner()
      .pipe(map((kycBanner: KYCBanner) => KYC_BANNER_TYPES.find((specification) => specification.status === kycBanner.status)));
  }
}
