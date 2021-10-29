import { Injectable } from '@angular/core';
import { UserVerifications, Verification } from '@api/core/model/verifications';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserVerificationsHttpService } from './http/user-verifications-http.service';
import { mapEmailVerificationApiToEmailVerification } from './mappers/email-verification.mapper';
import { mapPhoneVerificationApiToVerification } from './mappers/phone-verification.mapper';
import { mapUserVerificationsApiToUserVerifications } from './mappers/user-verifications.mapper';

@Injectable()
export class UserVerificationsService {
  constructor(private userVerificationsHttpService: UserVerificationsHttpService) {}

  public get userVerifications$(): Observable<UserVerifications> {
    return this.userVerificationsHttpService.get().pipe(map(mapUserVerificationsApiToUserVerifications));
  }

  public verifyEmail(): Observable<Verification> {
    return this.userVerificationsHttpService.sendVerifyEmail().pipe(map(mapEmailVerificationApiToEmailVerification));
  }

  public verifyPhone(phone: string, code: string): Observable<Verification> {
    return this.userVerificationsHttpService.sendVerifyPhone(phone, code).pipe(map(mapPhoneVerificationApiToVerification));
  }
}
