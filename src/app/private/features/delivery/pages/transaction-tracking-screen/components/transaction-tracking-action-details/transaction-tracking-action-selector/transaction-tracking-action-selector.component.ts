import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import {
  TransactionTrackingActionCarrierTrackingWebview,
  TransactionTrackingActionDeeplink,
  TransactionTrackingActionDetail,
  TransactionTrackingActionDialog,
  TransactionTrackingActionUnknown,
  TransactionTrackingActionUserAction,
} from '@api/core/model/delivery/transaction/tracking';
import { TransactionTrackingScreenTrackingEventsService } from '@private/features/delivery/pages/transaction-tracking-screen/services/transaction-tracking-screen-tracking-events/transaction-tracking-screen-tracking-events.service';
import { ActionNameAnalytics } from '@private/features/delivery/pages/transaction-tracking-screen/services/transaction-tracking-screen-tracking-events/action-name-analytics-type';

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

  public get isUnknownAction(): boolean {
    return (this.actionDetail as TransactionTrackingActionUnknown).isUnknown;
  }
}
