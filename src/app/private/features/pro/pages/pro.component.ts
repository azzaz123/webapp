import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { CUSTOMER_HELP_PAGE } from '@core/external-links/customer-help/customer-help-constants';
import { CustomerHelpService } from '@core/external-links/customer-help/customer-help.service';
import { InvoiceService } from '@core/invoice/invoice.service';
import { SubscriptionBenefitsService } from '@core/subscriptions/subscription-benefits/services/subscription-benefits.service';
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
import { Observable, Subscription } from 'rxjs';
import { filter, switchMap, take, tap } from 'rxjs/operators';
import { PRO_PATHS } from '../pro-routing-constants';

@Component({
  selector: 'tsl-pro',
  templateUrl: './pro.component.html',
  styleUrls: ['./pro.component.scss'],
})
export class ProComponent implements OnInit, OnDestroy {
  public readonly PERMISSIONS = PERMISSIONS;
  public readonly PRO_PATHS = PRO_PATHS;
  public helpPageUrl: string;
  public showNavigation: boolean;
  public isPro$: Observable<boolean> = new Observable();
  public showBenefits$: Observable<boolean> = new Observable();
  private hasOneTrialSubscription: boolean;
  private hasSomeDiscount: boolean;
  private subscriptions: Subscription = new Subscription();
  private readonly customerHelpUrlMapper: Record<string, CUSTOMER_HELP_PAGE> = {
    [PRO_PATHS.BILLING]: CUSTOMER_HELP_PAGE.BILLING_INFO,
  };
  constructor(
    private userService: UserService,
    private analyticsService: AnalyticsService,
    private subscriptionService: SubscriptionsService,
    private router: Router,
    private customerHelpService: CustomerHelpService,
    private invoiceService: InvoiceService,
    private benefitsService: SubscriptionBenefitsService
  ) {}

  ngOnInit() {
    this.isPro$ = this.userService.isProUser$;
    this.showBenefits$ = this.benefitsService.showHeaderBenefits$;
    this.getSubscriptions();
    this.subscribeRoute();
    this.setCustomerHelpUrl(this.router.url);
    this.isNavigationBarShown();
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

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  private isNavigationBarShown(): void {
    const subscription = this.isPro$
      .pipe(
        tap((isPro) => {
          this.showNavigation = isPro;
        }),
        filter((isPro) => !isPro),
        switchMap(() => this.invoiceService.getInvoiceTransactions().pipe(take(1)))
      )
      .subscribe(
        (invoiceTransactions) => {
          this.showNavigation = !!invoiceTransactions.length;
        },
        () => {
          this.showNavigation = true;
        }
      );
    this.subscriptions.add(subscription);
  }

  private getSubscriptions(): void {
    const subscription = this.subscriptionService.getSubscriptions().subscribe((subscriptions) => {
      if (!!subscriptions) {
        this.hasOneTrialSubscription = this.subscriptionService.hasOneTrialSubscription(subscriptions);
        this.hasSomeDiscount = this.subscriptionService.hasSomeSubscriptionDiscount(subscriptions);
      }
    });
    this.subscriptions.add(subscription);
  }

  private subscribeRoute(): void {
    const subscription = this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
      this.setCustomerHelpUrl(event.url);
    });
    this.subscriptions.add(subscription);
  }

  private setCustomerHelpUrl(url: string): void {
    const parsedUrl = url.replace(PRO_PATHS.PRO_MANAGER, '').replace(/\//g, '');
    const isUrlMapped = parsedUrl in this.customerHelpUrlMapper;
    this.helpPageUrl = isUrlMapped ? this.customerHelpService.getPageUrl(this.customerHelpUrlMapper[parsedUrl]) : null;
  }
}
