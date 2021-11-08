import { Component, Input } from '@angular/core';
import { UserVerificationsService } from '@api/user-verifications/user-verifications.service';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { VerificationsNSecurityTrackingEventsService } from '@private/features/profile/services/verifications-n-security-tracking-events.service';
import { EmailModalComponent } from '@shared/profile/edit-email/email-modal/email-modal.component';
import { VerificationEmailThanksModalComponent } from '../../../verification-email-thanks-modal/verification-email-thanks-modal.component';

@Component({
  selector: 'tsl-email-verification-modal',
  templateUrl: './email-verification-modal.component.html',
  styleUrls: ['./email-verification-modal.component.scss'],
})
export class EmailVerificationModalComponent {
  @Input() email: string;
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
      const modalRef: NgbModalRef = this.openModal(VerificationEmailThanksModalComponent);
      modalRef.componentInstance.email = this.email;
    });

    this.verificationsNSecurityTrackingEventsService.trackStartEmailVerificationProcessEvent();
  }

  private openModal(modalComponent: typeof EmailModalComponent | typeof VerificationEmailThanksModalComponent): NgbModalRef {
    return this.modalService.open(modalComponent, {
      windowClass: 'modal-standard',
    });
  }
}
