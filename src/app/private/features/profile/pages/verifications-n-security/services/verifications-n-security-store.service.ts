import { Injectable } from '@angular/core';
import { UserVerifications } from '@api/core/model/verifications';
import { UserVerificationsService } from '@api/user-verifications/user-verifications.service';
import { UserService } from '@core/user/user.service';
import { parsePhoneNumber } from 'libphonenumber-js';
import { Observable, ReplaySubject } from 'rxjs';
import { take } from 'rxjs/operators';
import { UserInformation } from './user-information.interface';

@Injectable()
export class VerificationsNSecurityStore {
  private _userVerifications: UserVerifications;
  private _userInformation: UserInformation;
  private readonly _userVerifications$: ReplaySubject<UserVerifications> = new ReplaySubject<UserVerifications>(1);
  private readonly _userInformation$: ReplaySubject<UserInformation> = new ReplaySubject<UserInformation>(1);

  constructor(private userVerificationsService: UserVerificationsService, private userService: UserService) {}

  get userVerifications$(): Observable<UserVerifications> {
    return this._userVerifications$.asObservable();
  }

  get userInformation$(): Observable<UserInformation> {
    return this._userInformation$.asObservable();
  }

  private get userVerifications(): UserVerifications {
    return this._userVerifications;
  }

  private get userInformation(): UserInformation {
    return this._userInformation;
  }

  private set userInformation(userInformation: UserInformation) {
    this._userInformation = userInformation;
    this._userInformation$.next(userInformation);
  }

  private set userVerifications(userVerifications: UserVerifications) {
    this._userVerifications = userVerifications;
    this._userVerifications$.next(userVerifications);
  }

  public initializeUserVerifications(): void {
    this.userVerificationsService
      .getVerifications()
      .pipe(take(1))
      .subscribe((userVerifications: UserVerifications) => {
        this.userVerifications = userVerifications;
        this.userInformation = {
          email: this.userService.user.email,
          phone: this.getPhoneNumber(this.userService.user.phone),
        };
      });
  }

  public verifiedPhone(phoneNumber: string): void {
    this.userVerifications = { ...this.userVerifications, phone: true };
    this.userInformation = { ...this.userInformation, phone: parsePhoneNumber(phoneNumber).format('INTERNATIONAL') };
  }

  private getPhoneNumber(phoneNumber: string): string {
    return this.userVerifications.phone ? parsePhoneNumber(phoneNumber).format('INTERNATIONAL') : '';
  }
}
