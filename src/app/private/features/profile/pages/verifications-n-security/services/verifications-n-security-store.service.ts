import { Injectable } from '@angular/core';
import { UserVerifications } from '@api/core/model/verifications';
import { UserVerificationsService } from '@api/user-verifications/user-verifications.service';
import { UserService } from '@core/user/user.service';
import { parsePhoneNumber } from 'libphonenumber-js';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { UserInformation } from './user-information.interface';

@Injectable()
export class VerificationsNSecurityStore {
  private readonly _userVerifications: BehaviorSubject<UserVerifications> = new BehaviorSubject<UserVerifications>(null);
  private readonly _userInfomation: BehaviorSubject<UserInformation> = new BehaviorSubject<UserInformation>(null);

  constructor(private userVerificationsService: UserVerificationsService, private userService: UserService) {}

  get userVerifications(): UserVerifications {
    return this._userVerifications.getValue();
  }

  get userVerifications$(): Observable<UserVerifications> {
    return this._userVerifications.asObservable();
  }

  set userVerifications(userVerifications: UserVerifications) {
    this._userVerifications.next(userVerifications);
  }

  get userInformation(): UserInformation {
    return this._userInfomation.getValue();
  }

  get userInformation$(): Observable<UserInformation> {
    return this._userInfomation.asObservable();
  }

  set userInformation(userInformation: UserInformation) {
    this._userInfomation.next(userInformation);
  }

  public getUserVerifications(): Observable<UserVerifications> {
    return this.userVerificationsService.getVerifications().pipe(
      tap((userVerifications: UserVerifications) => {
        this.userVerifications = { ...userVerifications };
        this.userInformation = {
          email: this.userService.user.email,
          phone: this.getPhoneNumber(this.userService.user.phone),
        };
      })
    );
  }

  public verifiedPhone(phoneNumber: string): void {
    this.userVerifications = { ...this.userVerifications, phone: true };
    this.userInformation = { ...this.userInformation, phone: parsePhoneNumber(phoneNumber).format('INTERNATIONAL') };
  }

  private getPhoneNumber(phoneNumber: string): string {
    return this.userVerifications.phone ? parsePhoneNumber(phoneNumber).format('INTERNATIONAL') : '';
  }
}
