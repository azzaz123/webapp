import { Injectable } from '@angular/core';
import { UserVerifications, UserVerifiedInfoStatus } from '@api/core/model/verifications';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserVerificationsHttpService } from './http/user-verifications-http.service';
import { mapEmailVerificationApiToUserVerifiedInfoStatus } from './mappers/email-verification.mapper';
import { mapPhoneVerificationApiToUserVerifiedInfoStatus } from './mappers/phone-verification.mapper';
import { mapUserVerificationsApiToUserVerifications } from './mappers/user-verifications.mapper';

@Injectable()
export class UserVerificationsService {
  constructor(private userVerificationsHttpService: UserVerificationsHttpService) {}

  public get userVerifications$(): Observable<UserVerifications> {
    return this.userVerificationsHttpService.get().pipe(map(mapUserVerificationsApiToUserVerifications));
  }

  public verifyEmail(): Observable<UserVerifiedInfoStatus> {
    return this.userVerificationsHttpService.sendVerifyEmail().pipe(map(mapEmailVerificationApiToUserVerifiedInfoStatus));
  }

  public verifyPhone(phone: string, code: string): Observable<UserVerifiedInfoStatus> {
    return this.userVerificationsHttpService.sendVerifyPhone(phone, code).pipe(map(mapPhoneVerificationApiToUserVerifiedInfoStatus));
  }
}
