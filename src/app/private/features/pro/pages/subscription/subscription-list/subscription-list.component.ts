import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { SubscriptionBenefitsService } from '@core/subscriptions/subscription-benefits/services/subscription-benefits.service';
import { SubscriptionsResponse, SUBSCRIPTION_CATEGORY_TYPES, Tier } from '@core/subscriptions/subscriptions.interface';
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
  private readonly rowOrder = [
    SUBSCRIPTION_CATEGORY_TYPES.CONSUMER_GOODS,
    SUBSCRIPTION_CATEGORY_TYPES.OLD_CONSUMER_GOODS,
    SUBSCRIPTION_CATEGORY_TYPES.CAR_PARTS,
    SUBSCRIPTION_CATEGORY_TYPES.REAL_ESTATE,
    SUBSCRIPTION_CATEGORY_TYPES.CARS,
    SUBSCRIPTION_CATEGORY_TYPES.MOTORBIKES,
  ];

  get subscriptionsOrdered(): SubscriptionsResponse[] {
    return this.orderByCategory(this.rowOrder);
  }

  constructor(private subscriptionsService: SubscriptionsService, private benefitsService: SubscriptionBenefitsService) {}

  public hasOneFreeSubscription(subscription: SubscriptionsResponse): boolean {
    return this.subscriptionsService.hasTrial(subscription);
  }

  public hasDiscount(subscription: SubscriptionsResponse): Tier {
    return this.subscriptionsService.getDefaultTierDiscount(subscription);
  }

  public isSubscribed(subscription: SubscriptionsResponse): boolean {
    return !!subscription.subscribed_from;
  }

  public getTextButton(subscription: SubscriptionsResponse): string {
    if (!subscription.subscribed_from) {
      return this.getNotSubscribedButtonText(subscription);
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
  }

  public onClickButton(subscription: SubscriptionsResponse): void {
    this.clickButton.emit(subscription);
  }

  public getBenefits(subscription: SubscriptionsResponse): string[] {
    return this.benefitsService.getBenefitsByCategory(subscription.category_id);
  }

  private getNotSubscribedButtonText(subscription: SubscriptionsResponse): string {
    if (this.hasOneFreeSubscription(subscription)) {
      return $localize`:@@web_start_free_trial:Start free trial`;
    }

    if (this.hasDiscount(subscription)) {
      return $localize`:@@pro_subscription_purchase_try_discount_button:Try with discount`;
    }

    return this.getNotFreeTrialText(subscription);
  }

  private showEdit(subscription: SubscriptionsResponse): boolean {
    return !this.subscriptionsService.isSubscriptionInApp(subscription) && subscription.tiers.length !== 1;
  }

  private showCancel(subscription: SubscriptionsResponse): boolean {
    return !this.subscriptionsService.isSubscriptionInApp(subscription) && subscription.tiers.length === 1;
  }

  private showManageInApp(subscription: SubscriptionsResponse): boolean {
    return this.subscriptionsService.isSubscriptionInApp(subscription);
  }

  private getNotFreeTrialText(subscription: SubscriptionsResponse): string {
    return subscription.tiers.length > 1 ? $localize`:@@web_see_plans:See plans` : $localize`:@@web_start:Start`;
  }

  private orderByCategory(order: string[]): SubscriptionsResponse[] {
    return order.map((type) => {
      return this.subscriptions.find((subscription) => subscription.type === type);
    });
  }
}
