import { Injectable } from '@angular/core';
import { KYCImages } from '@private/features/wallet/interfaces/kyc/kyc-images.interface';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { KYCErrorResponseApi } from './dtos/errors';
import { KYCHttpService } from './http/kyc-http.service';
import { KYCErrorMapper } from './mappers/errors/kyc-error-mapper';

@Injectable()
export class KYCService {
  private errorMapper: KYCErrorMapper = new KYCErrorMapper();

  constructor(private KYCHttpService: KYCHttpService) {}

  public request(KYCImages: KYCImages): Observable<any> {
    return this.KYCHttpService.request(KYCImages).pipe(catchError((error: KYCErrorResponseApi) => this.errorMapper.map(error)));
  }
}
