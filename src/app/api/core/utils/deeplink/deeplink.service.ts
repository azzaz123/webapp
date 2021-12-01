import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, LOCALE_ID } from '@angular/core';
import { Router } from '@angular/router';

import { APP_LOCALE } from '@configs/subdomains.config';
import { DELIVERY_PATHS } from '@private/features/delivery/delivery-routing-constants';
import { EXTERNAL_CUSTOMER_TICKET_FORM_PAGE_ID } from '@core/external-links/customer-help/enums/external-customer-ticket-form-page-id.enum';
import { getCustomerHelpUrl, UNIFIED_EXTERNAL_CUSTOMER_HELP_PAGE_ID } from '@core/external-links/customer-help/get-customer-help-url';
import { getTicketFormUrl } from '@core/external-links/customer-help/get-ticket-form-url';
import { HELP_LOCALE_BY_APP_LOCALE } from '@core/external-links/customer-help/constants/customer-help-locale';
import { ItemDetailRoutePipe, UserProfileRoutePipe } from '@shared/pipes';
import { PRIVATE_PATHS } from '@private/private-routing-constants';
import { TRANSACTION_TRACKING_PATHS } from '@private/features/delivery/pages/transaction-tracking-screen/transaction-tracking-screen-routing-constants';

const barcodeLabelDeeplink = 'wallapop://delivery/barcode?b=';
const checkDeliveryInstructionsDeeplink = 'wallapop://shipping/transactiontracking/instructions?';
const createDisputeZendeskFormDeeplink = 'wallapop://customerSupport/form?f=';
const itemDeeplink = 'wallapop://i/';
const packagingInstructionsDeeplink = 'wallapop://shipping/transactiontracking/instructions?';
const printableLabelDeeplink = 'wallapop://trackinglabel?url=';
const userProfileDeeplink = 'wallapop://p/';
const zendeskArticleDeeplink = 'wallapop://customerSupport/faq/article?z=';

type deeplinkType =
  | 'unknown'
  | 'barcodeLabel'
  | 'instructions'
  | 'item'
  | 'printableLabel'
  | 'userProfile'
  | 'zendeskArticle'
  | 'zendeskForm';

@Injectable()
export class DeeplinkService {
  private window: Window;

  constructor(
    @Inject(LOCALE_ID) private locale: APP_LOCALE,
    @Inject(DOCUMENT) document: Document,
    private itemDetailRoutePipe: ItemDetailRoutePipe,
    private userProfileRoutePipe: UserProfileRoutePipe,
    private router: Router
  ) {
    this.window = document.defaultView;
  }

  public isAvailable(deeplink: string): boolean {
    const availabilities: Record<deeplinkType, boolean> = {
      barcodeLabel: true,
      instructions: true,
      item: true,
      printableLabel: true,
      unknown: false,
      userProfile: false,
      zendeskArticle: true,
      zendeskForm: false,
    };

    return availabilities[this.getDeeplinkType(deeplink)];
  }

  public isBarcodeLabelDeeplink(deeplink: string): boolean {
    return this.getDeeplinkType(deeplink) === 'barcodeLabel';
  }

  public isInstructionsDeeplink(deeplink: string): boolean {
    return this.getDeeplinkType(deeplink) === 'instructions';
  }

  public isItemDeeplink(deeplink: string): boolean {
    return this.getDeeplinkType(deeplink) === 'item';
  }

  public isPrintableLabelDeeplink(deeplink: string): boolean {
    return this.getDeeplinkType(deeplink) === 'printableLabel';
  }

  public isUserProfileDeeplink(deeplink: string): boolean {
    return this.getDeeplinkType(deeplink) === 'userProfile';
  }

  public isZendeskArticleDeeplink(deeplink: string): boolean {
    return this.getDeeplinkType(deeplink) === 'zendeskArticle';
  }

  public isZendeskCreateDisputeFormDeeplink(deeplink: string): boolean {
    return this.getDeeplinkType(deeplink) === 'zendeskForm';
  }

  public navigate(deeplink: string): void {
    if (this.isInstructionsDeeplink(deeplink)) {
      this.navigateToRoute(deeplink);
      return;
    }
    if (this.isItemDeeplink(deeplink)) {
      this.navigateToUrl(deeplink);
      return;
    }
    if (this.isPrintableLabelDeeplink(deeplink)) {
      this.navigateToUrl(deeplink);
      return;
    }
    if (this.isUserProfileDeeplink(deeplink)) {
      this.navigateToRoute(deeplink);
      return;
    }
    if (this.isZendeskArticleDeeplink(deeplink)) {
      this.navigateToUrl(deeplink);
      return;
    }
    if (this.isZendeskCreateDisputeFormDeeplink(deeplink)) {
      this.navigateToUrl(deeplink);
      return;
    }
  }

