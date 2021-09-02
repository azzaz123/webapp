import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { KYCStatusApi } from '../dtos/responses';
import { KYC_STATUS_ENDPOINT, REQUEST_KYC_ENDPOINT } from './endpoints';

@Injectable()
export class KYCHttpService {
  constructor(private http: HttpClient) {}

  public request(body: FormData): Observable<void> {
    return this.http.post<void>(REQUEST_KYC_ENDPOINT, body, { responseType: 'text' as 'json' });
  }

  public getStatus(): Observable<KYCStatusApi> {
    return this.http.get<KYCStatusApi>(KYC_STATUS_ENDPOINT);
  }
}
