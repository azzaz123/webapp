import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import {
  TransactionTrackingActionCarrierTrackingWebview,
  TransactionTrackingActionDeeplink,
  TransactionTrackingActionDetail,
  TransactionTrackingActionDialog,
  TransactionTrackingActionUserAction,
} from '@api/core/model/delivery/transaction/tracking';
import {
  ActionNameAnalytics,
  TransactionTrackingScreenTrackingEventsService,
} from '../../../services/transaction-tracking-screen-tracking-events/transaction-tracking-screen-tracking-events.service';

@Component({
  selector: 'tsl-transaction-tracking-action-selector',
  templateUrl: './transaction-tracking-action-selector.component.html',
  styleUrls: ['./transaction-tracking-action-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionTrackingActionSelectorComponent {
  @Input() actionDetail: TransactionTrackingActionDetail;

  constructor(private transactionTrackingScreenTrackingEventsService: TransactionTrackingScreenTrackingEventsService) {}

  public trackEvent(): void {
    const analyticsEvent = this.actionDetail.analytics;
    if (analyticsEvent) {
      this.transactionTrackingScreenTrackingEventsService.trackClickActionTTS(
        analyticsEvent.requestId,
        analyticsEvent.source as ActionNameAnalytics
      );
    }
  }

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
