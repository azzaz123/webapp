import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PhoneVerificationBodyRequest, VERIFICATION_TYPE } from '../dtos/requests';
import { EmailVerificationApi, UserVerificationsApi } from '../dtos/responses';
import { PhoneVerificationApi } from '../dtos/responses/phone-verification-api.interface';
import { EXTRA_INFO_ENDPOINT, SEND_VERIFY_EMAIL_ENDPOINT, SEND_VERIFY_PHONE_ENDPOINT } from './endpoints';

const SEND_VERIFY_EMAIL_BODY = '';

@Injectable()
export class UserVerificationsHttpService {
  public constructor(private httpClient: HttpClient) {}

  public get(): Observable<UserVerificationsApi> {
    return this.httpClient.get<UserVerificationsApi>(EXTRA_INFO_ENDPOINT);
  }

  public sendVerifyEmail(): Observable<EmailVerificationApi> {
    return this.httpClient.post<EmailVerificationApi>(SEND_VERIFY_EMAIL_ENDPOINT, SEND_VERIFY_EMAIL_BODY);
  }

  public sendVerifyPhone(mobileNumber: string, code: string, type = VERIFICATION_TYPE.PHONE): Observable<PhoneVerificationApi> {
    const body: PhoneVerificationBodyRequest = { mobileNumber, code, type };

    return this.httpClient.post<PhoneVerificationApi>(SEND_VERIFY_PHONE_ENDPOINT, body);
  }
}
