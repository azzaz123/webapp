import { Component, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UnsubscribeModalComponent } from '../unsubscribe-modal/unsubscribe-modal.component';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ProfileFormComponent } from '../../shared/profile/profile-form/profile-form.component';
import { UserService } from '../../core/user/user.service';
import { ErrorsService } from '../../core/errors/errors.service';
import { User } from '../../core/user/user';
import * as moment from 'moment';
import { StripeService } from '../../core/stripe/stripe.service';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { CanComponentDeactivate } from '../../shared/guards/can-component-deactivate.interface';

@Component({
  selector: 'tsl-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements CanComponentDeactivate {

  public profileForm: FormGroup;
  public user: User;
  public isStripe: boolean;
  public loading = false;
  @ViewChild(ProfileFormComponent) formComponent: ProfileFormComponent;

  constructor(private modalService: NgbModal,
    private fb: FormBuilder,
    private userService: UserService,
    private errorsService: ErrorsService,
    private stripeService: StripeService) {
    this.profileForm = fb.group({
      birth_date: ['', [Validators.required, this.dateValidator]],
      gender: ['', [Validators.required]],
    });
  }

  initForm() {
    Observable.forkJoin([
      this.stripeService.isPaymentMethodStripe$(),
      this.userService.me()
    ]).subscribe(values => {
      this.isStripe = values[0];
      this.user = values[1];

      this.profileForm.patchValue({
        birth_date: moment(this.user.birthDate).format('YYYY-MM-DD'),
        gender: this.user.gender ? this.user.gender.toUpperCase().substr(0, 1) : null
      });
    });
  }

  public onSubmit() {
    if (this.profileForm.valid) {
      this.loading = true;
      this.userService.edit({
        birth_date: moment(this.profileForm.get('birth_date').value).format('YYYY-MM-DD'),
        gender: this.profileForm.get('gender').value
      }).pipe(finalize(() => this.loading = false))
        .subscribe(() => {
          this.errorsService.i18nSuccess('userEdited');
          this.formComponent.initFormControl();
        });
    } else {
      for (const control in this.profileForm.controls) {
        if (this.profileForm.controls.hasOwnProperty(control) && !this.profileForm.controls[control].valid) {
          this.profileForm.controls[control].markAsDirty();
        }
      }
      this.errorsService.i18nError('formErrors');
    }
  }

  public canExit() {
    return this.formComponent.canExit();
  }

  private dateValidator(c: FormControl) {
    const dateRegEx = new RegExp(/^(\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))$/);
    return dateRegEx.test(c.value) ? null : { date: true }
  }


  public openUnsubscribeModal() {
    this.modalService.open(UnsubscribeModalComponent, { windowClass: 'unsubscribe' });
  }

}
