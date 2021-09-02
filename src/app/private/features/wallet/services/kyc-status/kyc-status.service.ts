import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { KYC_BANNER_TYPES } from '../../components/kyc-banner/kyc-banner-constants';
import { KYCStatusApi } from '../../interfaces/kyc/kyc-status-api.interface';
import { KYCBannerSpecifications, KYCStatus, KYC_STATUS } from '../../interfaces/kyc/kyc-status.interface';
import { KYCStatusApiService } from '../api/kyc-status-api/kyc-status-api.service';
import { mapKYCStatusApiToKYCStatus } from '../api/kyc-status-api/mapper/kyc-status-mapper';

@Injectable()
export class KYCStatusService {
  constructor(private kycStatusApiService: KYCStatusApiService) {}

  public getSpecifications(): Observable<KYCStatus> {
    return this.kycStatusApiService.get().pipe(map((KYCStatusApi: KYCStatusApi) => mapKYCStatusApiToKYCStatus(KYCStatusApi)));
  }

  public mapSpecificationsToBannerSpecifications(KYCStatus: KYCStatus): KYCBannerSpecifications {
    return KYCStatus.status === KYC_STATUS.NO_NEED
      ? null
      : KYC_BANNER_TYPES.find((specification: KYCBannerSpecifications) => specification.status === KYCStatus.status);
  }
}
