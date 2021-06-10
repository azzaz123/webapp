import { Component, OnInit } from '@angular/core';
import { I18nService } from '@core/i18n/i18n.service';
import { TRANSLATION_KEY } from '@core/i18n/translations/enum/translation-keys.enum';
import { SubscriptionsService } from '@core/subscriptions/subscriptions.service';
import { User } from '@core/user/user';
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
  public user: User;
  public userStats: UserStats;
  private hasOneTrialSubscription: boolean;

  constructor(
    public userService: UserService,
    private analyticsService: AnalyticsService,
    private subscriptionService: SubscriptionsService,
    private i18n: I18nService
  ) {}

  ngOnInit() {
    this.user = this.userService.user;
    this.subscriptionService.getSubscriptions().subscribe((subscriptions) => {
      if (!!subscriptions) {
        this.hasOneTrialSubscription = this.subscriptionService.hasOneTrialSubscription(subscriptions);
      }
    });

    this.userService.getStats().subscribe((userStats) => (this.userStats = userStats));
  }

  public logout($event: any) {
    $event.preventDefault();
    this.userService.logout().subscribe();
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

  public getSubscriptionTabName(): string {
    return this.userService.isPro ? this.i18n.translate(TRANSLATION_KEY.WALLAPOP_PRO) : this.i18n.translate(TRANSLATION_KEY.BECOME_PRO);
  }
}
