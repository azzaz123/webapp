import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { KYCStatus } from '@private/features/wallet/interfaces/kyc/kyc-status.interface';
import { Observable } from 'rxjs';
export const KYC_STATUS_API_URL = `${environment.baseUrl}api/v3/payments/kyc`;

@Injectable()
export class KYCStatusApiService {
  constructor(private http: HttpClient) {}

  public get(): Observable<KYCStatus> {
    return this.http.get<KYCStatus>(KYC_STATUS_API_URL);
  }
}
