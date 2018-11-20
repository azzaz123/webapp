import { Component, OnInit } from '@angular/core';
import {
  MotorPlanType, ProfileSubscriptionInfo, UserProduct, UserProductFeature,
} from '../../core/user/user-response.interface';
import { UserService } from '../../core/user/user.service';
import { I18nService } from '../../core/i18n/i18n.service';

@Component({
  selector: 'tsl-profile-subscription',
  templateUrl: './profile-subscription.component.html',
  styleUrls: ['./profile-subscription.component.scss']
})
export class ProfileSubscriptionComponent implements OnInit {

  public plans: UserProduct[];
  public currentPlan: string;

  constructor(private userService: UserService,
              protected i18n: I18nService) { }

  ngOnInit() {
    this.userService.getMotorPlans().subscribe((subscriptionInfo: ProfileSubscriptionInfo) => {
      const motorPlanTypes = this.i18n.getTranslations('motorPlanTypes');
      this.plans = subscriptionInfo.product_group.user_products.map((plan: UserProduct) => {
        const planType: MotorPlanType = motorPlanTypes.find((p: MotorPlanType) => p.subtype === plan.name);
        plan.label = planType.shortLabel;
        plan.durations[0].features = plan.durations[0].features.map((feature: UserProductFeature) => {
          feature.label = this.i18n.getTranslations(feature.name);
          return feature;
        });
        if (plan.active) {
          this.currentPlan = planType.label;
        }
        return plan;
      });
    });
  }

}
