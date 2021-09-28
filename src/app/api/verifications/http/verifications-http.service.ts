import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { VerificationsApi } from '../dtos';
import { EXTRA_INFO_ENDPOINT } from './endpoints';

@Injectable()
export class VerificationsHttpService {
  public constructor(private httpClient: HttpClient) {}

  public get(): Observable<VerificationsApi> {
    return this.httpClient.get<VerificationsApi>(EXTRA_INFO_ENDPOINT);
  }
}
