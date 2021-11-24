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

  constructor() {}

  ngOnInit(): void {}

  public isDeeplinkAvailable(deeplink: string): boolean {
    return UNAVAILABLE_DEEPLINKS_PREFIX.some((unavailableDeeplink: string) => deeplink.startsWith(unavailableDeeplink));
  }
}
