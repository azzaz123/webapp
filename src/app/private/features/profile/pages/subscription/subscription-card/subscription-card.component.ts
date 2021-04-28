import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CATEGORY_IDS } from '@core/category/category-ids';
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
  @Output() buttonClick: EventEmitter<void> = new EventEmitter();

  titleConfig = {
    [CATEGORY_IDS.CAR]: $localize`:@@web_profile_pages_subscription_cars_desc:List all your cars`,
    [CATEGORY_IDS.MOTORBIKE]: $localize`:@@web_profile_pages_subscription_motorbike_desc:List all your motorbikes`,
    [CATEGORY_IDS.MOTOR_ACCESSORIES]: $localize`:@@web_profile_pages_subscription_motor_acc_desc:List all your Motor and Accessories items`,
    [CATEGORY_IDS.EVERYTHING_ELSE]: $localize`:@@web_profile_pages_subscription_other_desc:Your best plan to sell all kinds of items`,
  };

  subcriptionBenefits: string[] = [
    $localize`:@@web_subscription_benefit_title_visibility:Gain more visibility`,
    $localize`:@@web_subscription_benefit_title_time:Save management time`,
    $localize`:@@web_subscription_benefit_title_share:Share your phone and website`,
  ];

  get descriptionText(): string {
    return this.titleConfig[this.subscription.category_id];
  }

  get noSubscriptionBodyText(): string {
    return this.subscription.category_id !== CATEGORY_IDS.EVERYTHING_ELSE
      ? $localize`:@@web_subscription_benefit_title_limit:Set your listing limit`
      : $localize`:@@web_subscription_benefit_title_branding:Boost your branding`;
  }

  get subscriptionBodyText(): string {
    return this.subscription.selected_tier.limit
      ? $localize`:@@web_profile_pages_subscription_325:List up to ${this.subscription.selected_tier.limit} items`
      : $localize`:@@web_profile_pages_subscription_586:List without limits`;
  }

  get iconSrc(): string {
    const status = this.isSubscribed ? 'normal' : 'disabled';
    return `/assets/icons/categories/${status}/${this.subscription.category_icon}.svg`;
  }

  public onButtonClick(): void {
    this.buttonClick.emit();
  }
}
