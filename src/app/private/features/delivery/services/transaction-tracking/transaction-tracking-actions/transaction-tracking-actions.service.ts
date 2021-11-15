import { Injectable } from '@angular/core';
import { TransactionTrackingActionDetail } from '@api/core/model/delivery/transaction/tracking';

@Injectable()
export class TransactionTrackingActionsService {
  constructor() {}

  public manageAction(action: TransactionTrackingActionDetail): void {
    if (action.isDeeplink) {
      this.navigateToAnExternalPage(action.payload.linkUrl);
    }
  }

  private navigateToAnExternalPage(URL: string): void {
    window.open(URL, '_blank');
  }
}
