import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UnsubscribeModalComponent } from '../unsubscribe-modal/unsubscribe-modal.component';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ProfileFormComponent } from '../../shared/profile/profile-form/profile-form.component';
import { UserService } from '../../core/user/user.service';
import { ErrorsService } from '../../core/errors/errors.service';
import { User } from '../../core/user/user';

@Component({
  selector: 'tsl-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  public profileForm: FormGroup;
  public user: User;
  @ViewChild(ProfileFormComponent) formComponent: ProfileFormComponent;

  constructor(private modalService: NgbModal,
              private fb: FormBuilder,
              private userService: UserService,
              private errorsService: ErrorsService) {
    this.profileForm = fb.group({
      birth_date: ['', [Validators.required, this.dateValidator]],
      gender: ['', [Validators.required]],

    });
  }

  ngOnInit() {
    this.userService.me().subscribe((user: User) => {
      this.user = user;
    });
  }

  public onSubmit() {
    if (this.profileForm.valid) {
      this.userService.edit(this.profileForm.value).subscribe(() => {
        this.errorsService.i18nSuccess('userEdited');
        this.formComponent.hasNotSavedChanges = false;
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

  private dateValidator(c: FormControl) {
    const dateRegEx = new RegExp(/^(\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))$/);
    return dateRegEx.test(c.value) ? null : {date: true}
  }


  public openUnsubscribeModal() {
    this.modalService.open(UnsubscribeModalComponent, {windowClass: 'unsubscribe'});
  }


}
