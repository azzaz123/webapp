import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CATEGORY_SUBSCRIPTIONS_IDS } from '@core/subscriptions/category-subscription-ids';
import { SubscriptionsResponse } from '@core/subscriptions/subscriptions.interface';

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
  @Output() buttonClick: EventEmitter<void> = new EventEmitter();

  public readonly titleConfig = {
    [CATEGORY_SUBSCRIPTIONS_IDS.CAR]: $localize`:@@web_profile_pages_subscription_cars_desc:List all your cars`,
    [CATEGORY_SUBSCRIPTIONS_IDS.MOTORBIKE]: $localize`:@@web_profile_pages_subscription_motorbike_desc:List all your motorbikes`,
    [CATEGORY_SUBSCRIPTIONS_IDS.MOTOR_ACCESSORIES]: $localize`:@@web_profile_pages_subscription_motor_acc_desc:List all your Motor and Accessories items`,
    [CATEGORY_SUBSCRIPTIONS_IDS.EVERYTHING_ELSE]: $localize`:@@web_profile_pages_subscription_other_desc:Your best plan to sell all kinds of items`,
  };

  get descriptionText(): string {
    return this.titleConfig[this.subscription.category_id];
  }

  get subscriptionBodyText(): string {
    return this.subscription.selected_tier.limit
      ? $localize`:@@web_profile_pages_subscription_325:List up to ${this.subscription.selected_tier.limit} items`
      : $localize`:@@web_profile_pages_subscription_586:List without limits`;
  }

  get iconSrc(): string {
    const status = this.isSubscribed ? 'disabled' : 'normal';
    return `/assets/icons/categories/${status}/${this.subscription.category_icon}.svg`;
  }

  public onButtonClick(): void {
    this.buttonClick.emit();
  }
}
