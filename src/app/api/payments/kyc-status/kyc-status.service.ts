import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { KYCStatus } from '@api/core/model/kyc/kyc-status.interface';
import { KYCBannerSpecifications } from '@api/core/model/kyc/kyc-banner-specifications.interface';
import { KYC_STATUS_STATES } from '@api/core/model/kyc/kyc-status-states.enum';
import { mapKYCStatusApiToKYCStatus } from '@api/payments/kyc/mappers/responses/kyc-status.mapper';
import { KYCStatusApiService } from '@private/features/wallet/services/api/kyc-status-api/kyc-status-api.service';
import { KYCStatusApi } from './dtos/responses';
import { KYC_BANNER_TYPES } from '@api/core/model/kyc/kyc-banner-constants';

@Injectable()
export class KYCStatusService {
  private readonly KYCStatusSubject: ReplaySubject<KYCStatus> = new ReplaySubject<KYCStatus>(1);

  constructor(private kycStatusApiService: KYCStatusApiService) {}

  public get(cache = true): Observable<KYCStatus> {
    if (cache && this.KYCStatusSubject) {
      return this.KYCStatusSubject.asObservable();
    }

    return this.kycStatusApiService.get().pipe(map((KYCStatusApi: KYCStatusApi) => mapKYCStatusApiToKYCStatus(KYCStatusApi)));
  }

  public getBannerSpecifications(cache = true): Observable<KYCBannerSpecifications> {
    return this.get(cache).pipe(
      map((KYCStatus: KYCStatus) => {
        return KYCStatus.status === KYC_STATUS_STATES.NO_NEED
          ? null
          : KYC_BANNER_TYPES.find((specification: KYCBannerSpecifications) => specification.status === KYCStatus.status);
      })
    );
  }
}
