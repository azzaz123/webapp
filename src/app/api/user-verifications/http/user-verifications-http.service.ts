import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PhoneVerificationBodyRequest, VERIFICATION_TYPE } from '../dtos/requests';
import { EmailVerificationApi, UserVerificationsApi } from '../dtos/responses';
import { PhoneVerificationApi } from '../dtos/responses/phone-verification-api.interface';
import { EXTRA_INFO_ENDPOINT, SEND_VERIFY_EMAIL_ENDPOINT, SEND_VERIFY_PHONE_ENDPOINT, VERIFY_USER_ENDPOINT } from './endpoints';

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

  public sendVerifyPhone(phoneNumber: string, type = VERIFICATION_TYPE.PHONE, code = null): Observable<PhoneVerificationApi> {
    const body: PhoneVerificationBodyRequest = { mobileNumber: phoneNumber, code, type };

    return this.httpClient.post<PhoneVerificationApi>(SEND_VERIFY_PHONE_ENDPOINT, body);
  }

  public sendVerifyUserIdentity(smsCode: string, type = VERIFICATION_TYPE.PHONE, mobileNumber = null): Observable<PhoneVerificationApi> {
    const body: PhoneVerificationBodyRequest = { code: smsCode, type, mobileNumber };

    return this.httpClient.post<PhoneVerificationApi>(VERIFY_USER_ENDPOINT, body);
  }
}
