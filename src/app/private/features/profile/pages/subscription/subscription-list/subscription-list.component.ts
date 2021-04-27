import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { SubscriptionsResponse } from '@core/subscriptions/subscriptions.interface';
import { SubscriptionsService } from '@core/subscriptions/subscriptions.service';

@Component({
  selector: 'tsl-subscription-list',
  templateUrl: './subscription-list.component.html',
  styleUrls: ['./subscription-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubscriptionListComponent {
  @Input() isLoading: boolean;
  @Input() subscriptions: SubscriptionsResponse[];
  @Output() openSubscriptionModal: EventEmitter<SubscriptionsResponse> = new EventEmitter();

  constructor(private subscriptionsService: SubscriptionsService) {}

  private showEdit(subscription: SubscriptionsResponse): boolean {
    return !this.subscriptionsService.isSubscriptionInApp(subscription) && subscription.tiers.length !== 1;
  }

  private showCancel(subscription: SubscriptionsResponse): boolean {
    return !this.subscriptionsService.isSubscriptionInApp(subscription) && subscription.tiers.length === 1;
  }

  private showManageInApp(subscription: SubscriptionsResponse): boolean {
    return this.subscriptionsService.isSubscriptionInApp(subscription) && !this.subscriptionsService.hasOneFreeTier(subscription);
  }

  private showUnsubscribeFirst(subscription: SubscriptionsResponse): boolean {
    return this.subscriptionsService.isSubscriptionInApp(subscription) && this.subscriptionsService.hasOneFreeTier(subscription);
  }

  public hasOneFreeSubscription(subscription: SubscriptionsResponse): boolean {
    return this.subscriptionsService.hasTrial(subscription);
  }

  public isSuscribed(subscription: SubscriptionsResponse): boolean {
    return !!subscription.subscribed_from;
  }

  public getTextButton(subscription: SubscriptionsResponse): string {
    if (!subscription.subscribed_from) {
      return this.hasOneFreeSubscription(subscription) ? $localize`:@@startFreeTrial:Start free trial` : $localize`:@@seePlans:See plans`;
    }

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

  public onOpenSubscriptionModal(subscription: SubscriptionsResponse): void {
    this.openSubscriptionModal.emit(subscription);
  }
}
