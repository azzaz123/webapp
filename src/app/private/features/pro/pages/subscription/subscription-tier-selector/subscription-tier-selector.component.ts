import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CATEGORY_SUBSCRIPTIONS_IDS } from '@core/subscriptions/category-subscription-ids';
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
    return tier.limit ? this.getTextWithLimit(tier.limit) : $localize`:@@web_profile_pages_subscription_586:List without limits`;
  }

  public getTitleText(tier: Tier): string {
    if (!tier.limit_perk) {
      return 'Basic';
    }
    return this.getLimitText(tier);
  }

  private getTextWithLimit(limit: number): string {
    return this.subscription.category_id === CATEGORY_SUBSCRIPTIONS_IDS.REAL_ESTATE
      ? $localize`:@@web_profile_pages_subscription_332:List up to ${limit} real estate`
      : $localize`:@@web_profile_pages_subscription_325:List up to ${limit} items`;
  }
}
