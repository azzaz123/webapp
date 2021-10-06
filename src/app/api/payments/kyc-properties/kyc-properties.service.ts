import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, ReplaySubject, Subject, timer } from 'rxjs';
import { map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { KYCPropertiesApi } from './dtos/responses';
import { KYC_BANNER_TYPES } from '@api/core/model/kyc-properties/constants/kyc-banner-constants';
import { mapKYCPropertiesApiToKYCProperties } from '../kyc/mappers/responses/kyc-properties.mapper';
import { KYCProperties } from '@api/core/model/kyc-properties/interfaces/kyc-properties.interface';
import { KYCBannerSpecifications } from '@api/core/model/kyc-properties/interfaces/kyc-banner-specifications.interface';
import { KYCPropertiesHttpService } from './http/kyc-properties-http.service';
import { KYC_STATUS } from '@api/core/model/kyc-properties/kyc-status.enum';

@Injectable()
export class KYCPropertiesService {
  private readonly KYCStatusIsNoNeededSubject: Subject<void> = new Subject();
  private readonly KYCPropertiesSubject: ReplaySubject<KYCProperties> = new ReplaySubject<KYCProperties>(1);
  private readonly arePropertiesInitializedSubject: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private KYCPropertiesHttpService: KYCPropertiesHttpService) {}

  public get KYCProperties$(): Observable<KYCProperties> {
    return this.KYCPropertiesSubject.asObservable();
  }

  public get arePropertiesInitialized(): boolean {
    return this.arePropertiesInitializedSubject.value;
  }

  private set KYCProperties(KYCProperties: KYCProperties) {
    this.KYCPropertiesSubject.next(KYCProperties);
  }

  public get(isPetitionFromGuard = false): Observable<KYCProperties> {
    const secondsPeriod = 15 * 1000;

    return timer(0, secondsPeriod).pipe(
      switchMap(() => this.KYCPropertiesHttpService.get()),
      map((KYCPropertiesApi: KYCPropertiesApi) => mapKYCPropertiesApiToKYCProperties(KYCPropertiesApi)),
      tap((properties: KYCProperties) => {
        this.KYCProperties = properties;
        if (!isPetitionFromGuard) {
          this.arePropertiesInitializedSubject.next(true);
        }

        if (properties.status === KYC_STATUS.NO_NEED) {
          this.KYCStatusIsNoNeededSubject.next();
        }
      }),
      takeUntil(this.KYCStatusIsNoNeededSubject)
    );
  }

  public getBannerSpecificationsFromProperties(properties: KYCProperties): Observable<KYCBannerSpecifications> {
    const bannerSpecification: KYCBannerSpecifications = KYC_BANNER_TYPES.find(
      (banner: KYCBannerSpecifications) => banner.status === properties.status
    );

    return of(bannerSpecification);
  }
}
