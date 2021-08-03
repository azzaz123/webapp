import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { KYCImages } from '@private/features/wallet/interfaces/kyc/kyc-images.interface';
import { Observable } from 'rxjs';

export const KYC_ENDPOINT = `${environment.baseUrl}api/v3/payments/kyc/documents`;

@Injectable()
export class KYCService {
  constructor(private http: HttpClient) {}

  public request(KYCImages: KYCImages): Observable<any> {
    return this.http.post<any>(KYC_ENDPOINT, KYCImages);
  }
}
