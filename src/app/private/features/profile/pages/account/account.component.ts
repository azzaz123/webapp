import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ErrorsService } from '@core/errors/errors.service';
import { User } from '@core/user/user';
import { UserService } from '@core/user/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CanComponentDeactivate } from '@core/guards/can-component-deactivate.interface';
import { ProfileFormComponent } from '@shared/profile/profile-form/profile-form.component';
import * as moment from 'moment';
import { finalize } from 'rxjs/operators';
import { UnsubscribeModalComponent } from '../../modal/unsubscribe-modal/unsubscribe-modal.component';
import { TRANSLATION_KEY } from '@core/i18n/translations/enum/translation-keys.enum';
import { PERMISSIONS } from '@core/user/user-constants';

@Component({
  selector: 'tsl-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements CanComponentDeactivate {
  public profileForm: FormGroup;
  public user: User;
  public loading = false;
  @ViewChild(ProfileFormComponent, { static: true })
  formComponent: ProfileFormComponent;
  public readonly PERMISSIONS = PERMISSIONS;

  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private userService: UserService,
    private errorsService: ErrorsService
  ) {
    this.profileForm = fb.group({
      birth_date: ['', [Validators.required, this.dateValidator]],
      gender: ['', [Validators.required]],
    });
  }

  initForm() {
    this.user = this.userService.user;
    this.profileForm.patchValue({
      birth_date: moment(this.user.birthDate).format('YYYY-MM-DD'),
      gender: this.user.gender ? this.user.gender.toUpperCase().substr(0, 1) : null,
    });
  }

  public onSubmit() {
    if (this.profileForm.valid) {
      this.loading = true;
      this.userService
        .edit({
          birth_date: moment(this.profileForm.get('birth_date').value).format('YYYY-MM-DD'),
          gender: this.profileForm.get('gender').value,
        })
        .pipe(finalize(() => (this.loading = false)))
        .subscribe(() => {
          this.errorsService.i18nSuccess(TRANSLATION_KEY.USER_EDITED);
          this.formComponent.initFormControl();
        });
    } else {
      for (const control in this.profileForm.controls) {
        if (this.profileForm.controls.hasOwnProperty(control) && !this.profileForm.controls[control].valid) {
          this.profileForm.controls[control].markAsDirty();
        }
      }
      this.errorsService.i18nError(TRANSLATION_KEY.FORM_FIELD_ERROR);
    }
  }

  public canExit() {
    return this.formComponent.canExit();
  }

  private dateValidator(c: FormControl) {
    const dateRegEx = new RegExp(/^(\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))$/);
    return dateRegEx.test(c.value) ? null : { date: true };
  }

  public openUnsubscribeModal() {
    this.modalService.open(UnsubscribeModalComponent, {
      windowClass: 'unsubscribe',
    });
  }
}
