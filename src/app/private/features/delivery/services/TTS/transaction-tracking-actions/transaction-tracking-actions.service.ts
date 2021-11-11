import { Injectable } from '@angular/core';

@Injectable()
export class TransactionTrackingActionsService {
  constructor() {}

  public manageAction(action: any): void {
    if (action.isDeeplink) {
      this.navigateToAnExternalPage(action.payload.linkUrl);
    }
  }

  private navigateToAnExternalPage(URL: string): void {
    window.open(URL, '_blank');
  }
}
