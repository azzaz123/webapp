import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CATEGORY_SUBSCRIPTIONS_IDS } from '@core/subscriptions/category-subscription-ids';
import { SubscriptionBenefitsService } from '@core/subscriptions/subscription-benefits/services/subscription-benefits.service';
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
  @Output() clickButton: EventEmitter<SubscriptionsResponse> = new EventEmitter();
  MAX_NARROW_CARDS = 4;
  public readonly HELP_LINK = $localize`:@@web_wallapop_pro_about_href:https://ayuda.wallapop.com/hc/en-us/sections/360001165358-What-is-a-PRO-subscription-`;
  private readonly rowOrder = [
    CATEGORY_SUBSCRIPTIONS_IDS.EVERYTHING_ELSE,
    CATEGORY_SUBSCRIPTIONS_IDS.MOTOR_ACCESSORIES,
    CATEGORY_SUBSCRIPTIONS_IDS.REAL_ESTATE,
    CATEGORY_SUBSCRIPTIONS_IDS.CAR,
    CATEGORY_SUBSCRIPTIONS_IDS.MOTORBIKE,
  ];

  get subscriptionsOrdered(): SubscriptionsResponse[] {
    return this.orderByCategory(this.rowOrder);
  }

  constructor(private subscriptionsService: SubscriptionsService, private benefitsService: SubscriptionBenefitsService) {}

  public hasOneFreeSubscription(subscription: SubscriptionsResponse): boolean {
    return this.subscriptionsService.hasTrial(subscription);
  }

  public isSubscribed(subscription: SubscriptionsResponse): boolean {
    return !!subscription.subscribed_from;
  }

  public getTextButton(subscription: SubscriptionsResponse): string {
    if (!subscription.subscribed_from) {
      return this.hasOneFreeSubscription(subscription)
        ? $localize`:@@web_start_free_trial:Start free trial`
        : this.getNotFreeTrialText(subscription);
    }
    if (subscription.subscribed_until) {
      return $localize`:@@web_profile_pages_subscription_331:Stay subscribed`;
    }
    if (this.showEdit(subscription)) {
      return $localize`:@@web_profile_pages_subscription_587:Modify`;
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

  public onClickButton(subscription: SubscriptionsResponse): void {
    this.clickButton.emit(subscription);
  }

  public getBenefits(subscription: SubscriptionsResponse): string[] {
    return this.benefitsService.getBenefitsByCategory(subscription.category_id);
  }
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

  private getNotFreeTrialText(subscription: SubscriptionsResponse): string {
    return subscription.tiers.length > 1 ? $localize`:@@web_see_plans:See plans` : $localize`:@@web_start:Start`;
  }

  private orderByCategory(order: number[]): SubscriptionsResponse[] {
    return order.map((categoryId) => {
      return this.subscriptions.find((subscription) => subscription.category_id === categoryId);
    });
  }
}
