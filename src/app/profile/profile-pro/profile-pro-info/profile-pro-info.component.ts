import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProfileFormComponent } from '../../profile-form/profile-form.component';
import { UserService } from '../../../core/user/user.service';
import { User } from '../../../core/user/user';
import { UserProInfo } from '../../../core/user/user-info.interface';
import { ErrorsService } from '../../../core/errors/errors.service';

@Component({
  selector: 'tsl-profile-pro-info',
  templateUrl: './profile-pro-info.component.html',
  styleUrls: ['./profile-pro-info.component.scss']
})
export class ProfileProInfoComponent implements OnInit {

  public profileForm: FormGroup;
  public notificationsForm: FormGroup;
  private userInfo: UserProInfo;
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
    this.userService.getProInfo().subscribe((userInfo: UserProInfo) => {
      this.userInfo = userInfo;
      this.setUserData();
    });
    this.notificationsForm.valueChanges.subscribe((a) => {
      this.userService.updateProInfo(this.notificationsForm.value).subscribe(() => {
        this.errorsService.i18nSuccess('settingsEdited');
      });
    });
  }

  private setUserData() {
    if (this.userInfo) {
      this.profileForm.patchValue({
        first_name: this.userInfo.first_name,
        last_name: this.userInfo.last_name,
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
  }

  public canExit() {
    return this.formComponent.canExit();
  }

  public onSubmit() {
    if (this.profileForm.valid) {
      delete this.profileForm.value.location;
      this.userService.updateProInfo(this.profileForm.value).subscribe(() => {
        this.errorsService.i18nSuccess('userEdited');
        this.formComponent.hasNotSavedChanges = false;
      });
    } else {
      if (!this.profileForm.get('location.address').valid) {
        this.profileForm.get('location.address').markAsDirty();
      }
      this.errorsService.i18nError('formErrors');
    }
  }

}
