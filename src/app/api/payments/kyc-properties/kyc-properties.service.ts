import { Injectable } from '@angular/core';
import { Observable, of, ReplaySubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { KYC_STATUS } from '@api/core/model/kyc-properties/kyc-status.enum';
import { KYCPropertiesApi } from './dtos/responses';
import { KYC_BANNER_TYPES } from '@api/core/model/kyc-properties/constants/kyc-banner-constants';
import { mapKYCPropertiesApiToKYCProperties } from '../kyc/mappers/responses/kyc-properties.mapper';
import { KYCProperties } from '@api/core/model/kyc-properties/interfaces/kyc-properties.interface';
import { KYCBannerSpecifications } from '@api/core/model/kyc-properties/interfaces/kyc-banner-specifications.interface';
import { KYCPropertiesHttpService } from './http/kyc-properties-http.service';

@Injectable()
export class KYCPropertiesService {
  private readonly KYCPropertiesSubject: ReplaySubject<KYCProperties> = new ReplaySubject<KYCProperties>(1);

  constructor(private KYCPropertiesHttpService: KYCPropertiesHttpService) {}

  public get KYCProperties$(): Observable<KYCProperties> {
    return this.KYCPropertiesSubject.asObservable();
  }

  private set KYCProperties(KYCProperties: KYCProperties) {
    this.KYCPropertiesSubject.next(KYCProperties);
  }

  public get(): Observable<KYCProperties> {
    return this.KYCPropertiesHttpService.get().pipe(
      map((KYCPropertiesApi: KYCPropertiesApi) => mapKYCPropertiesApiToKYCProperties(KYCPropertiesApi)),
      tap((properties: KYCProperties) => (this.KYCProperties = properties))
    );
  }

  public getBannerSpecificationsFromProperties(properties: KYCProperties): Observable<KYCBannerSpecifications> {
    const bannerSpecification: KYCBannerSpecifications =
      properties.status === KYC_STATUS.NO_NEED
        ? null
        : KYC_BANNER_TYPES.find((banner: KYCBannerSpecifications) => banner.status === properties.status);

    return of(bannerSpecification);
  }
}
