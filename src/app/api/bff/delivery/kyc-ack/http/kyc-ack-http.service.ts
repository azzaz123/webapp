import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { KYC_ACK_ENDPOINT } from './endpoints';

@Injectable()
export class KYCAckHttpService {
  constructor(private http: HttpClient) {}

  public notify(): Observable<null> {
    return this.http.patch<null>(KYC_ACK_ENDPOINT, null);
  }
}
