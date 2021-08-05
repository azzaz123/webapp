import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { KYCImages } from '@private/features/wallet/interfaces/kyc/kyc-images.interface';
import { Observable } from 'rxjs';
import { KYC_ENDPOINT } from './endpoints';

@Injectable()
export class KYCHttpService {
  constructor(private http: HttpClient) {}

  public request(KYCImages: KYCImages): Observable<any> {
    return this.http.post<any>(KYC_ENDPOINT, {
      firstImage: KYCImages.frontSide,
      secondImage: KYCImages.backSide,
    });
  }
}
