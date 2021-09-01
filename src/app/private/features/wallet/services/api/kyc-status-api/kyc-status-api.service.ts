import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { KYCStatusApi } from '@private/features/wallet/interfaces/kyc/kyc-status-api.interface';
import { Observable } from 'rxjs';
export const KYC_STATUS_API_URL = `${environment.baseUrl}api/v3/payments/kyc`;

@Injectable()
export class KYCStatusApiService {
  constructor(private http: HttpClient) {}

  public get(): Observable<KYCStatusApi> {
    return this.http.get<KYCStatusApi>(KYC_STATUS_API_URL);
  }
}
