import { Component } from '@angular/core';
import { UserVerifications } from '@api/core/model/verifications';
import { UserVerificationsService } from '@api/user-verifications/user-verifications.service';
import { User } from '@core/user/user';
import { UserService } from '@core/user/user.service';
import { Observable } from 'rxjs';

export enum VERIFICATIONS_N_SECURITY_TYPES {
  EMAIL = 'e-mail',
}

@Component({
  selector: 'tsl-verifications-n-security',
  templateUrl: './verifications-n-security.component.html',
  styleUrls: ['./verifications-n-security.component.scss'],
})
export class VerificationsNSecurityComponent {
  public userVerifications$: Observable<UserVerifications>;
  public user: User;
  public readonly VERIFICATIONS_N_SECURITY_TYPES = VERIFICATIONS_N_SECURITY_TYPES;
  public readonly titleVerifications = {
    [VERIFICATIONS_N_SECURITY_TYPES.EMAIL]: $localize`:@@verification_and_security_all_users_verifications_email_label:E-mail`,
  };

  constructor(private userService: UserService, private userVerificationsService: UserVerificationsService) {
    this.userVerifications$ = this.userVerificationsService.userVerifications$;
  }

  ngOnInit(): void {
    this.user = this.userService.user;
  }

  onClickButton(): void {}

  public getTitleVerification(verificationsType: VERIFICATIONS_N_SECURITY_TYPES): string {
    return this.titleVerifications[verificationsType];
  }

  public getTextButton(isVerifiedAttribute: boolean): string {
    if (isVerifiedAttribute) {
      return $localize`:@@verification_and_security_all_users_change_button:Change`;
    }
    return $localize`:@@verification_and_security_all_users_verify_button:Verify`;
  }
}
