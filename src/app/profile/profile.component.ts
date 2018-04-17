import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { UserService } from '../core/user/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import * as _ from 'lodash';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UnsubscribeModalComponent } from './unsubscribe-modal/unsubscribe-modal.component';
import { ErrorsService } from '../core/errors/errors.service';
import { CanComponentDeactivate } from '../shared/guards/can-component-deactivate.interface';
import { ExitConfirmationModalComponent } from '../catalog/edit/exit-confirmation-modal/exit-confirmation-modal.component';
import { User } from '../core/user/user';

@Component({
  selector: 'tsl-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, CanComponentDeactivate {

  public user: User;
  public userUrl: string;
  public profileForm: FormGroup;
  public hasNotSavedChanges: boolean;
  private oldFormValue: any;

  constructor(private userService: UserService,
    private fb: FormBuilder,
    private errorsService: ErrorsService,

    private modalService: NgbModal,
    @Inject('SUBDOMAIN') private subdomain: string) {
    this.profileForm = fb.group({
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      birth_date: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      location: this.fb.group({
        address: ['', [Validators.required]],
        latitude: ['', [Validators.required]],
        longitude: ['', [Validators.required]],
      })
    });
  }

  ngOnInit() {
    this.userService.me().subscribe((user) => {
      this.user = user;
      if (user) {
        this.userUrl = user.getUrl(this.subdomain);
        this.setUserData();
        this.detectFormChanges();
      }
    });
  }

  private detectFormChanges() {
    this.profileForm.valueChanges.subscribe((value) => {
      const oldProfileData = _.omit(this.oldFormValue, ['location']);
      const newProfileData = _.omit(value, ['location']);
      if (!this.oldFormValue) {
        this.oldFormValue = value;
      } else {
        if (!_.isEqual(oldProfileData, newProfileData)) {
          this.hasNotSavedChanges = true;
        }
        this.oldFormValue = value;
      }
    });
  }

  public canExit() {
    if (!this.hasNotSavedChanges) {
      return true;
    }
    return this.modalService.open(ExitConfirmationModalComponent, {
      backdrop: 'static'
    }).result;
  }

  @HostListener('window:beforeunload')
  handleBeforeUnload() {
    if (this.hasNotSavedChanges) {
      return confirm();
    }
  }

  public onSubmit() {
    if (this.profileForm.valid) {
      delete this.profileForm.value.location;
      this.userService.edit(this.profileForm.value).subscribe(() => {
        this.errorsService.i18nSuccess('userEdited');
        this.hasNotSavedChanges = false;
      });
    } else {
      for (const control in this.profileForm.controls) {
        if (this.profileForm.controls.hasOwnProperty(control) && !this.profileForm.controls[control].valid) {
          this.profileForm.controls[control].markAsDirty();
        }
      }
      if (!this.profileForm.get('location.address').valid) {
        this.profileForm.get('location.address').markAsDirty();
      }
      this.errorsService.i18nError('formErrors');
    }
  }

  private setUserData() {
    this.profileForm.get('first_name').patchValue(this.user.firstName);
    this.profileForm.get('last_name').patchValue(this.user.lastName);
    this.profileForm.get('birth_date').patchValue(moment(this.user.birthDate).format('YYYY-MM-DD'));
    this.profileForm.get('gender').patchValue(this.user.gender.toUpperCase().substr(0, 1));
  }

  public openUnsubscribeModal() {
    this.modalService.open(UnsubscribeModalComponent, {windowClass: 'unsubscribe'});
  }

  public logout($event: any) {
    $event.preventDefault();
    this.userService.logout();
  }

}
