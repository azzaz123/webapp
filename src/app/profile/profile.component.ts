import { Component, Inject, OnInit } from '@angular/core';
import { UserService } from '../core/user/user.service';
import { User } from '../core/user/user';
import { MotorPlan, MotorPlanType } from '../core/user/user-response.interface';
import { I18nService } from '../core/i18n/i18n.service';

@Component({
  selector: 'tsl-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  public userUrl: string;
  public motorPlan: MotorPlanType;
  public showSubscriptionTab: boolean;

  constructor(private userService: UserService,
              protected i18n: I18nService,
              @Inject('SUBDOMAIN') private subdomain: string) {
  }

  ngOnInit() {
    this.userService.me().subscribe((user: User) => {
      if (user) {
        this.userUrl = user.getUrl(this.subdomain);
      }
    });
    this.userService.getMotorPlan().subscribe((motorPlan: MotorPlan) => {
      const motorPlanTypes = this.i18n.getTranslations('motorPlanTypes');
      if (motorPlan) {
        this.motorPlan = motorPlanTypes.filter((p: MotorPlanType) => p.subtype === motorPlan.subtype)[0];
        this.showSubscriptionTab = motorPlan.type === 'motor_plan_pro';
      }
    });
  }

  public logout($event: any) {
    $event.preventDefault();
    this.userService.logout();
  }

}
