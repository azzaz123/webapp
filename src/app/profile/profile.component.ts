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
import { MotorPlan, MotorPlanType } from '../core/user/user-response.interface';
import { I18nService } from '../core/i18n/i18n.service';

@Component({
  selector: 'tsl-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  public user: User;
  public userUrl: string;
  public motorPlan: MotorPlanType;

  constructor(private userService: UserService,
              protected i18n: I18nService,
              @Inject('SUBDOMAIN') private subdomain: string) {
  }

  ngOnInit() {
    this.userService.me().subscribe((user: User) => {
      this.user = user;
      if (user) {
        this.userUrl = user.getUrl(this.subdomain);
      }
    });
    this.userService.getMotorPlan().subscribe((motorPlan: MotorPlan) => {
      const motorPlanTypes = this.i18n.getTranslations('motorPlanTypes');
      this.motorPlan = motorPlanTypes.filter((p: MotorPlanType) => p.subtype === motorPlan.subtype)[0];
    });
  }

  public logout($event: any) {
    $event.preventDefault();
    this.userService.logout();
  }

}
