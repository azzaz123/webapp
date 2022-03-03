import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { BUMP_NAMES, SubscriptionsResponse } from '@core/subscriptions/subscriptions.interface';
@Component({
  selector: 'tsl-subscription-header-checkout',
  templateUrl: './subscription-header-checkout.component.html',
  styleUrls: ['./subscription-header-checkout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubscriptionHeaderCheckoutComponent {
  @Input() subscription: SubscriptionsResponse;

  public getBumpName(bumpType: BUMP_NAMES): string {
    switch (bumpType) {
      case BUMP_NAMES.ZONEBUMP:
        return $localize`:@@web_cart_454:Local`;
      case BUMP_NAMES.CITYBUMP:
        return $localize`:@@web_cart_663:City`;
      case BUMP_NAMES.COUNTRYBUMP:
        return $localize`:@@web_cart_664:Country`;
      default:
        return '';
    }
  }
}
