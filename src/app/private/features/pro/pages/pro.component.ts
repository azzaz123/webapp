import { Component, OnInit } from '@angular/core';
import { SubscriptionsService } from '@core/subscriptions/subscriptions.service';
import { PERMISSIONS } from '@core/user/user-constants';
import { UserService } from '@core/user/user.service';
import {
  AnalyticsEvent,
  ANALYTICS_EVENT_NAMES,
  ANALYTIC_EVENT_TYPES,
  ClickProSubscription,
  SCREEN_IDS,
} from 'app/core/analytics/analytics-constants';
import { AnalyticsService } from 'app/core/analytics/analytics.service';
import { PRO_PATHS } from '../pro-routing-constants';

@Component({
  selector: 'tsl-pro',
  templateUrl: './pro.component.html',
  styleUrls: ['./pro.component.scss'],
})
export class ProComponent implements OnInit {
  public readonly PERMISSIONS = PERMISSIONS;
  public readonly PRO_PATHS = PRO_PATHS;
  private hasOneTrialSubscription: boolean;
  private hasSomeDiscount: boolean;

  constructor(
    public userService: UserService,
    private analyticsService: AnalyticsService,
    private subscriptionService: SubscriptionsService
  ) {}

  ngOnInit() {
    this.subscriptionService.getSubscriptions().subscribe((subscriptions) => {
      if (!!subscriptions) {
        this.hasOneTrialSubscription = this.subscriptionService.hasOneTrialSubscription(subscriptions);
        this.hasSomeDiscount = this.subscriptionService.hasSomeSubscriptionDiscount(subscriptions);
      }
    });
  }

  public trackClickSubscriptionTab(): void {
    const event: AnalyticsEvent<ClickProSubscription> = {
      name: ANALYTICS_EVENT_NAMES.ClickProSubscription,
      eventType: ANALYTIC_EVENT_TYPES.Navigation,
      attributes: {
        screenId: SCREEN_IDS.MyProfile,
        freeTrial: this.hasOneTrialSubscription,
        discount: this.hasSomeDiscount,
      },
    };

    this.analyticsService.trackEvent(event);
  }
}
