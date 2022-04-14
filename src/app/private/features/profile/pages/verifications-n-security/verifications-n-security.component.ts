import { Component, OnInit } from '@angular/core';
import { UserVerifications, VERIFICATION_METHOD } from '@api/core/model/verifications';
import { UserVerificationsService } from '@api/user-verifications/user-verifications.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EmailModalComponent } from '@shared/profile/edit-email/email-modal/email-modal.component';
import { combineLatest } from 'rxjs';
import { EmailVerificationModalComponent } from '../../modal/email-verification/modals/email-verification-modal/email-verification-modal.component';
import { PhoneVerificationModalComponent } from '../../modal/phone-verification/modals/phone-verification-modal/phone-verification-modal.component';
import { VerificationsNSecurityTrackingEventsService } from '../../services/verifications-n-security-tracking-events.service';
import { UserVerificationsStatus } from './interfaces/user-verifications-status.interface';
import { VERIFICATIONS_N_SECURITY_STATUS } from './interfaces/verifications-n-security-status.enum';
import { VERIFICATIONS_N_SECURITY_TYPES } from './interfaces/verifications-n-security-types.enum';
import { UserInformation } from './services/user-information.interface';
import { VerificationsNSecurityStore } from './services/verifications-n-security-store.service';

type VerificationModalComponent =
  | typeof EmailModalComponent
  | typeof EmailVerificationModalComponent
  | typeof PhoneVerificationModalComponent;
@Component({
  selector: 'tsl-verifications-n-security',
  templateUrl: './verifications-n-security.component.html',
  styleUrls: ['./verifications-n-security.component.scss'],
})
export class VerificationsNSecurityComponent implements OnInit {
  public readonly VERIFICATIONS_N_SECURITY_TYPES = VERIFICATIONS_N_SECURITY_TYPES;
  public readonly titleVerificationsNSecurity: Record<VERIFICATIONS_N_SECURITY_TYPES, string> = {
    [VERIFICATIONS_N_SECURITY_TYPES.EMAIL]: $localize`:@@verification_and_security_all_users_verifications_email_label:Email`,
    [VERIFICATIONS_N_SECURITY_TYPES.PHONE]: $localize`:@@verification_and_security_all_users_verifications_phone_label:Mobile phone`,
    [VERIFICATIONS_N_SECURITY_TYPES.PASSWORD]: $localize`:@@verification_and_security_all_users_security_password_label:Password`,
  };

  public userInformation: UserInformation;
  public userVerificationsStatus: UserVerificationsStatus;

  constructor(
    private modalService: NgbModal,
    private verificationsNSecurityTrackingEventsService: VerificationsNSecurityTrackingEventsService,
    public verificationsNSecurityStore: VerificationsNSecurityStore
  ) {
    this.userVerificationsStatus = {
      [VERIFICATIONS_N_SECURITY_TYPES.EMAIL]: VERIFICATIONS_N_SECURITY_STATUS.NONE,
      [VERIFICATIONS_N_SECURITY_TYPES.PHONE]: VERIFICATIONS_N_SECURITY_STATUS.NONE,
      [VERIFICATIONS_N_SECURITY_TYPES.PASSWORD]: VERIFICATIONS_N_SECURITY_STATUS.NONE,
    };
  }

  ngOnInit(): void {
    this.verificationsNSecurityStore.initializeUserVerifications();

    combineLatest([this.verificationsNSecurityStore.userVerifications$, this.verificationsNSecurityStore.userInformation$]).subscribe(
      ([userVerifications, userInformation]: [UserVerifications, UserInformation]) => {
        this.verificationsNSecurityTrackingEventsService.verificationsNSecurityPageView(userVerifications);
        this.userInformation = userInformation;
        this.generateUserVerificationsStatus(userVerifications);
      }
    );
  }

  public onClickVerifyEmail(isVerifiedEmail: boolean): void {
    let modalRef: NgbModalRef;
    let modal: VerificationModalComponent = this.getEmailModal(isVerifiedEmail);
    const email: string = this.userInformation.email;

    modalRef = this.openModal(modal);

    if (isVerifiedEmail) {
      modalRef.componentInstance.currentEmail = email;
    } else {
      modalRef.componentInstance.email = email;

      this.verificationsNSecurityTrackingEventsService.trackClickVerificationOptionEvent(VERIFICATION_METHOD.EMAIL);
    }
  }

  public onClickVerifyPhone(): void {
    this.openModal(PhoneVerificationModalComponent);

    this.verificationsNSecurityTrackingEventsService.trackClickVerificationOptionEvent(VERIFICATION_METHOD.PHONE);
  }

  public onClickChangePassword(isVerifiedEmail: boolean): void {
    if (isVerifiedEmail) {
      // modal to send the email
    } else {
      // modal to confirm the flow of verify your email
    }
  }

  private getEmailModal(isVerifiedEmail: boolean): VerificationModalComponent {
    return isVerifiedEmail ? EmailModalComponent : EmailVerificationModalComponent;
  }

  private openModal(modal: VerificationModalComponent): NgbModalRef {
    return this.modalService.open(modal, {
      windowClass: 'modal-standard',
    });
  }

  private generateUserVerificationsStatus(userVerifications: UserVerifications): void {
    this.userVerificationsStatus[VERIFICATIONS_N_SECURITY_TYPES.EMAIL] = userVerifications.email
      ? VERIFICATIONS_N_SECURITY_STATUS.VERIFIED
      : VERIFICATIONS_N_SECURITY_STATUS.NOT_VERIFIED;
    this.userVerificationsStatus[VERIFICATIONS_N_SECURITY_TYPES.PHONE] = userVerifications.phone
      ? VERIFICATIONS_N_SECURITY_STATUS.VERIFIED
      : VERIFICATIONS_N_SECURITY_STATUS.NOT_VERIFIED;
  }
}
