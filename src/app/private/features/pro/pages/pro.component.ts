import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { CUSTOMER_HELP_PAGE } from '@core/external-links/customer-help/customer-help-constants';
import { CustomerHelpService } from '@core/external-links/customer-help/customer-help.service';
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
import { filter } from 'rxjs/operators';
import { PRO_PATHS } from '../pro-routing-constants';

@Component({
  selector: 'tsl-pro',
  templateUrl: './pro.component.html',
  styleUrls: ['./pro.component.scss'],
})
export class ProComponent implements OnInit {
  public readonly PERMISSIONS = PERMISSIONS;
  public readonly PRO_PATHS = PRO_PATHS;
  public zendeskUrl: string;
  private hasOneTrialSubscription: boolean;
  private hasSomeDiscount: boolean;
  private readonly zendeskMapper: Record<string, CUSTOMER_HELP_PAGE> = {
    [PRO_PATHS.BILLING]: CUSTOMER_HELP_PAGE.CARS_SUBSCRIPTION,
  };
  constructor(
    public userService: UserService,
    private analyticsService: AnalyticsService,
    private subscriptionService: SubscriptionsService,
    private router: Router,
    private customerHelpService: CustomerHelpService
  ) {}

  ngOnInit() {
    this.subscriptionService.getSubscriptions().subscribe((subscriptions) => {
      if (!!subscriptions) {
        this.hasOneTrialSubscription = this.subscriptionService.hasOneTrialSubscription(subscriptions);
        this.hasSomeDiscount = this.subscriptionService.hasSomeSubscriptionDiscount(subscriptions);
      }
    });
    this.subscribeRoute();
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

  private subscribeRoute(): void {
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
      this.setZendeskUrl(event.url);
    });
  }

  private setZendeskUrl(url: string): void {
    console.log('aaa', url, PRO_PATHS.BILLING);
    if (url in this.zendeskMapper) {
      this.zendeskUrl = this.customerHelpService.getPageUrl(this.zendeskMapper[url]);
    } else {
      this.zendeskUrl = null;
    }
  }
}
