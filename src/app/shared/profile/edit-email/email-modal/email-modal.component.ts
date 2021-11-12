import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../../../core/user/user.service';
import { ErrorsService } from '../../../../core/errors/errors.service';
import { TRANSLATION_KEY } from '@core/i18n/translations/enum/translation-keys.enum';
import { EmailThanksModalComponent } from '@private/features/profile/modal/email-thanks-modal/email-thanks-modal.component';

@Component({
  selector: 'tsl-email-modal',
  templateUrl: './email-modal.component.html',
  styleUrls: ['./email-modal.component.scss'],
})
export class EmailModalComponent {
  public emailForm: FormGroup;
  public currentEmail: string;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    public activeModal: NgbActiveModal,
    private errorsService: ErrorsService,
    private modalService: NgbModal
  ) {
    this.emailForm = fb.group({
      email_address: ['', [Validators.required, this.email]],
    });
  }

  public onSubmit() {
    if (this.emailForm.valid) {
      const email = this.emailForm.get('email_address').value;
      this.userService.updateEmail(email).subscribe(
        () => {
          this.activeModal.close(email);
          const modalRef: NgbModalRef = this.modalService.open(EmailThanksModalComponent, {
            windowClass: 'modal-standard',
          });
          modalRef.componentInstance.copies = {
            title: $localize`:@@change_email_all_users_system_alert_how_to_verify_title:Thank you!`,
            description: $localize`:@@change_email_all_users_system_alert_how_to_verify_description:We have sent a verification email to ${email}. Access your mailbox and follow the steps to verify your email.`,
            button: $localize`:@@change_email_all_users_system_alert_how_to_verify_button:Understood`,
          };
        },
        () => {
          this.errorsService.i18nError(TRANSLATION_KEY.SERVER_ERROR);
        }
      );
    } else {
      for (const control in this.emailForm.controls) {
        if (this.emailForm.controls.hasOwnProperty(control) && !this.emailForm.controls[control].valid) {
          this.emailForm.controls[control].markAsDirty();
        }
      }
      this.errorsService.i18nError(TRANSLATION_KEY.FORM_FIELD_ERROR);
    }
  }

  private email(control: AbstractControl): { [key: string]: boolean } {
    if (Validators.required(control)) {
      return null;
    }
    const pattern: RegExp =
      /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return pattern.test(control.value) ? null : { email: true };
  }
}
