import { Component, Inject, OnInit } from '@angular/core';
import { UserService } from '../core/user/user.service';
import { UserStats } from '../core/user/user-stats.interface';
import { SubscriptionsService } from '../core/subscriptions/subscriptions.service';
import { AnalyticsService } from 'app/core/analytics/analytics.service';
import {
  AnalyticsEvent,
  ClickProSubscription,
  ANALYTICS_EVENT_NAMES,
  ANALYTIC_EVENT_TYPES,
  SCREEN_IDS,
} from 'app/core/analytics/analytics-constants';

@Component({
  selector: 'tsl-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  public userUrl: string;
  public isPro: boolean;
  public userStats: UserStats;
  private hasOneTrialSubscription: boolean;

  constructor(
    private userService: UserService,
    private analyticsService: AnalyticsService,
    private subscriptionService: SubscriptionsService,
    @Inject('SUBDOMAIN') private subdomain: string
  ) {}

  ngOnInit() {
    this.userService.me().subscribe((user) => {
      this.userUrl = user.getUrl(this.subdomain);
      this.isPro = user.featured;
    });

    this.subscriptionService.getSubscriptions().subscribe((subscriptions) => {
      this.hasOneTrialSubscription = this.subscriptionService.hasOneTrialSubscription(
        subscriptions
      );
    });

    this.userService
      .getStats()
      .subscribe((userStats) => (this.userStats = userStats));
  }

  public logout($event: any) {
    $event.preventDefault();
    this.userService.logout();
  }

  public trackClickSubscriptionTab() {
    const event: AnalyticsEvent<ClickProSubscription> = {
      name: ANALYTICS_EVENT_NAMES.ClickProSubscription,
      eventType: ANALYTIC_EVENT_TYPES.Other,
      attributes: {
        screenId: SCREEN_IDS.MyProfile,
        freeTrial: this.hasOneTrialSubscription,
      },
    };

    this.analyticsService.trackEvent(event);
  }
}
