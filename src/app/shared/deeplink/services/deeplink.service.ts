import { Inject, Injectable, LOCALE_ID } from '@angular/core';
import { Router } from '@angular/router';

import { APP_LOCALE } from '@configs/subdomains.config';
import {
  barcodeLabelDeeplinkPrefix,
  checkDeliveryInstructionsDeeplinkPrefix,
  createDisputeZendeskFormDeeplinkPrefix,
  itemDeeplinkPrefix,
  payDeeplinkPrefix,
  printableLabelDeeplinkPrefix,
  userProfileDeeplinkPrefix,
  zendeskArticleDeeplinkPrefix,
} from '@shared/deeplink/constants/deeplink-prefixes';
import { DELIVERY_PATHS } from '@private/features/delivery/delivery-routing-constants';
import { EXTERNAL_CUSTOMER_TICKET_FORM_PAGE_ID } from '@core/external-links/customer-help/enums/external-customer-ticket-form-page-id.enum';
import { getCustomerHelpUrl, UNIFIED_EXTERNAL_CUSTOMER_HELP_PAGE_ID } from '@core/external-links/customer-help/get-customer-help-url';
import { getTicketFormUrl } from '@core/external-links/customer-help/get-ticket-form-url';
import { HELP_LOCALE_BY_APP_LOCALE } from '@core/external-links/customer-help/constants/customer-help-locale';
import { Item } from '@core/item/item';
import { ItemService } from '@core/item/item.service';
import { PATH_TO_PAYVIEW, PRIVATE_PATHS } from '@private/private-routing-constants';
import { TOAST_TYPES } from '@layout/toast/core/interfaces/toast.interface';
import { ToastService } from '@layout/toast/core/services/toast.service';
import { TRANSACTION_TRACKING_PATHS } from '@private/features/delivery/pages/transaction-tracking-screen/transaction-tracking-screen-routing-constants';
import { User } from '@core/user/user';
import { ItemDetailRoutePipe, UserProfileRoutePipe } from '@shared/pipes';
import { UserService } from '@core/user/user.service';

import { Observable, of } from 'rxjs';
import { WINDOW_TOKEN } from '@core/window/window.token';
import { DeeplinkType } from '../types/deeplink.type';
import { deeplinkAvailabilities } from '../constants/deeplink-availability';
import { deeplinkExternalNavigation } from '../constants/deeplink-external-navigation';
import { catchError, map, take, tap } from 'rxjs/operators';
import { DeliveryExperimentalFeaturesService } from '@private/core/services/delivery-experimental-features/delivery-experimental-features.service';

@Injectable()
export class DeeplinkService {
  constructor(
    @Inject(LOCALE_ID) private locale: APP_LOCALE,
    @Inject(WINDOW_TOKEN) private window: Window,
    private router: Router,
    private toastService: ToastService,
    private itemService: ItemService,
    private itemDetailRoutePipe: ItemDetailRoutePipe,
    private userService: UserService,
    private userProfileRoutePipe: UserProfileRoutePipe,
    private deliveryExperimentalFeaturesService: DeliveryExperimentalFeaturesService
  ) {}

  public navigate(deeplink: string): void {
    if (!this.isAvailable(deeplink)) {
      this.showNotAvailableFeatureToast();
      return;
    }
    this.isExternalNavigation(deeplink) ? this.navigateToUrl(deeplink) : this.navigateToRoute(deeplink);
  }

  //FIXME: This should be private
  public toWebLink(deeplink: string): Observable<string> {
    if (!deeplink) {
      return of(null);
    }

    const deeplinkType: DeeplinkType = this.getDeeplinkType(deeplink);

    if (deeplinkType === 'userProfile') {
      return this.getUserProfileWebLink(deeplink);
    }
    if (deeplinkType === 'item') {
      return this.getItemWebLink(deeplink);
    }
    if (deeplinkType === 'pay') {
      return this.getPayviewWebLink(deeplink).pipe(tap((link) => link === '' && this.showNotAvailableFeatureToast()));
    }

    return of(this.deeplinkMappers(deeplinkType, deeplink));
  }

  private isAvailable(deeplink: string): boolean {
    return deeplinkAvailabilities[this.getDeeplinkType(deeplink)];
  }

  private isExternalNavigation(deeplink: string): boolean {
    return deeplinkExternalNavigation[this.getDeeplinkType(deeplink)];
  }

