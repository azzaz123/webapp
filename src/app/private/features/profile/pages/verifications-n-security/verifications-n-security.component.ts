import { Component, OnInit } from '@angular/core';
import { UserVerifications, VERIFICATION_METHOD } from '@api/core/model/verifications';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EmailModalComponent } from '@shared/profile/edit-email/email-modal/email-modal.component';
import { take } from 'rxjs/operators';
import { EmailVerificationModalComponent } from '../../modal/email-verification/modals/email-verification-modal/email-verification-modal.component';
import { PhoneVerificationModalComponent } from '../../modal/phone-verification/modals/phone-verification-modal/phone-verification-modal.component';
import { VerificationsNSecurityTrackingEventsService } from '../../services/verifications-n-security-tracking-events.service';
import { VerificationsNSecurityStore } from './services/verifications-n-security-store.service';

export enum VERIFICATIONS_N_SECURITY_TYPES {
  EMAIL,
  PHONE,
}

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
  public readonly titleVerifications = {
    [VERIFICATIONS_N_SECURITY_TYPES.EMAIL]: $localize`:@@verification_and_security_all_users_verifications_email_label:Email`,
    [VERIFICATIONS_N_SECURITY_TYPES.PHONE]: $localize`:@@verification_and_security_all_users_verifications_phone_label:Mobile phone`,
  };
  public readonly verifiedTextButton = {
    true: $localize`:@@verification_and_security_all_users_change_button:Change`,
    false: $localize`:@@verification_and_security_all_users_verify_button:Verify`,
  };

  constructor(
    private modalService: NgbModal,
    private verificationsNSecurityTrackingEventsService: VerificationsNSecurityTrackingEventsService,
    public verificationsNSecurityStore: VerificationsNSecurityStore
  ) {}

  ngOnInit(): void {
    this.verificationsNSecurityStore
      .getUserVerifications()
      .pipe(take(1))
      .subscribe((userVerifications: UserVerifications) => {
        this.verificationsNSecurityTrackingEventsService.verificationsNSecurityPageView(userVerifications);
      });
  }

  public onClickVerifyEmail(isVerifiedEmail: boolean): void {
    let modalRef: NgbModalRef;
    let modal: VerificationModalComponent = this.getEmailModal(isVerifiedEmail);
    const email: string = this.verificationsNSecurityStore.userInformation.email;

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

  private getEmailModal(isVerifiedEmail: boolean): VerificationModalComponent {
    return isVerifiedEmail ? EmailModalComponent : EmailVerificationModalComponent;
  }

  private openModal(modal: VerificationModalComponent): NgbModalRef {
    return this.modalService.open(modal, {
      windowClass: 'modal-standard',
    });
  }
}
