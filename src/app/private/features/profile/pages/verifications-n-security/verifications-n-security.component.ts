import { Component, OnInit } from '@angular/core';
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
export class VerificationsNSecurityComponent implements OnInit {
  public userVerifications$: Observable<UserVerifications>;
  public user: User;
  public readonly VERIFICATIONS_N_SECURITY_TYPES = VERIFICATIONS_N_SECURITY_TYPES;
  public readonly titleVerifications = {
    [VERIFICATIONS_N_SECURITY_TYPES.EMAIL]: $localize`:@@verification_and_security_all_users_verifications_email_label:E-mail`,
  };
  public readonly verifiedTextButton = {
    true: $localize`:@@verification_and_security_all_users_change_button:Change`,
    false: $localize`:@@verification_and_security_all_users_verify_button:Verify`,
  };

  constructor(private userService: UserService, private userVerificationsService: UserVerificationsService) {
    this.userVerifications$ = this.userVerificationsService.userVerifications$;
  }

  ngOnInit(): void {
    this.user = this.userService.user;
  }

  onClickButton(): void {}
}
