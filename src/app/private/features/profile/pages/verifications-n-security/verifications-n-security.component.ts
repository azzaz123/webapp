import { Component, OnInit } from '@angular/core';
import { UserVerifications, VERIFICATION_METHOD } from '@api/core/model/verifications';
import { UserVerificationsService } from '@api/user-verifications/user-verifications.service';
import { User } from '@core/user/user';
import { UserService } from '@core/user/user.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EmailModalComponent } from '@shared/profile/edit-email/email-modal/email-modal.component';
import { format, parsePhoneNumber } from 'libphonenumber-js';
import { Observable } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { EmailVerificationModalComponent } from '../../modal/email-verification/modals/email-verification-modal/email-verification-modal.component';
import { PhoneVerificationModalComponent } from '../../modal/phone-verification/modals/phone-verification-modal/phone-verification-modal.component';
import { VerificationsNSecurityTrackingEventsService } from '../../services/verifications-n-security-tracking-events.service';

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
  public user: User;
  public userPhone: string;
  public userVerifications$: Observable<UserVerifications>;

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
    private userService: UserService,
    private userVerificationsService: UserVerificationsService,
    private modalService: NgbModal,
    private verificationsNSecurityTrackingEventsService: VerificationsNSecurityTrackingEventsService
  ) {}

  ngOnInit(): void {
    this.user = this.userService.user;

    this.userVerifications$ = this.userVerificationsService.userVerifications$.pipe(
      take(1),
      tap((userVerifications: UserVerifications) => {
        this.userPhone = this.getUserPhone(userVerifications.phone);
        this.verificationsNSecurityTrackingEventsService.verificationsNSecurityPageView(userVerifications);
      })
    );
  }

  public onClickVerifyEmail(isVerifiedEmail: boolean): void {
    let modalRef: NgbModalRef;
    let modal: VerificationModalComponent = this.getEmailModal(isVerifiedEmail);

    modalRef = this.openModal(modal);

    if (isVerifiedEmail) {
      modalRef.componentInstance.currentEmail = this.user.email;
    } else {
      modalRef.componentInstance.email = this.user.email;

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

  private getUserPhone(isVerifiedPhone: boolean): string {
    if (isVerifiedPhone) {
      return parsePhoneNumber(this.user.phone).format('INTERNATIONAL');
    }

    return '';
  }
}
