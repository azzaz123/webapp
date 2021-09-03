import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { KYCBannerSpecifications } from '@api/core/model/kyc-properties/kyc-banner-specifications.interface';
import { KYC_STATUS } from '@api/core/model/kyc-properties/kyc-status.enum';
import { KYCStatusApiService } from '@private/features/wallet/services/api/kyc-status-api/kyc-status-api.service';
import { KYCPropertiesApi } from './dtos/responses';
import { KYC_BANNER_TYPES } from '@api/core/model/kyc-properties/kyc-banner-constants';
import { KYCProperties } from '@api/core/model/kyc-properties/kyc-properties.interface';
import { mapKYCPropertiesApiToKYCProperties } from '../kyc/mappers/responses/kyc-properties.mapper';

@Injectable()
export class KYCPropertiesService {
  private readonly KYCPropertiesSubject: ReplaySubject<KYCProperties> = new ReplaySubject<KYCProperties>(1);

  constructor(private kycStatusApiService: KYCStatusApiService) {}

  public get(cache = true): Observable<KYCProperties> {
    if (cache && this.KYCPropertiesSubject) {
      return this.KYCPropertiesSubject.asObservable();
    }

    return this.kycStatusApiService
      .get()
      .pipe(map((KYCPropertiesApi: KYCPropertiesApi) => mapKYCPropertiesApiToKYCProperties(KYCPropertiesApi)));
  }

  public getBannerSpecifications(cache = true): Observable<KYCBannerSpecifications> {
    return this.get(cache).pipe(
      map((properties: KYCProperties) => {
        return properties.status === KYC_STATUS.NO_NEED
          ? null
          : KYC_BANNER_TYPES.find((banner: KYCBannerSpecifications) => banner.status === properties.status);
      })
    );
  }
}
