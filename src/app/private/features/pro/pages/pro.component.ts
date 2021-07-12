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

@Component({
  selector: 'tsl-pro',
  templateUrl: './pro.component.html',
  styleUrls: ['./pro.component.scss'],
})
export class ProComponent implements OnInit {
  private hasOneTrialSubscription: boolean;
  public readonly PERMISSIONS = PERMISSIONS;

  constructor(
    public userService: UserService,
    private analyticsService: AnalyticsService,
    private subscriptionService: SubscriptionsService
  ) {}

  ngOnInit() {
    this.subscriptionService.getSubscriptions().subscribe((subscriptions) => {
      if (!!subscriptions) {
        this.hasOneTrialSubscription = this.subscriptionService.hasOneTrialSubscription(subscriptions);
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
      },
    };

    this.analyticsService.trackEvent(event);
  }
}
