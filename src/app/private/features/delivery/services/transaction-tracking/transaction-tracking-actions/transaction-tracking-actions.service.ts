import { Injectable } from '@angular/core';

@Injectable()
export class TransactionTrackingActionsService {
  constructor() {}

  // TODO: type it when we have the interface merged		Date: 2021/11/12
  public manageAction(action: any): void {
    if (action.isDeeplink) {
      this.navigateToAnExternalPage(action.payload.linkUrl);
    }
  }

  private navigateToAnExternalPage(URL: string): void {
    window.open(URL, '_blank');
  }
}
