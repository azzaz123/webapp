import { Component, Input, OnInit } from '@angular/core';
import { UNAVAILABLE_DEEPLINKS_PREFIX } from '../../../constants/unavailable-deeplinks-prefix-constants';
import { TransactionDetail } from '../../../interfaces/transaction-detail.interface';

@Component({
  selector: 'tsl-transaction-detail-redirection',
  templateUrl: './transaction-detail-redirection.component.html',
  styleUrls: ['./transaction-detail-redirection.component.scss'],
})
export class TransactionDetailRedirectionComponent implements OnInit {
  @Input() transactionDetail: TransactionDetail;
  @Input() hasBorderBottom: boolean;
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
    const deeplink = this.transactionDetail.action.payload.linkUrl;
    this.isDeeplinkAvailable = UNAVAILABLE_DEEPLINKS_PREFIX.some((unavailableDeeplink: string) => deeplink.startsWith(unavailableDeeplink));
  }
}
