import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import { KYCBanner } from '../../interfaces/kyc/kyc-banner.interface';
export const KYC_BANNER_STATUS_API_URL = `${environment.baseUrl}api/v3/delivery/kyc/banner`;

@Injectable()
export class KycBannerApiService {
  constructor(private http: HttpClient) {}

  public getKYCBanner(): Observable<KYCBanner> {
    return this.http.get<KYCBanner>(KYC_BANNER_STATUS_API_URL);
  }
}
