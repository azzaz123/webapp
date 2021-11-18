import { Inject, Injectable, LOCALE_ID } from '@angular/core';
import { TransactionTrackingActionDetail } from '@api/core/model/delivery/transaction/tracking';
import { APP_LOCALE } from '@configs/subdomains.config';
import { mapDeeplinkToCustomerHelp } from '@core/external-links/deeplink-to-customer-help/deeplink-to-customer-help.mapper';
@Injectable()
export class TransactionTrackingActionsService {
  constructor(@Inject(LOCALE_ID) private locale: APP_LOCALE) {}

  public manageAction(action: TransactionTrackingActionDetail): void {
    if (action.isDeeplink) {
      const deeplinkURLMapped = mapDeeplinkToCustomerHelp(this.locale, action.payload.linkUrl);
      this.navigateToAnExternalPage(deeplinkURLMapped);
    }

    if (action.isCarrierTrackingWebview) {
      this.navigateToAnExternalPage(action.payload.linkUrl);
    }
  }

  private navigateToAnExternalPage(URL: string): void {
    window.open(URL, '_blank');
  }
}
