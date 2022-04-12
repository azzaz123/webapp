import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { BumpPackageBalance } from '@api/core/model/bumps/bumps-package-balance.interface';
import { SubscriptionsResponse } from '@core/subscriptions/subscriptions.interface';
@Component({
  selector: 'tsl-subscription-header-checkout',
  templateUrl: './subscription-header-checkout.component.html',
  styleUrls: ['./subscription-header-checkout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubscriptionHeaderCheckoutComponent {
  @Input() subscription: SubscriptionsResponse;
  @Input() balance: BumpPackageBalance[];

  public getBumpQuantityText(quantity: number): string {
    switch (quantity) {
      case 0:
        return $localize`:@@highlight_item_view_pro_user_item_card_bump_counter_bubble_2v_web_specific.zero:You can’t highlight more items`;
      case 1:
        return $localize`:@@highlight_item_view_pro_user_item_card_bump_counter_bubble_2v_web_specific.one:You can highlight ${quantity}:INTERPOLATION: item`;
      default:
        return $localize`:@@highlight_item_view_pro_user_item_card_bump_counter_bubble_2v_web_specific.other:You can highlight ${quantity}:INTERPOLATION: items`;
    }
  }
}
