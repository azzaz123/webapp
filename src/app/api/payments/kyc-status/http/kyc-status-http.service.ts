import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { KYCStatusApi } from '../../kyc-status/dtos/responses';
import { KYC_STATUS_ENDPOINT } from './endpoints';

@Injectable()
export class KYCStatusHttpService {
  constructor(private http: HttpClient) {}

  public get(): Observable<KYCStatusApi> {
    return this.http.get<KYCStatusApi>(KYC_STATUS_ENDPOINT);
  }
}
