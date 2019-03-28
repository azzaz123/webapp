import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../core/user/user.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { UnsubscribeModalComponent } from './../unsubscribe-modal/unsubscribe-modal.component';
import { CanComponentDeactivate } from '../../shared/guards/can-component-deactivate.interface';
import { User } from '../../core/user/user';
import { ProfileFormComponent } from '../../shared/profile/profile-form/profile-form.component';
import { LocationModalComponent } from '../../shared/geolocation/location-select/location-modal/location-modal.component';
import { BecomeProModalComponent } from '../become-pro-modal/become-pro-modal.component';
import { Coordinate } from '../../core/geolocation/address-response.interface';
import { LOCATION_MODAL_TIMEOUT } from '../../shared/geolocation/location-select/location-select.component';
import { ErrorsService } from '../../core/errors/errors.service';
import { UserProInfo } from '../../core/user/user-info.interface';
import { Image } from '../../core/user/user-response.interface';

export const competitorLinks = [
  'coches.net',
  'autoscout24.es',
  'autocasión.com',
  'vibbo.com',
  'milanuncios.com',
  'motor.es'
];

@Component({
  selector: 'tsl-profile-info',
  templateUrl: './profile-info.component.html',
  styleUrls: ['./profile-info.component.scss']
})
export class ProfileInfoComponent implements OnInit, CanComponentDeactivate {

  public profileForm: FormGroup;
  private userInfo: UserProInfo;
  public user: User;
  public isPro: boolean;
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
      }),
      link: ''
    });
  }

  ngOnInit() {
    this.userService.me().subscribe((user: User) => {
      this.user = user;
    });
    this.userService.isProUser().subscribe((isPro: boolean) => {
      this.isPro = isPro;
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
    this.userService.getUserCover().subscribe((avatar: Image) => {
      this.user.coverImage = avatar;
    });
  }

  private setUserData() {
    if (this.userInfo) {
      this.profileForm.patchValue({
        first_name: this.user.firstName,
        last_name: this.user.lastName,
        phone_number: this.userInfo.phone_number,
        description: this.userInfo.description,
        opening_hours: this.userInfo.opening_hours,
        link: this.userInfo.link
      });
    }
    this.formComponent.hasNotSavedChanges = false;
  }

  public canExit() {
    return this.formComponent.canExit();
  }

  public onSubmit() {
    const linkControl = this.profileForm.get('link');
    if (linkControl.value ) {
      competitorLinks.forEach(competitor  => {
        if (linkControl.value.toUpperCase().includes(competitor.toUpperCase())) {
          linkControl.setErrors({incorrect: true});
        }
      });
      if (!linkControl.valid) {
        this.errorsService.i18nError('linkError');
        return;
      }
    }
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
