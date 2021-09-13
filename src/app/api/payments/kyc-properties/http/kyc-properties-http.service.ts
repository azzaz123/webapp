import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { KYCPropertiesApi } from '../dtos/responses';
import { KYC_PROPERTIES_ENDPOINT } from './endpoints';

@Injectable()
export class KYCPropertiesHttpService {
  constructor(private http: HttpClient) {}

  public get(): Observable<KYCPropertiesApi> {
    return this.http.get<KYCPropertiesApi>(KYC_PROPERTIES_ENDPOINT);
  }
}
