import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { KYC_BANNER_TYPES } from '../../../../../api/core/model/kyc/kyc-banner-constants';
import { KYCStatusApi } from '../../../../../api/payments/kyc/dtos/responses/kyc-status-api.interface';
import { KYCStatusApiService } from '../api/kyc-status-api/kyc-status-api.service';
import { KYCStatus } from '@api/core/model/kyc/kyc-status.interface';
import { KYCBannerSpecifications } from '@api/core/model/kyc/kyc-banner-specifications.interface';
import { KYC_STATUS_STATES } from '@api/core/model/kyc/kyc-status-states.enum';
import { mapKYCStatusApiToKYCStatus } from '@api/payments/kyc/mappers/responses/kyc-status.mapper';

@Injectable()
export class KYCStatusService {
  constructor(private kycStatusApiService: KYCStatusApiService) {}

  public getSpecifications(): Observable<KYCStatus> {
    return this.kycStatusApiService.get().pipe(map((KYCStatusApi: KYCStatusApi) => mapKYCStatusApiToKYCStatus(KYCStatusApi)));
  }

  public mapSpecificationsToBannerSpecifications(KYCStatus: KYCStatus): KYCBannerSpecifications {
    return KYCStatus.status === KYC_STATUS_STATES.NO_NEED
      ? null
      : KYC_BANNER_TYPES.find((specification: KYCBannerSpecifications) => specification.status === KYCStatus.status);
  }
}
