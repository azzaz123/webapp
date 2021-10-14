import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EmailVerificationApi, UserVerificationsApi } from '../dtos';
import { EXTRA_INFO_ENDPOINT, SEND_VERIFY_EMAIL_ENDPOINT } from './endpoints';

@Injectable()
export class UserVerificationsHttpService {
  public constructor(private httpClient: HttpClient) {}

  public get(): Observable<UserVerificationsApi> {
    return this.httpClient.get<UserVerificationsApi>(EXTRA_INFO_ENDPOINT);
  }

  public sendVerifyEmail(body: string = ''): Observable<EmailVerificationApi> {
    return this.httpClient.post<EmailVerificationApi>(SEND_VERIFY_EMAIL_ENDPOINT, body);
  }
}
