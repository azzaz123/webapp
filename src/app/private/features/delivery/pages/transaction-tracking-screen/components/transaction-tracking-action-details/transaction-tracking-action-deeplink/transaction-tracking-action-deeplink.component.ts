import { Component, Input, OnInit } from '@angular/core';
import { UNAVAILABLE_DEEPLINKS_PREFIX } from '../../../constants/unavailable-deeplinks-prefix-constants';

@Component({
  selector: 'tsl-transaction-tracking-action-deeplink',
  templateUrl: './transaction-tracking-action-deeplink.component.html',
  styleUrls: ['./transaction-tracking-action-deeplink.component.scss'],
})
export class TransactionTrackingActionDeeplinkComponent implements OnInit {
  @Input() deeplinkAction: any;
  public isDeeplinkUnavailable: boolean;

  constructor() {}

  ngOnInit(): void {
    this.initializeIsDeeplinkAvailable();
  }

  public stopRedirectWhenNotAvailable(event: Event): void {
    if (this.isDeeplinkUnavailable) {
      event.preventDefault();
      alert('This deeplink is not available');
    }
  }

  private initializeIsDeeplinkAvailable(): void {
    const deeplink = this.deeplinkAction.payload.linkUrl;
    this.isDeeplinkUnavailable = UNAVAILABLE_DEEPLINKS_PREFIX.some((unavailableDeeplink: string) =>
      deeplink.startsWith(unavailableDeeplink)
    );
  }
}
