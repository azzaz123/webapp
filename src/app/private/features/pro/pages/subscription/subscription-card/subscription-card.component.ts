import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CATEGORY_SUBSCRIPTIONS_IDS } from '@core/subscriptions/category-subscription-ids';
import { SubscriptionsResponse, TierDiscount } from '@core/subscriptions/subscriptions.interface';

@Component({
  selector: 'tsl-subscription-card',
  templateUrl: './subscription-card.component.html',
  styleUrls: ['./subscription-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubscriptionCardComponent {
  @Input() subscription: SubscriptionsResponse;
  @Input() textButton: string;
  @Input() hasTrialAvailable: boolean;
  @Input() isSubscribed: boolean;
  @Input() subscriptionBenefits: string[];
  @Input() discount: TierDiscount;
  @Output() buttonClick: EventEmitter<void> = new EventEmitter();

  public readonly titleConfig = {
    [CATEGORY_SUBSCRIPTIONS_IDS.CAR]: $localize`:@@web_profile_pages_subscription_cars_desc:List all your cars`,
    [CATEGORY_SUBSCRIPTIONS_IDS.MOTORBIKE]: $localize`:@@web_profile_pages_subscription_motorbike_desc:List all your motorbikes`,
    [CATEGORY_SUBSCRIPTIONS_IDS.MOTOR_ACCESSORIES]: $localize`:@@web_profile_pages_subscription_motor_acc_desc:List all your Motor and Accessories items`,
    [CATEGORY_SUBSCRIPTIONS_IDS.REAL_ESTATE]: $localize`:@@web_profile_pages_subscription_real_estate_desc:List all your real estate`,
    [CATEGORY_SUBSCRIPTIONS_IDS.EVERYTHING_ELSE]: $localize`:@@web_profile_pages_subscription_other_desc:Your best plan to sell all kinds of items`,
  };

  public onButtonClick(): void {
    this.buttonClick.emit();
  }

  get descriptionText(): string {
    return this.titleConfig[this.subscription.category_id];
  }

  get subscriptionBodyText(): string {
    return this.subscription.selected_tier.limit
      ? this.getTextWithLimit(this.subscription.selected_tier.limit)
      : $localize`:@@web_profile_pages_subscription_586:List without limits`;
  }

  private getTextWithLimit(limit: number): string {
    return this.subscription.category_id === CATEGORY_SUBSCRIPTIONS_IDS.REAL_ESTATE
      ? $localize`:@@web_profile_pages_subscription_332:List up to ${limit} real estate`
      : $localize`:@@web_profile_pages_subscription_325:List up to ${limit} items`;
  }

  get iconSrc(): string {
    const status = this.isSubscribed ? 'disabled' : 'normal';
    return `/assets/icons/categories/${status}/${this.subscription.category_icon}.svg`;
  }

  get labelText(): string {
    if (this.hasTrialAvailable || !this.discount) {
      return $localize`:web_subscription_price_discount_days_trial_free:${this.subscription.trial_days}-day trial for free`;
    }
    return $localize`:web_subscription_price_discount_days_trial_free:${this.subscription.trial_days}-day trial for free`;
  }
}
