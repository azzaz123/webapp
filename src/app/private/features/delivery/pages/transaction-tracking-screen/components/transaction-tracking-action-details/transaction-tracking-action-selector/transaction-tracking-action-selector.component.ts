import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import {
  TransactionTrackingActionCarrierTrackingWebview,
  TransactionTrackingActionDeeplink,
  TransactionTrackingActionDetail,
  TransactionTrackingActionDialog,
  TransactionTrackingActionUserAction,
} from '@api/core/model/delivery/transaction/tracking';

@Component({
  selector: 'tsl-transaction-tracking-action-selector',
  templateUrl: './transaction-tracking-action-selector.component.html',
  styleUrls: ['./transaction-tracking-action-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionTrackingActionSelectorComponent {
  @Input() actionDetail: TransactionTrackingActionDetail;

  constructor() {}

  public get isCarrierTrackingWebview(): boolean {
    return (this.actionDetail as TransactionTrackingActionCarrierTrackingWebview).isCarrierTrackingWebview;
  }

  public get isDeeplink(): boolean {
    return (this.actionDetail as TransactionTrackingActionDeeplink).isDeeplink;
  }

  public get isDialog(): boolean {
    return (this.actionDetail as TransactionTrackingActionDialog).isDialog;
  }

  public get isUserAction(): boolean {
    return (this.actionDetail as TransactionTrackingActionUserAction).isUserAction;
  }
}
