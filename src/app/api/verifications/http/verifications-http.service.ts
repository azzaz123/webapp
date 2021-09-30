import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserVerificationsApi } from '../dtos';
import { EXTRA_INFO_ENDPOINT } from './endpoints';

@Injectable()
export class VerificationsHttpService {
  public constructor(private httpClient: HttpClient) {}

  public get(): Observable<UserVerificationsApi> {
    return this.httpClient.get<UserVerificationsApi>(EXTRA_INFO_ENDPOINT);
  }
}
