import {
  Component,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { AnalyticsService } from '@core/analytics/analytics.service';
import {
  SCREEN_IDS,
  ANALYTICS_EVENT_NAMES,
  AnalyticsPageView,
  ClickProSubscription,
} from '@core/analytics/analytics-constants';
import { Router } from '@angular/router';
import { SubscriptionsService } from '@core/subscriptions/subscriptions.service';
import { Subscription } from 'rxjs';
import { UserService } from '@core/user/user.service';
import { RemoveProSubscriptionBanner } from '@core/analytics/resources/events-interfaces/remove-pro-subscription-banner.interface';

export const LOCAL_STORAGE_TRY_PRO_SLOT = 'try-pro-slot';

@Component({
  selector: 'tsl-try-pro-slot',
  templateUrl: './try-pro-slot.component.html',
  styleUrls: ['./try-pro-slot.component.scss'],
})
export class TryProSlotComponent implements OnInit, OnDestroy {
  @Output() close: EventEmitter<void> = new EventEmitter();
  private hasTrial: boolean;
  private subscriptionSubscription: Subscription;

  constructor(
    private router: Router,
    private analyticsService: AnalyticsService,
    private subscriptionService: SubscriptionsService,
    private userService: UserService
  ) {}

  get CTAtext(): string {
    return this.hasTrial
      ? $localize`:@@TryProSlotCTAtrial:Become a PRO for free`
      : $localize`:@@TryProSlotCTAPlans:More information`;
  }

  ngOnInit(): void {
    this.subscribeSubscriptions();
  }

  private subscribeSubscriptions(): void {
    this.subscriptionSubscription = this.subscriptionService
      .getSubscriptions()
      .subscribe((subscriptions) => {
        this.hasTrial = this.subscriptionService.hasOneTrialSubscription(
          subscriptions
        );
      });
  }

  public onClose(): void {
    const event: AnalyticsPageView<RemoveProSubscriptionBanner> = {
      name: ANALYTICS_EVENT_NAMES.RemoveProSubscriptionBanner,
      attributes: {
        screenId: SCREEN_IDS.MyCatalog,
        freeTrial: this.hasTrial,
      },
    };
    this.analyticsService.trackPageView(event);
    this.setClosed();
    this.close.emit();
  }

  public onClick(): void {
    const event: AnalyticsPageView<ClickProSubscription> = {
      name: ANALYTICS_EVENT_NAMES.ClickProSubscription,
      attributes: {
        screenId: SCREEN_IDS.MyCatalog,
        freeTrial: this.hasTrial,
      },
    };
    this.analyticsService.trackPageView(event);
    this.router.navigate(['profile/subscriptions']);
  }

  private setClosed(): void {
    if (this.userService.user) {
      localStorage.setItem(
        `${this.userService.user.id}-${LOCAL_STORAGE_TRY_PRO_SLOT}`,
        'true'
      );
    }
  }

  ngOnDestroy(): void {
    if (this.subscriptionSubscription) {
      this.subscriptionSubscription.unsubscribe();
    }
  }
}