  public toWebLink(deeplink: string): string {
    if (!deeplink) {
      return null;
    }

    const deeplinkMappers: Record<deeplinkType, string> = {
      barcodeLabel: this.getBarcodeLabelWebLink(deeplink),
      instructions: this.getInstructionsWebLink(deeplink),
      item: this.getItemWebLink(deeplink),
      printableLabel: this.getPrintableLabelWebLink(deeplink),
      userProfile: this.getUserProfileWebLink(deeplink),
      zendeskArticle: this.getZendeskArticleWebLink(deeplink),
      zendeskForm: this.getZendeskCreateDisputeFormWebLink(deeplink),
      unknown: null,
    };
    return deeplinkMappers[this.getDeeplinkType(deeplink)];
  }

  private getBarcodeLabelWebLink(deeplink: string): string {
    return deeplink.split(barcodeLabelDeeplink).pop();
  }

  private getDeeplinkType(deeplink: string): deeplinkType {
    if (deeplink.startsWith(barcodeLabelDeeplink)) {
      return 'barcodeLabel';
    }
    if (deeplink.startsWith(checkDeliveryInstructionsDeeplink)) {
      return 'instructions';
    }
    if (deeplink.startsWith(itemDeeplink)) {
      return 'item';
    }
    if (deeplink.startsWith(userProfileDeeplink)) {
      return 'userProfile';
    }
    if (deeplink.startsWith(printableLabelDeeplink)) {
      return 'printableLabel';
    }
    if (deeplink.startsWith(zendeskArticleDeeplink)) {
      return 'zendeskArticle';
    }
    if (deeplink.startsWith(createDisputeZendeskFormDeeplink)) {
      return 'zendeskForm';
    }
    return 'unknown';
  }

  private getInstructionsWebLink(deeplink: string): string {
    const regExp: RegExp = new RegExp(/\w+=\w+/g);
    const params = deeplink.match(regExp);
    const request_id = !!params && !!params[0] ? params[0].split('=').pop() : null;
    const type = !!params && !!params[1] ? params[1].split('=').pop() : null;
    return !!request_id && !!type
      ? `${PRIVATE_PATHS.DELIVERY}/${DELIVERY_PATHS.TRACKING}/${TRANSACTION_TRACKING_PATHS.INSTRUCTIONS}/${request_id}/${type}`
      : null;
  }

  private getItemWebLink(deeplink: string): string {
    const id = deeplink.split(itemDeeplink).pop();
    return !!id ? this.itemDetailRoutePipe.transform(id) : null;
  }

  private getPrintableLabelWebLink(deeplink: string): string {
    return deeplink.split(printableLabelDeeplink).pop();
  }

  private getUserProfileWebLink(deeplink: string): string {
    const userId = deeplink.split(userProfileDeeplink).pop();
    const webSlug = null;

    // TODO -> 2021-11-30
    //         In order to avoid calling backend for the webSlug,
    //         we have to ask Camilla to include the webSlug in the response

    return !!userId && !!webSlug ? this.userProfileRoutePipe.transform(webSlug, userId) : null;
  }

  private getZendeskArticleWebLink(deeplink: string): string {
    const HELP_LOCALE = HELP_LOCALE_BY_APP_LOCALE[this.locale];
    const articleId = deeplink.split('z=').pop();
    return !!articleId ? getCustomerHelpUrl(articleId as unknown as UNIFIED_EXTERNAL_CUSTOMER_HELP_PAGE_ID, HELP_LOCALE) : null;
  }

  private getZendeskCreateDisputeFormWebLink(deeplink: string): string {
    const HELP_LOCALE = HELP_LOCALE_BY_APP_LOCALE[this.locale];
    const formId = deeplink.split('f=').pop();
    return !!formId ? getTicketFormUrl(formId as unknown as EXTERNAL_CUSTOMER_TICKET_FORM_PAGE_ID, HELP_LOCALE) : null;
  }

  private navigateToRoute(deeplink: string): void {
    this.router.navigate([this.toWebLink(deeplink)]);
  }

  private navigateToUrl(deeplink: string): void {
    this.window.open(this.toWebLink(deeplink), '_blank');
  }
}
