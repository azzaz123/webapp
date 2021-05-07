import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../../../core/user/user.service';
import { ErrorsService } from '../../../../core/errors/errors.service';
import { TRANSLATION_KEY } from '@core/i18n/translations/enum/translation-keys.enum';

@Component({
  selector: 'tsl-password-modal',
  templateUrl: './password-modal.component.html',
  styleUrls: ['./password-modal.component.scss'],
})
export class PasswordModalComponent {
  public passwordForm: FormGroup;
  public currentEmail: string;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    public activeModal: NgbActiveModal,
    private errorsService: ErrorsService
  ) {
    this.passwordForm = fb.group(
      {
        old_password: ['', [Validators.required]],
        new_password: ['', [Validators.required, Validators.minLength(8)]],
        repeat_password: ['', [Validators.required]],
      },
      { validator: this.match('new_password', 'repeat_password') }
    );
  }

  public onSubmit() {
    if (this.passwordForm.valid) {
      const oldPassword = this.passwordForm.get('old_password').value;
      const newPassword = this.passwordForm.get('new_password').value;
      this.userService.updatePassword(oldPassword, newPassword).subscribe(
        () => {
          this.activeModal.close();
        },
        (response) => {
          if (response.status === 403) {
            this.errorsService.i18nError(TRANSLATION_KEY.INVALID_PASSWORD_ERROR);
          } else {
            this.errorsService.i18nError(TRANSLATION_KEY.SERVER_ERROR);
          }
        }
      );
    } else {
      for (const control in this.passwordForm.controls) {
        if (this.passwordForm.controls.hasOwnProperty(control) && !this.passwordForm.controls[control].valid) {
          this.passwordForm.controls[control].markAsDirty();
        }
      }
      if (this.passwordForm.get('new_password').errors && this.passwordForm.get('new_password').errors.minlength) {
        this.errorsService.i18nError(TRANSLATION_KEY.PASSWORD_MIN_LENGTH_ERROR);
      } else if (this.passwordForm.errors && this.passwordForm.errors.match) {
        this.errorsService.i18nError(TRANSLATION_KEY.PASSWORD_DO_NOT_MATCH_ERROR);
      } else {
        this.errorsService.i18nError(TRANSLATION_KEY.FORM_FIELD_ERROR);
      }
    }
  }

  private match(field: string, confirmField: string): Function {
    return (group: FormGroup): { [key: string]: any } => {
      if (group.controls[field] && group.controls[confirmField]) {
        return group.controls[field].value !== group.controls[confirmField].value ? { match: true } : null;
      }
    };
  }
}
