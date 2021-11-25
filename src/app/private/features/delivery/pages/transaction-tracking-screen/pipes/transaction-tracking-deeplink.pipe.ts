import { Inject, LOCALE_ID, Pipe, PipeTransform } from '@angular/core';
import { APP_LOCALE } from '@configs/subdomains.config';
import { mapDeeplinkToCustomerHelpForm } from '@core/external-links/deeplink-to-customer-help-form/deeplink-to-customer-help-form.mapper';
import { mapDeeplinkToCustomerHelp } from '@core/external-links/deeplink-to-customer-help/deeplink-to-customer-help.mapper';
import { ItemDetailRoutePipe, UserProfileRoutePipe } from '@shared/pipes';

@Pipe({
  name: 'transactionTrackingDeeplink',
})
export class TransactionTrackingDeeplinkPipe implements PipeTransform {
  private readonly itemDeeplinkPrefix = 'wallapop://i/';
  private readonly userProfileDeeplinkPrefix = 'wallapop://p/';
  private readonly printableLabelPrefix = 'wallapop://trackinglabel?url=';
  private readonly customerSupportArticlePrefix = 'wallapop://customerSupport/faq/article?z=';
  private readonly customerSupportFormPrefix = 'wallapop://customerSupport/form?f=';

  constructor(
    @Inject(LOCALE_ID) private locale: APP_LOCALE,
    private itemDetailRoutePipe: ItemDetailRoutePipe,
    private userProfileRoutePipe: UserProfileRoutePipe
  ) {}

  transform(deeplink: string): string {
    const isItemURL = deeplink.startsWith(this.itemDeeplinkPrefix);
    const isUserURL = deeplink.startsWith(this.userProfileDeeplinkPrefix);
    const isPrintableLabelURL = deeplink.startsWith(this.printableLabelPrefix);
    const isCustomerHelpURL = deeplink.startsWith(this.customerSupportArticlePrefix);
    const isCustomerHelpFormURL = deeplink.startsWith(this.customerSupportFormPrefix);

    let mappedURL: string = null;

    if (isCustomerHelpURL) {
      mappedURL = mapDeeplinkToCustomerHelp(this.locale, deeplink);
    }

    if (isCustomerHelpFormURL) {
      mappedURL = mapDeeplinkToCustomerHelpForm(this.locale, deeplink);
    }

    if (isPrintableLabelURL) {
      mappedURL = deeplink.split(this.printableLabelPrefix)[1];
    }

    if (isItemURL) {
      const id = deeplink.split(this.itemDeeplinkPrefix)[1];
      mappedURL = this.itemDetailRoutePipe.transform(id);
    }

    if (isUserURL) {
      // askSlug
      const id = deeplink.split(this.userProfileDeeplinkPrefix)[1];
      mappedURL = this.userProfileRoutePipe.transform('', id);
    }

    return mappedURL ?? deeplink;
  }
}

// BarcodeLabelDeeplink -> "wallapop://delivery/barcode?b=${deliveryTag.asString()}"

// PackagingInstructionsDeeplink -> "wallapop://shipping/transactiontracking/instructions?request_id=$requestId&type=${Packaging.asString()}"
// CheckDeliveryInstructionsDeeplink -> "wallapop://shipping/transactiontracking/instructions?request_id=$requestId&type=${CheckDelivery.asString()}"
