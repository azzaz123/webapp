import { Component, Input, OnInit } from '@angular/core';
import { UNAVAILABLE_DEEPLINKS_PREFIX } from '../../../constants/unavailable-deeplinks-prefix-constants';

@Component({
  selector: 'tsl-transaction-tracking-action-deeplink',
  templateUrl: './transaction-tracking-action-deeplink.component.html',
  styleUrls: ['./transaction-tracking-action-deeplink.component.scss'],
})
export class TransactionTrackingActionDeeplinkComponent implements OnInit {
  @Input() deeplinkAction: any;
  public isDeeplinkAvailable: boolean;

  constructor() {}

  ngOnInit(): void {
    this.initializeIsDeeplinkAvailable();
  }

  public stopRedirectWhenNotAvailable(event: Event): void {
    if (this.isDeeplinkAvailable) {
      event.preventDefault();
      alert('This deeplink is not available');
    }
  }

  private initializeIsDeeplinkAvailable(): void {
    const deeplink = this.deeplinkAction.payload.linkUrl;
    this.isDeeplinkAvailable = UNAVAILABLE_DEEPLINKS_PREFIX.some((unavailableDeeplink: string) => deeplink.startsWith(unavailableDeeplink));
  }
}
