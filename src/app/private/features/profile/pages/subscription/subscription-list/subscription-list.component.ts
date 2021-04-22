import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SubscriptionsResponse } from '@core/subscriptions/subscriptions.interface';
import { SubscriptionsService } from '@core/subscriptions/subscriptions.service';

@Component({
  selector: 'tsl-subscription-list',
  templateUrl: './subscription-list.component.html',
  styleUrls: ['./subscription-list.component.scss'],
})
export class SubscriptionListComponent implements OnInit {
  @Input() isLoading: boolean;
  @Input() subscriptions: SubscriptionsResponse[];
  @Output() openSubscriptionModal: EventEmitter<SubscriptionsResponse> = new EventEmitter();

  constructor(private subscriptionsService: SubscriptionsService) {}

  ngOnInit(): void {}

  public showEdit(subscription: SubscriptionsResponse): boolean {
    return !this.subscriptionsService.isSubscriptionInApp(subscription) && subscription.tiers.length !== 1;
  }

  public showCancel(subscription: SubscriptionsResponse): boolean {
    return !this.subscriptionsService.isSubscriptionInApp(subscription) && subscription.tiers.length === 1;
  }

  public showManageInApp(subscription: SubscriptionsResponse): boolean {
    return this.subscriptionsService.isSubscriptionInApp(subscription) && !this.subscriptionsService.hasOneFreeTier(subscription);
  }

  public showUnsubscribeFirst(subscription: SubscriptionsResponse): boolean {
    return this.subscriptionsService.isSubscriptionInApp(subscription) && this.subscriptionsService.hasOneFreeTier(subscription);
  }

  public hasOneFreeSubscription(subscription: SubscriptionsResponse): boolean {
    return this.subscriptionsService.hasTrial(subscription);
  }

  public getLinkText(subscription: SubscriptionsResponse): string {
    if (subscription.subscribed_until) {
      return $localize`:web_profile_pages_subscription_331:Stay subscribed`;
    }
    if (this.showEdit(subscription)) {
      return $localize`:@@web_profile_pages_subscription_587:Edit`;
    }
    if (this.showCancel(subscription)) {
      return $localize`:@@web_profile_pages_subscription_678:Cancel`;
    }
    if (this.showManageInApp(subscription)) {
      return $localize`:@@web_profile_pages_subscription_327:Manage in app`;
    }
    if (this.showUnsubscribeFirst(subscription)) {
      return $localize`:@@web_profile_pages_subscription_328:Unsubscribe first from app for your free month`;
    }
  }

  public onOpenSubscriptionModal(subscription) {
    this.openSubscriptionModal.emit();
  }
}
