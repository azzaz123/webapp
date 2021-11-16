import { Inject, Injectable, LOCALE_ID } from '@angular/core';
import {
  TransactionTrackingActionDetail,
  TransactionTrackingActionDetailPayloadModel,
} from '@api/core/model/delivery/transaction/tracking';
import { APP_LOCALE } from '@configs/subdomains.config';

@Injectable()
export class TransactionTrackingActionsService {
  constructor(@Inject(LOCALE_ID) private locale: APP_LOCALE) {}

  public manageAction(action: TransactionTrackingActionDetail): void {
    if (action.isDeeplink) {
      const deeplinkURLMapped = new TransactionTrackingActionDetailPayloadModel(action.payload).getHelpArticleUrl(this.locale);
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
