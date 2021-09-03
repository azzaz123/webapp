import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { KYCPropertiesApi } from '../../kyc-status/dtos/responses';
import { KYC_STATUS_ENDPOINT } from './endpoints';

@Injectable()
export class KYCStatusHttpService {
  constructor(private http: HttpClient) {}

  public get(): Observable<KYCPropertiesApi> {
    return this.http.get<KYCPropertiesApi>(KYC_STATUS_ENDPOINT);
  }
}
