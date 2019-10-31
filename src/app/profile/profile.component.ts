import { Component, Inject, OnInit } from '@angular/core';
import { UserService } from '../core/user/user.service';
import { User } from '../core/user/user';
import { MotorPlan, MotorPlanType, ProfileSubscriptionInfo } from '../core/user/user-response.interface';
import { I18nService } from '../core/i18n/i18n.service';
import { UserStatsResponse } from '../core/user/user-stats.interface';
import { StripeService } from '../core/stripe/stripe.service';
import { SubscriptionsService } from '../core/subscriptions/subscriptions.service';
import { flatMap } from 'rxjs/operators';
import { CategoryService } from '../core/category/category.service';
import { EventService } from '../core/event/event.service';

@Component({
  selector: 'tsl-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  public userUrl: string;
  public motorPlan: MotorPlanType;
  public showSubscriptionTab: boolean;
  public isPro: boolean;
  public userStats: UserStatsResponse;
  public isSubscriptionsActive: boolean;
  public isNewSubscription = false;
  public loading = false;

  constructor(private userService: UserService,
              protected i18n: I18nService,
              private stripeService: StripeService,
              private subscriptionsService: SubscriptionsService,
              private categoryService: CategoryService,
              private eventService: EventService,
              @Inject('SUBDOMAIN') private subdomain: string) {
  }

  ngOnInit() {
    this.loading = true;
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
    this.isProUser();
    this.userService.getStats().subscribe((userStats: UserStatsResponse) => {
      this.userStats = userStats;
    });
    this.stripeService.isPaymentMethodStripe$()
    .pipe(
      flatMap(() => this.subscriptionsService.isSubscriptionsActive$())
    )
    .filter(val => val === true)
    .subscribe(val => {
      this.isSubscriptionsActive = val;
      this.userService.isProfessional().subscribe((isProfessional: boolean) => {
        if (!isProfessional) {
          this.subscriptionType();
        }
        else {
          this.loading = false;
        }
      });
    });
  }

  public logout($event: any) {
    $event.preventDefault();
    this.userService.logout();
  }

  private subscriptionType(cache: boolean = true): void {
    this.subscriptionsService.getSubscriptions(cache).subscribe(response => {
      this.loading = false;
      if (response) {
        response.map(subscription => {
          if (subscription.selected_tier_id) {
            this.isNewSubscription = true;
          }
        })
        if (!this.isNewSubscription) {
          this.userService.getMotorPlans().subscribe((subscriptionInfo: ProfileSubscriptionInfo) => {
            if (subscriptionInfo.status === "NOT_ELIGIBLE") {
              this.isNewSubscription = true;
            }
          });
        }
      }
    }); 
  }

  private isProUser(): void {
    this.userService.isProUser().subscribe((isPro: boolean) => {
      this.isPro = isPro;
    });
  }

}
