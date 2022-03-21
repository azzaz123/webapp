import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { BumpPackageBalance } from '@api/core/model/bumps/bumps-package-balance.interface';
import { BUMP_NAMES, SubscriptionsResponse } from '@core/subscriptions/subscriptions.interface';
import { BUMP_TYPE } from '@api/core/model/bumps/bump.interface';
@Component({
  selector: 'tsl-subscription-header-checkout',
  templateUrl: './subscription-header-checkout.component.html',
  styleUrls: ['./subscription-header-checkout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubscriptionHeaderCheckoutComponent {
  @Input() subscription: SubscriptionsResponse;
  @Input() balance: BumpPackageBalance[];

  public getBumpName(bumpType: BUMP_TYPE): string {
    switch (bumpType) {
      case BUMP_TYPE.ZONE_BUMP:
        return $localize`:@@web_cart_454:Local`;
      case BUMP_TYPE.CITY_BUMP:
        return $localize`:@@web_cart_663:City`;
      case BUMP_TYPE.COUNTRY_BUMP:
        return $localize`:@@web_cart_664:Country`;
      default:
        return '';
    }
  }
}
