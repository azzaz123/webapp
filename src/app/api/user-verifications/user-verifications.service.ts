import { Injectable } from '@angular/core';
import { UserVerifications, VERIFICATION_STATUS } from '@api/core/model/verifications';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserVerificationsHttpService } from './http/user-verifications-http.service';
import { mapEmailVerificationApiToVerificationStatus } from './mappers/email-verification.mapper';
import { mapPhoneVerificationApiToVerificationStatus } from './mappers/phone-verification.mapper';
import { mapUserVerificationsApiToUserVerifications } from './mappers/user-verifications.mapper';

@Injectable()
export class UserVerificationsService {
  constructor(private userVerificationsHttpService: UserVerificationsHttpService) {}

  public getVerifications(): Observable<UserVerifications> {
    return this.userVerificationsHttpService.get().pipe(map(mapUserVerificationsApiToUserVerifications));
  }

  public verifyEmail(): Observable<VERIFICATION_STATUS> {
    return this.userVerificationsHttpService.sendVerifyEmail().pipe(map(mapEmailVerificationApiToVerificationStatus));
  }

  public verifyPhone(phoneNumber: string): Observable<VERIFICATION_STATUS> {
    return this.userVerificationsHttpService.sendVerifyPhone(phoneNumber).pipe(map(mapPhoneVerificationApiToVerificationStatus));
  }

  public verifySmsCode(smsCode: string): Observable<VERIFICATION_STATUS> {
    return this.userVerificationsHttpService.sendVerifyUserIdentity(smsCode).pipe(map(mapPhoneVerificationApiToVerificationStatus));
  }
}
