import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CATEGORY_SUBSCRIPTIONS_IDS } from '@core/subscriptions/category-subscription-ids';
import { SubscriptionsResponse, Tier } from '@core/subscriptions/subscriptions.interface';

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
  @Input() tierDiscount: Tier;
  @Input() isMobile: boolean;
  @Output() buttonClick: EventEmitter<void> = new EventEmitter();

  public readonly titleConfig = {
    [CATEGORY_SUBSCRIPTIONS_IDS.CAR]: $localize`:@@web_profile_pages_subscription_cars_desc:List all your cars`,
    [CATEGORY_SUBSCRIPTIONS_IDS.MOTORBIKE]: $localize`:@@web_profile_pages_subscription_motorbike_desc:List all your motorbikes`,
    [CATEGORY_SUBSCRIPTIONS_IDS.MOTOR_ACCESSORIES]: $localize`:@@web_profile_pages_subscription_motor_acc_desc:List all your Motor and Accessories items`,
    [CATEGORY_SUBSCRIPTIONS_IDS.REAL_ESTATE]: $localize`:@@web_profile_pages_subscription_real_estate_desc:List all your real estate`,
    [CATEGORY_SUBSCRIPTIONS_IDS.CONSUMER_GOODS]: $localize`:@@web_profile_pages_subscription_other_desc:Your best plan to sell all kinds of items`,
  };

  public onClick(): void {
    this.buttonClick.emit();
  }

  public onClickCard(): void {
    if (!this.isMobile) {
      this.buttonClick.emit();
    }
  }

  get descriptionText(): string {
    return this.isSubscribed ? this.subscriptionBodyText : this.titleConfig[this.subscription.category_id];
  }

  get subscriptionBodyText(): string {
    return this.subscription.selected_tier.limit
      ? $localize`:@@pro_subscription_purchase_subscription_details_list_tier_text:Manage up to ${this.subscription.selected_tier.limit}:INTERPOLATION: items`
      : $localize`:@@pro_subscription_purchase_subscription_details_list_unlimited_tier_text:Manage unlimited active item`;
  }

  public extraBumpsText(quantity: number): string {
    return quantity === 1
      ? $localize`:@@pro_manage_subscriptions_view_active_subscriptions_details_extra_bumps_pending_part_2_text_web_specific.one:Highlight ${quantity}:INTERPOLATION: extra item`
      : $localize`:@@pro_manage_subscriptions_view_active_subscriptions_details_extra_bumps_pending_part_2_text_web_specific.other:Highlight ${quantity}:INTERPOLATION: extra items`;
  }

  get iconSrc(): string {
    return `/assets/images/subscriptions/types/${this.subscription.category_icon}.svg`;
  }

  get hasBumpsAvailable(): boolean {
    return !!this.subscription.tiers.find((tier) => tier.bumps.length);
  }
}
