import { Component, Input } from '@angular/core';
import { UserVerificationsService } from '@api/user-verifications/user-verifications.service';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { VerificationsNSecurityStore } from '@private/features/profile/pages/verifications-n-security/services/verifications-n-security-store.service';
import { VerificationsNSecurityTrackingEventsService } from '@private/features/profile/services/verifications-n-security-tracking-events.service';
import { EmailModalComponent } from '@shared/profile/edit-email/email-modal/email-modal.component';
import { EmailThanksModalComponent } from '../../../email-thanks-modal/email-thanks-modal.component';

@Component({
  selector: 'tsl-email-verification-modal',
  templateUrl: './email-verification-modal.component.html',
  styleUrls: ['./email-verification-modal.component.scss'],
})
export class EmailVerificationModalComponent {
  public email: string;

  constructor(
    public activeModal: NgbActiveModal,
    private userVerificationsService: UserVerificationsService,
    private modalService: NgbModal,
    private verificationsNSecurityTrackingEventsService: VerificationsNSecurityTrackingEventsService
  ) {}

  public changeEmail(): void {
    this.activeModal.close();
    const modalRef: NgbModalRef = this.openModal(EmailModalComponent);
    modalRef.componentInstance.currentEmail = this.email;
  }

  public verifyEmail(): void {
    this.userVerificationsService.verifyEmail().subscribe(() => {
      this.activeModal.close();

      const modalRef: NgbModalRef = this.openModal(EmailThanksModalComponent);
      modalRef.componentInstance.copies = {
        title: $localize`:@@email_verification_all_users_system_modal_title:Thank you!`,
        description: $localize`:@@email_verification_all_users_system_modal_description:We have sent a verification email to ${this.email}:INTERPOLATION:. Access your mailbox and follow the steps to verify your email.`,
        button: $localize`:@@email_verification_all_users_system_modal_ok_button:Understood`,
      };
    });

    this.verificationsNSecurityTrackingEventsService.trackStartEmailVerificationProcessEvent();
  }

  private openModal(modalComponent: typeof EmailModalComponent | typeof EmailThanksModalComponent): NgbModalRef {
    return this.modalService.open(modalComponent, {
      windowClass: 'modal-standard',
    });
  }
}
