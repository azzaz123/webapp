import { Injectable, Injector } from '@angular/core';

import { APP_LOCALE } from '@configs/subdomains.config';
import { DELIVERY_PATHS } from '@private/features/delivery/delivery-routing-constants';
import { EXTERNAL_CUSTOMER_TICKET_FORM_PAGE_ID } from '@core/external-links/customer-help/enums/external-customer-ticket-form-page-id.enum';
import { getCustomerHelpUrl, UNIFIED_EXTERNAL_CUSTOMER_HELP_PAGE_ID } from '@core/external-links/customer-help/get-customer-help-url';
import { getTicketFormUrl } from '@core/external-links/customer-help/get-ticket-form-url';
import { HELP_LOCALE_BY_APP_LOCALE } from '@core/external-links/customer-help/constants/customer-help-locale';
import { ItemDetailRoutePipe, UserProfileRoutePipe } from '@shared/pipes';
import { PRIVATE_PATHS } from '@private/private-routing-constants';
import { TRANSACTION_TRACKING_PATHS } from '@private/features/delivery/pages/transaction-tracking-screen/transaction-tracking-screen-routing-constants';

const checkDeliveryInstructionsPrefix = 'wallapop://shipping/transactiontracking/instructions?'; // request_id=$requestId&type=${Packaging.asString()}';
const customerSupportArticlePrefix = 'wallapop://customerSupport/faq/article?z=';
const customerSupportFormPrefix = 'wallapop://customerSupport/form?f=';
const itemDeeplinkPrefix = 'wallapop://i/';
const packagingInstructionsPrefix = 'wallapop://shipping/transactiontracking/instructions?'; // request_id=$requestId&type=${Packaging.asString()}';
const printableLabelPrefix = 'wallapop://trackinglabel?url=';
const userProfileDeeplinkPrefix = 'wallapop://p/';

/*
Done -> ItemDeeplink -> "wallapop://i/$itemId"
Done -> UserProfileDeeplink -> "wallapop://p/$userId"
3th iteration -> OpenDisputeDeeplink -> "wallapop://selfservice/dispute/create/select-issue?t=$transactionId"
Done -> PrintableLabelDeeplink ->"wallapop://trackinglabel?url=${printableTagUrl.value}"
Pending -> BarcodeLabelDeeplink -> "wallapop://delivery/barcode?b=${deliveryTag.asString()}"
Done -> PackagingInstructionsDeeplink -> "wallapop://shipping/transactiontracking/instructions?request_id=$requestId&type=${Packaging.asString()}"
Done -> CheckDeliveryInstructionsDeeplink -> "wallapop://shipping/transactiontracking/instructions?request_id=$requestId&type=${CheckDelivery.asString()}"
3th iteration -> CheckoutDeeplink -> "wallapop://delivery/checkout?i=$itemHash"
4th iteration -> BuyerManageDisputeDeeplink -> "wallapop://selfservice/dispute?t=$transactionId&d=$disputeId&b=true"
4th iteration -> SellerManageDisputeDeeplink -> "wallapop://selfservice/dispute?t=$transactionId&d=$disputeId&b=false"
4th iteration -> CreateDisputeZendeskFormDeepLink -> "wallapop://customerSupport/form?f=360003316777"
4th iteration -> TransactionExperienceRatingDeeplink - > "wallapop://delivery/transaction/experience-rating?transaction_id=${transactionId.asString()}"
Donet -> ZendeskArticleDeeplink -> "wallapop://customerSupport/faq/article?z=%s"

*/

type deeplinkType = 'unknown' | 'instructions' | 'item' | 'printable' | 'supportArticle' | 'supportForm' | 'userProfile';

@Injectable()
export class DeeplinkService {
  private itemDetailRoutePipe: ItemDetailRoutePipe;
  private userProfileRoutePipe: UserProfileRoutePipe;

  constructor() {
    const injector: Injector = Injector.create({ providers: [{ provide: ItemDetailRoutePipe }, { provide: UserProfileRoutePipe }] });
    this.itemDetailRoutePipe = injector.get(ItemDetailRoutePipe);
    this.userProfileRoutePipe = injector.get(UserProfileRoutePipe);
  }

  public toWebLink(deeplink: string, locale: APP_LOCALE): string {
    if (!deeplink) {
      return null;
    }

    const deeplinkMappers: Record<deeplinkType, string> = {
      instructions: this.getInstructionsWebLink(deeplink),
      item: this.getItemWebLink(deeplink),
      printable: this.getPrintableWebLink(deeplink),
      supportArticle: this.getSupportArticleWebLink(deeplink, locale),
      supportForm: this.getSupportFormWebLink(deeplink, locale),
      userProfile: this.getUserProfileWebLink(deeplink),
      unknown: null,
    };
    return deeplinkMappers[this.getDeeplinkType(deeplink)];
  }

  private getDeeplinkType(deeplink: string): deeplinkType {
    if (deeplink.startsWith(checkDeliveryInstructionsPrefix)) {
      return 'instructions';
    }
    if (deeplink.startsWith(packagingInstructionsPrefix)) {
      return 'instructions';
    }
    if (deeplink.startsWith(itemDeeplinkPrefix)) {
      return 'item';
    }
    if (deeplink.startsWith(userProfileDeeplinkPrefix)) {
      return 'userProfile';
    }
    if (deeplink.startsWith(printableLabelPrefix)) {
      return 'printable';
    }
    if (deeplink.startsWith(customerSupportArticlePrefix)) {
      return 'supportArticle';
    }
    if (deeplink.startsWith(customerSupportFormPrefix)) {
      return 'supportForm';
    }
    return 'unknown';
  }

  private getInstructionsWebLink(deeplink: string): string {
    const regExp: RegExp = new RegExp(/\w+=\w+/g);
    const id = deeplink.match(regExp);
    const request_id = !!id && !!id[0] ? id[0].split('=')[1] : null;
    const type = !!id && !!id[1] ? id[1].split('=')[1] : null;
    return `${PRIVATE_PATHS.DELIVERY}/${DELIVERY_PATHS.TRACKING}/${TRANSACTION_TRACKING_PATHS.INSTRUCTIONS}/${request_id}/${type}`;
  }

  private getItemWebLink(deeplink: string): string {
    const id = deeplink.split(itemDeeplinkPrefix)[1];
    return this.itemDetailRoutePipe.transform(id);
  }

  private getPrintableWebLink(deeplink: string): string {
    return deeplink.split(printableLabelPrefix)[1];
  }

  private getSupportArticleWebLink(deeplink: string, locale: APP_LOCALE): string {
    const HELP_LOCALE = HELP_LOCALE_BY_APP_LOCALE[locale];
    const articleId = deeplink.split('z=')[1] ?? null;
    return !!articleId ? getCustomerHelpUrl(articleId as unknown as UNIFIED_EXTERNAL_CUSTOMER_HELP_PAGE_ID, HELP_LOCALE) : null;
  }

  private getSupportFormWebLink(deeplink: string, locale: APP_LOCALE): string {
    const HELP_LOCALE = HELP_LOCALE_BY_APP_LOCALE[locale];
    const formId = deeplink.split('f=')[1] ?? null;
    return !!formId ? getTicketFormUrl(formId as unknown as EXTERNAL_CUSTOMER_TICKET_FORM_PAGE_ID, HELP_LOCALE) : null;
  }

  private getUserProfileWebLink(deeplink: string): string {
    const id = deeplink.split(userProfileDeeplinkPrefix)[1];
    // TODO -> Ask for webSlug parameter
    return this.userProfileRoutePipe.transform('', id);
  }
}
