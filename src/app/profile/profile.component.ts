import { Component, Inject, OnInit } from '@angular/core';
import { UserService } from '../core/user/user.service';
import { User } from '../core/user/user';
import { MotorPlan, MotorPlanType } from '../core/user/user-response.interface';
import { I18nService } from '../core/i18n/i18n.service';
import { UserStatsResponse } from '../core/user/user-stats.interface';
import { StripeService } from '../core/stripe/stripe.service';
import { SubscriptionsService } from '../core/subscriptions/subscriptions.service';

@Component({
  selector: 'tsl-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  providers: [SubscriptionsService]
})
export class ProfileComponent implements OnInit {

  public userUrl: string;
  public motorPlan: MotorPlanType;
  public showSubscriptionTab: boolean;
  public isPro: boolean;
  public userStats: UserStatsResponse;
  public isSubscriptionsActive: boolean;
  private isStripe: boolean;

  constructor(private userService: UserService,
              protected i18n: I18nService,
              private stripeService: StripeService,
              private subscriptionsService: SubscriptionsService,
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
    this.userService.isProUser().subscribe((isPro: boolean) => {
      this.isPro = isPro;
    });
    this.userService.getStats().subscribe((userStats: UserStatsResponse) => {
      this.userStats = userStats;
    });
    this.stripeService.isPaymentMethodStripe$().subscribe(val => {
      this.isStripe = true;//val;
      if (this.isStripe) {
        this.subscriptionsService.isSubscriptionsActive$().subscribe(val => {
          this.isSubscriptionsActive = true;//val;
        });
      }
    });
  }

  public logout($event: any) {
    $event.preventDefault();
    this.userService.logout();
  }

}