  private deeplinkMappers(deeplinkType: DeeplinkType, deeplink: string): string {
    if (deeplinkType === 'barcodeLabel') {
      return this.getBarcodeWebLink(deeplink);
    }
    if (deeplinkType === 'instructions') {
      return this.getInstructionsWebLink(deeplink);
    }
    if (deeplinkType === 'printableLabel') {
      return this.getPrintableLabelWebLink(deeplink);
    }
    if (deeplinkType === 'zendeskArticle') {
      return this.getZendeskArticleWebLink(deeplink);
    }
    if (deeplinkType === 'zendeskForm') {
      return this.getZendeskCreateDisputeFormWebLink(deeplink);
    }
    if (deeplinkType === 'unknown') {
      return null;
    }

    return null;
  }

  private getDeeplinkType(deeplink: string): DeeplinkType {
    if (deeplink.startsWith(barcodeLabelDeeplinkPrefix)) {
      return 'barcodeLabel';
    }
    if (deeplink.startsWith(payDeeplinkPrefix)) {
      return 'pay';
    }
    if (deeplink.startsWith(checkDeliveryInstructionsDeeplinkPrefix)) {
      return 'instructions';
    }
    if (deeplink.startsWith(itemDeeplinkPrefix)) {
      return 'item';
    }
    if (deeplink.startsWith(userProfileDeeplinkPrefix)) {
      return 'userProfile';
    }
    if (deeplink.startsWith(printableLabelDeeplinkPrefix)) {
      return 'printableLabel';
    }
    if (deeplink.startsWith(zendeskArticleDeeplinkPrefix)) {
      return 'zendeskArticle';
    }
    if (deeplink.startsWith(createDisputeZendeskFormDeeplinkPrefix)) {
      return 'zendeskForm';
    }
    return 'unknown';
  }

  private getBarcodeWebLink(deeplink: string): string {
    const params = this.getParams(deeplink);
    const barcode = !!params && !!params[0] ? params[0].split('=').pop() : null;
    return !!barcode ? `${PRIVATE_PATHS.DELIVERY}/${DELIVERY_PATHS.TRACKING}/${TRANSACTION_TRACKING_PATHS.BARCODE}/${barcode}` : null;
  }

  private getInstructionsWebLink(deeplink: string): string {
    const params = this.getParams(deeplink);
    const request_id = !!params && !!params[0] ? params[0].split('=').pop() : null;
    const type = !!params && !!params[1] ? params[1].split('=').pop() : null;
    return !!request_id && !!type
      ? `${PRIVATE_PATHS.DELIVERY}/${DELIVERY_PATHS.TRACKING}/${request_id}/${TRANSACTION_TRACKING_PATHS.INSTRUCTIONS}/${type}`
      : null;
  }

  private getItemWebLink(deeplink: string): Observable<string> {
    const itemId = deeplink.split(itemDeeplinkPrefix).pop();

    if (!itemId) {
      return of(null);
    }

    return this.itemService.get(itemId).pipe(
      map((item: Item) => (!!item.webSlug ? this.itemDetailRoutePipe.transform(item.webSlug) : null)),
      catchError(() => of(null))
    );
  }

  //TODO: When removing the feature flag from the payview, we can generate the payview link without an observable
  private getPayviewWebLink(deeplink: string): Observable<string> {
    const params: string[] = this.getParams(deeplink);
    const itemHash: string = params[0].split('=')[1];
    return this.deliveryExperimentalFeaturesService.featuresEnabled$.pipe(
      map((enabled) => (enabled ? `${PATH_TO_PAYVIEW}/${itemHash}` : '')),
      take(1)
    );
  }

  private getParams(deeplink: string): string[] {
    const regExp: RegExp = new RegExp(/\w+=[\w\-]+/g);
    return deeplink.match(regExp);
  }

  private getPrintableLabelWebLink(deeplink: string): string {
    return deeplink.split(printableLabelDeeplinkPrefix).pop();
  }

  private getUserProfileWebLink(deeplink: string): Observable<string> {
    const userId = deeplink.split(userProfileDeeplinkPrefix).pop();

    if (!userId) {
      return of(null);
    }

    return this.userService.get(userId, false).pipe(
      map((user: User) => (!!user.webSlug ? this.userProfileRoutePipe.transform(user.webSlug, userId) : null)),
      catchError(() => of(null))
    );
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
    this.toWebLink(deeplink).subscribe((webLink: string) => {
      webLink !== '' && this.router.navigate([webLink]);
    });
  }

  private navigateToUrl(deeplink: string): void {
    const windowReference: Window = this.window.open();
    this.toWebLink(deeplink).subscribe((webLink: string) => {
      windowReference.location.href = webLink;
    });
  }

  private showNotAvailableFeatureToast(): void {
    this.toastService.show({
      title: $localize`:@@shipments_all_users_snackbar_tts_unavailable_feature_title_web_specific:Feature not available`,
      text: $localize`:@@shipments_all_users_snackbar_tts_unavailable_feature_description_web_specific:We are working on it... We appreciate your patience!`,
      type: TOAST_TYPES.ERROR,
    });
  }
}
