import { Injectable } from '@angular/core';
import { KYCImages } from '@private/features/wallet/interfaces/kyc/kyc-images.interface';
import { Observable } from 'rxjs';
import { KYCHttpService } from './http/kyc-http.service';

@Injectable()
export class KYCService {
  constructor(private KYCHttpService: KYCHttpService) {}

  public request(KYCImages: KYCImages): Observable<any> {
    return this.KYCHttpService.request(KYCImages);
  }
}
