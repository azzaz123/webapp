import {
  Component,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { AnalyticsService } from '@core/analytics/analytics.service';
import {
  AnalyticsEvent,
  ClickCatalogManagement,
  SCREEN_IDS,
  ANALYTICS_EVENT_NAMES,
  ANALYTIC_EVENT_TYPES,
} from '@core/analytics/analytics-constants';
import { Router } from '@angular/router';
import { SubscriptionsService } from '@core/subscriptions/subscriptions.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'tsl-try-pro-slot',
  templateUrl: './try-pro-slot.component.html',
  styleUrls: ['./try-pro-slot.component.scss'],
})
export class TryProSlotComponent implements OnInit, OnDestroy {
  @Output() close: EventEmitter<void> = new EventEmitter();
  private hasTrial: boolean;
  private subscriptionSubscription: Subscription;
  buttonText;

  constructor(
    private router: Router,
    private analyticsService: AnalyticsService,
    private subscriptionService: SubscriptionsService
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
    this.close.emit();
  }

  public onClick(): void {
    const event: AnalyticsEvent<ClickCatalogManagement> = {
      name: ANALYTICS_EVENT_NAMES.ClickCatalogManagement,
      eventType: ANALYTIC_EVENT_TYPES.Other,
      attributes: {
        screenId: SCREEN_IDS.MyCatalog,
      },
    };
    this.router.navigate(['profile/subscriptions']);
  }

  ngOnDestroy(): void {
    if (this.subscriptionSubscription) {
      this.subscriptionSubscription.unsubscribe();
    }
  }
}
