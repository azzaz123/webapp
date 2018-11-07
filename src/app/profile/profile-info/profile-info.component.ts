import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../core/user/user.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UnsubscribeModalComponent } from './../unsubscribe-modal/unsubscribe-modal.component';
import { CanComponentDeactivate } from '../../shared/guards/can-component-deactivate.interface';
import { User } from '../../core/user/user';
import { ProfileFormComponent } from '../../shared/profile/profile-form/profile-form.component';
import { PRIVACY_STATUS, PrivacyService } from '../../core/privacy/privacy.service';

@Component({
  selector: 'tsl-profile-info',
  templateUrl: './profile-info.component.html',
  styleUrls: ['./profile-info.component.scss']
})
export class ProfileInfoComponent implements OnInit, CanComponentDeactivate {

  public user: User;
  public profileForm: FormGroup;
  public settingsForm: FormGroup;
  public allowSegmentation: boolean;
  @ViewChild(ProfileFormComponent) formComponent: ProfileFormComponent;

  constructor(private userService: UserService,
              private fb: FormBuilder,
              private modalService: NgbModal,
              private privacyService: PrivacyService) {
    this.profileForm = fb.group({
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      birth_date: ['', [Validators.required, this.dateValidator]],
      gender: ['', [Validators.required]],
      location: this.fb.group({
        address: ['', [Validators.required]],
        latitude: ['', [Validators.required]],
        longitude: ['', [Validators.required]],
      })
    });

    this.settingsForm = fb.group({
      allow_segmentation: false
    });
  }

  ngOnInit() {
    this.userService.me().subscribe((user: User) => {
      this.user = user;
      if (user) {
        this.setUserData();
      }
    });
    this.privacyService.allowSegmentation$.subscribe((value: boolean) => {
      const allowSegmentationState = this.privacyService.getPrivacyState('gdpr_display', '0');
      this.allowSegmentation = allowSegmentationState === PRIVACY_STATUS.unknown ? false : value;
      this.setSettingsData();
    });
  }

  public canExit() {
    return this.formComponent.canExit();
  }

  public onSubmit() {
    return this.formComponent.onSubmit();
  }

  private setUserData() {
    this.profileForm.patchValue({
      first_name: this.user.firstName,
      last_name: this.user.lastName,
      birth_date: moment(this.user.birthDate).format('YYYY-MM-DD'),
      gender: this.user.gender.toUpperCase().substr(0, 1)
    });
  }

  private setSettingsData() {
    this.settingsForm.patchValue({
      allow_segmentation: this.allowSegmentation
    });
  }

  public openUnsubscribeModal() {
    this.modalService.open(UnsubscribeModalComponent, {windowClass: 'unsubscribe'});
  }

  public switchAllowSegmentation (value: boolean) {
    this.privacyService.updatePrivacy({
      gdpr_display: {
        version: '0',
        allow: value
      }
    }).subscribe();
  }

  private dateValidator(c: FormControl) {
    const dateRegEx = new RegExp(/^(\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))$/);
    return dateRegEx.test(c.value) ? null : {date: true}
  }

}
