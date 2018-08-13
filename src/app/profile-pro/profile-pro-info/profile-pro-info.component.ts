import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { UserProInfo } from '../../core/user/user-info.interface';
import { User } from '../../core/user/user';
import { ProfileFormComponent } from '../../shared/profile/profile-form/profile-form.component';
import { UserService } from '../../core/user/user.service';
import { ErrorsService } from '../../core/errors/errors.service';

@Component({
  selector: 'tsl-profile-pro-info',
  templateUrl: './profile-pro-info.component.html',
  styleUrls: ['./profile-pro-info.component.scss']
})
export class ProfileProInfoComponent implements OnInit {

  public profileForm: FormGroup;
  public notificationsForm: FormGroup;
  private userInfo: UserProInfo;
  public user: User;
  @ViewChild(ProfileFormComponent) formComponent: ProfileFormComponent;


  constructor(private userService: UserService,
              private fb: FormBuilder,
              private errorsService: ErrorsService) {
    this.profileForm = fb.group({
      first_name: '',
      last_name: '',
      phone_number: '',
      description: '',
      opening_hours: '',
      location: this.fb.group({
        address: ['', [Validators.required]],
        latitude: ['', [Validators.required]],
        longitude: ['', [Validators.required]],
      })
    });
    this.notificationsForm = fb.group({
      new_chat_notification: false,
      only_chat_phone_notification: false,
      consent_third_parties_use_data: false,
      news_notification: false
    });
  }

  ngOnInit() {
    this.userService.me().subscribe((user: User) => {
      this.user = user;
    });
    this.userService.getProInfo().subscribe((userInfo: UserProInfo) => {
      this.userInfo = userInfo;
      this.setUserData();
    }, () => {
      this.profileForm.patchValue({
        first_name: this.user.firstName,
        last_name: this.user.lastName
      });
      this.formComponent.hasNotSavedChanges = false;
    });
  }

  private setUserData() {
    if (this.userInfo) {
      this.profileForm.patchValue({
        first_name: this.user.firstName,
        last_name: this.user.lastName,
        phone_number: this.userInfo.phone_number,
        description: this.userInfo.description,
        opening_hours: this.userInfo.opening_hours
      });
      this.notificationsForm.patchValue({
        new_chat_notification: this.userInfo.new_chat_notification,
        only_chat_phone_notification: this.userInfo.only_chat_phone_notification,
        consent_third_parties_use_data: this.userInfo.consent_third_parties_use_data,
        news_notification: this.userInfo.news_notification
      });
    }
    this.formComponent.hasNotSavedChanges = false;
  }

  public canExit() {
    return this.formComponent.canExit();
  }

  public onSubmit() {
    if (this.profileForm.valid) {
      delete this.profileForm.value.location;
      this.userService.updateProInfo(this.profileForm.value).subscribe(() => {
        this.userService.edit({
          first_name: this.profileForm.value.first_name,
          last_name: this.profileForm.value.last_name,
          birth_date: moment(this.user.birthDate).format('YYYY-MM-DD'),
          gender: this.user.gender
        }).subscribe(() => {
          this.errorsService.i18nSuccess('userEdited');
          this.formComponent.hasNotSavedChanges = false;
        });
      });
    } else {
      if (!this.profileForm.get('location.address').valid) {
        this.profileForm.get('location.address').markAsDirty();
      }
      this.errorsService.i18nError('formErrors');
    }
  }

  public onNotificationChange(fieldName: string, value: boolean) {
    this.userService.updateProInfoNotifications({
      [fieldName]: value
    }).subscribe(() => {
      this.errorsService.i18nSuccess('settingsEdited');
    });
  }

}
