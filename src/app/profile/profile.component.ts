import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../core/user/user.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UnsubscribeModalComponent } from './unsubscribe-modal/unsubscribe-modal.component';
import { CanComponentDeactivate } from '../shared/guards/can-component-deactivate.interface';
import { User } from '../core/user/user';
import { ProfileFormComponent } from '../shared/profile/profile-form/profile-form.component';
import { PrivacyService, PRIVACY_STATUS } from '../core/privacy/privacy.service';
import { BecomeProModalComponent } from './become-pro-modal/become-pro-modal.component';

@Component({
  selector: 'tsl-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, CanComponentDeactivate {

  public user: User;
  public userUrl: string;
  public profileForm: FormGroup;
  public settingsForm: FormGroup;
  public allowSegmentation: boolean;
  @ViewChild(ProfileFormComponent) formComponent: ProfileFormComponent;

  constructor(private userService: UserService,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private privacyService: PrivacyService,
    @Inject('SUBDOMAIN') private subdomain: string) {
    this.profileForm = fb.group({
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      birth_date: ['', [Validators.required, this.dateValidator]],
      gender: ['', [Validators.required]],
      location: this.fb.group({
        address: ['', [Validators.required]],
        latitude: ['', [Validators.required]],
        longitude: ['', [Validators.required]],
      }),
      extra_info: this.fb.group({
        description: '',
        phone_number: '',
        link: '',
      }),
    });

    this.settingsForm = fb.group({
      allow_segmentation: false
    });
  }

  ngOnInit() {
    this.userService.me().subscribe((user: User) => {
      this.user = user;
      if (user) {
        this.userUrl = user.getUrl(this.subdomain);
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
    return this.formComponent.onSubmit(this.user);
  }

  private setUserData() {
    this.profileForm.patchValue({
      first_name: this.user.firstName,
      last_name: this.user.lastName,
      birth_date: moment(this.user.birthDate).format('YYYY-MM-DD'),
      gender: this.user.gender.toUpperCase().substr(0, 1)
    });
    if (this.user.featured && this.user.extraInfo) {
      this.profileForm.patchValue({
        extra_info: {
          description: this.user.extraInfo.description,
          phone_number: this.user.extraInfo.phone_number,
          link: this.user.extraInfo.link
        }
      });
    }
  }

  private setSettingsData() {
    this.settingsForm.patchValue({
      allow_segmentation: this.allowSegmentation
    });
  }

  public openUnsubscribeModal() {
    this.modalService.open(UnsubscribeModalComponent, {windowClass: 'unsubscribe'});
  }

  public logout($event: any) {
    $event.preventDefault();
    this.userService.logout();
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

  public openBecomeProModal() {
    if (!this.user.featured) {
      this.modalService.open(BecomeProModalComponent, {windowClass: 'become-pro'});
    }
  }

}
