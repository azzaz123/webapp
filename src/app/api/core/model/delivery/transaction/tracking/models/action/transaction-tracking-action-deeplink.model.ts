import {
  TransactionTrackingActionAnalyticsModel,
  TransactionTrackingActionDeeplink,
  TransactionTrackingActionDetailAnalytics,
} from '@api/core/model/delivery/transaction/tracking';
import {
  TransactionTrackingActionDetailDto,
  TransactionTrackingActionDetailPayloadDto,
} from '@api/bff/delivery/transaction-tracking/dtos/responses';
import { Injector } from '@angular/core';
import { ItemDetailRoutePipe, UserProfileRoutePipe } from '@shared/pipes';

const itemDeeplinkPrefix = 'wallapop://i/';
const userProfileDeeplinkPrefix = 'wallapop://p/';
const printableLabelPrefix = 'wallapop://trackinglabel?url=';
const customerSupportArticlePrefix = 'wallapop://customerSupport/faq/article?z=';
const customerSupportFormPrefix = 'wallapop://customerSupport/form?f=';

export class TransactionTrackingActionDeeplinkModel implements TransactionTrackingActionDeeplink {
  public analytics?: TransactionTrackingActionDetailAnalytics;
  public isDeeplink: boolean = true;
  public linkUrl: string;

  constructor(actionDetailDto: TransactionTrackingActionDetailDto) {
    if (!!actionDetailDto.analytics) {
      this.analytics = new TransactionTrackingActionAnalyticsModel(actionDetailDto.analytics);
    }
    this.linkUrl = this.getLinkUrl(actionDetailDto.payload);
  }

  private convertToWebLink(deeplink: string): string {
    const isItemURL = deeplink.startsWith(itemDeeplinkPrefix);
    const isUserURL = deeplink.startsWith(userProfileDeeplinkPrefix);
    const isPrintableLabelURL = deeplink.startsWith(printableLabelPrefix);
    const isCustomerHelpURL = deeplink.startsWith(customerSupportArticlePrefix);
    const isCustomerHelpFormURL = deeplink.startsWith(customerSupportFormPrefix);
    let mappedURL: string = null;

    if (isCustomerHelpURL) {
      // mappedURL = mapDeeplinkToCustomerHelp(this.locale, deeplink);
    }
    if (isCustomerHelpFormURL) {
      // mappedURL = mapDeeplinkToCustomerHelpForm(this.locale, deeplink);
    }
    if (isPrintableLabelURL) {
      mappedURL = deeplink.split(printableLabelPrefix)[1];
    }
    if (isItemURL) {
      const id = deeplink.split(itemDeeplinkPrefix)[1];
      const injector: Injector = Injector.create({ providers: [{ provide: ItemDetailRoutePipe }, { provide: UserProfileRoutePipe }] });
      const itemDetailRoutePipe = injector.get(ItemDetailRoutePipe);

      mappedURL = itemDetailRoutePipe.transform(id);
    }
    if (isUserURL) {
      // askSlug
      const injector: Injector = Injector.create({ providers: [{ provide: ItemDetailRoutePipe }, { provide: UserProfileRoutePipe }] });
      const userProfileRoutePipe = injector.get(UserProfileRoutePipe);
      const id = deeplink.split(userProfileDeeplinkPrefix)[1];
      mappedURL = userProfileRoutePipe.transform('', id);
    }
    return mappedURL;
  }

  private getLinkUrl(actionDetailPayloadDto: TransactionTrackingActionDetailPayloadDto): string {
    return this.convertToWebLink((actionDetailPayloadDto as TransactionTrackingActionDeeplink).linkUrl) ?? undefined;
  }
}
