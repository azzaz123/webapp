import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { REQUEST_KYC_ENDPOINT } from './endpoints';

@Injectable()
export class KYCHttpService {
  constructor(private http: HttpClient) {}

  public request(body: FormData): Observable<void> {
    return this.http.post<void>(REQUEST_KYC_ENDPOINT, body, { responseType: 'text' as 'json' });
  }
}
