import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { SubscriptionsResponse, Tier } from '@core/subscriptions/subscriptions.interface';

@Component({
  selector: 'tsl-subscription-tier-selector',
  templateUrl: './subscription-tier-selector.component.html',
  styleUrls: ['./subscription-tier-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubscriptionTierSelectorComponent {
  @Input() subscription: SubscriptionsResponse;
  @Input() selectedTier: Tier;
  @Input() tierList: Tier[];
  @Input() disableHover: boolean;
  @Output() changeSelectedTier: EventEmitter<Tier> = new EventEmitter();

  get tiers(): Tier[] {
    return this.tierList ? this.tierList : this.subscription.tiers;
  }

  public onTierSelectedChanged(event: Tier): void {
    this.changeSelectedTier.emit(event);
  }

  public getLimitText(tier: Tier): string {
    return tier.limit
      ? $localize`:@@pro_subscription_purchase_subscription_details_list_tier_text:Manage up to ${tier.limit}:INTERPOLATION: items`
      : $localize`:@@pro_subscription_purchase_subscription_details_list_unlimited_tier_text:Manage unlimited active item`;
  }
}
