import { Component, Inject, OnInit } from '@angular/core';
import { I18nService } from '@core/i18n/i18n.service';
import { SubscriptionsService } from '@core/subscriptions/subscriptions.service';
import { UserStats } from '@core/user/user-stats.interface';
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
    private i18n: I18nService,
    @Inject('SUBDOMAIN') private subdomain: string
  ) {}

  ngOnInit() {
    this.userService.me().subscribe((user) => {
      this.userUrl = user.getUrl(this.subdomain);
      this.isPro = user.featured;
    });

    this.subscriptionService.getSubscriptions().subscribe((subscriptions) => {
      if (!!subscriptions) {
        this.hasOneTrialSubscription = this.subscriptionService.hasOneTrialSubscription(subscriptions);
      }
    });

    this.userService.getStats().subscribe((userStats) => (this.userStats = userStats));
  }

  public logout($event: any) {
    $event.preventDefault();
    this.userService.logout();
  }

  public trackClickSubscriptionTab(): void {
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

  public getSubscriptionTabName(): string {
    return this.userService.isPro ? this.i18n.getTranslations('wallapopPro') : this.i18n.getTranslations('becomePro');
  }
}
