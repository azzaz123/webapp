import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { KYCPropertiesApi } from '@api/payments/kyc-status/dtos/responses';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
export const KYC_PROPERTIES_API_URL = `${environment.baseUrl}api/v3/payments/kyc`;

@Injectable()
export class KYCStatusApiService {
  constructor(private http: HttpClient) {}

  public get(): Observable<KYCPropertiesApi> {
    return this.http.get<KYCPropertiesApi>(KYC_PROPERTIES_API_URL);
  }
}
