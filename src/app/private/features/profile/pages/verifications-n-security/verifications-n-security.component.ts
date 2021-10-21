import { Component, OnInit } from '@angular/core';
import { UserVerifications } from '@api/core/model/verifications';
import { UserVerificationsService } from '@api/user-verifications/user-verifications.service';
import { User } from '@core/user/user';
import { UserService } from '@core/user/user.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EmailModalComponent } from '@shared/profile/edit-email/email-modal/email-modal.component';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { EmailVerificationModalComponent } from '../../modal/email-verification-modal/email-verification-modal.component';
import { VerificationsNSecurityTrackingEventsService } from '../../services/verifications-n-security-tracking-events.service';

export enum VERIFICATIONS_N_SECURITY_TYPES {
  EMAIL,
}

type EmailModal = typeof EmailModalComponent | typeof EmailVerificationModalComponent;
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
    [VERIFICATIONS_N_SECURITY_TYPES.EMAIL]: $localize`:@@verification_and_security_all_users_verifications_email_label:Email`,
  };
  public readonly verifiedTextButton = {
    true: $localize`:@@verification_and_security_all_users_change_button:Change`,
    false: $localize`:@@verification_and_security_all_users_verify_button:Verify`,
  };

  constructor(
    private userService: UserService,
    private userVerificationsService: UserVerificationsService,
    private modalService: NgbModal,
    private verificationsNSecurityTrackingEventsService: VerificationsNSecurityTrackingEventsService
  ) {
    this.userVerifications$ = this.userVerificationsService.userVerifications$;
  }

  ngOnInit(): void {
    this.user = this.userService.user;
    this.userVerifications$.pipe(take(1)).subscribe((response: UserVerifications) => {
      this.verificationsNSecurityTrackingEventsService.verificationsNSecurityPageView(response);
    });
  }

  public onClickVerifyEmail(isVerifiedEmail: boolean): void {
    let modalRef: NgbModalRef;
    let modal: EmailModal = this.getEmailModal(isVerifiedEmail);

    modalRef = this.openEmailModal(modal);

    isVerifiedEmail ? (modalRef.componentInstance.currentEmail = this.user.email) : (modalRef.componentInstance.email = this.user.email);
  }

  private getEmailModal(isVerifiedEmail: boolean): EmailModal {
    return isVerifiedEmail ? EmailModalComponent : EmailVerificationModalComponent;
  }

  private openEmailModal(modal: EmailModal): NgbModalRef {
    return this.modalService.open(modal, {
      windowClass: 'modal-standard',
    });
  }
}
