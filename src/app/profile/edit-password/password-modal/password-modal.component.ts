import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../core/user/user.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ErrorsService } from 'shield';

@Component({
  selector: 'tsl-password-modal',
  templateUrl: './password-modal.component.html',
  styleUrls: ['./password-modal.component.scss']
})
export class PasswordModalComponent {

  public passwordForm: FormGroup;
  public currentEmail: string;

  constructor(private fb: FormBuilder,
              private userService: UserService,
              private activeModal: NgbActiveModal,
              private errorsService: ErrorsService) {
    this.passwordForm = fb.group({
      old_password: ['', [Validators.required]],
      new_password: ['', [Validators.required]],
      repeat_password: ['', [Validators.required]]
    }, {validator: this.match('new_password', 'repeat_password')});
  }

  public onSubmit() {
    if (this.passwordForm.valid) {
      const oldPassword = this.passwordForm.get('old_password').value;
      const newPassword = this.passwordForm.get('new_password').value;
      this.userService.updatePassword(oldPassword, newPassword).subscribe(() => {
        this.activeModal.close();
      }, () => {
        this.errorsService.i18nError('serverError');
      });
    } else {
      for (let control in this.passwordForm.controls) {
        if (this.passwordForm.controls.hasOwnProperty(control) && !this.passwordForm.controls[control].valid) {
          this.passwordForm.controls[control].markAsDirty();
        }
      }
      this.errorsService.i18nError('formErrors');
    }
  }

  private match(field: string, confirmField: string): Function {
    return (group: FormGroup): { [key: string]: any } => {
      if (group.controls[field] && group.controls[confirmField]) {
        return (group.controls[field].value !== group.controls[confirmField].value) ? {'match': true} : null;
      }
    };
  }


}
