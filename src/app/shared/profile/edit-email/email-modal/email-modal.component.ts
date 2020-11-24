import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { isPresent } from 'ngx-cookie';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../../../core/user/user.service';
import { ErrorsService } from '../../../../core/errors/errors.service';

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
    private errorsService: ErrorsService
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
        },
        () => {
          this.errorsService.i18nError('serverError');
        }
      );
    } else {
      for (const control in this.emailForm.controls) {
        if (
          this.emailForm.controls.hasOwnProperty(control) &&
          !this.emailForm.controls[control].valid
        ) {
          this.emailForm.controls[control].markAsDirty();
        }
      }
      this.errorsService.i18nError('formErrors');
    }
  }

  private email(control: AbstractControl): { [key: string]: boolean } {
    if (Validators.required(control)) {
      return null;
    }
    const pattern: RegExp = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return pattern.test(control.value) ? null : { email: true };
  }
}
