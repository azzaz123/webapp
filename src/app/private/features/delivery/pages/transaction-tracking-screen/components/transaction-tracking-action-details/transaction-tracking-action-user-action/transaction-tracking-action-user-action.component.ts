import { Component, Input } from '@angular/core';
import { TransactionTrackingService } from '@api/bff/delivery/transaction-tracking/transaction-tracking.service';
import { TransactionTrackingActionUserAction } from '@api/core/model/delivery/transaction/tracking';
import { ErrorsService } from '@core/errors/errors.service';
import { TRANSLATION_KEY } from '@core/i18n/translations/enum/translation-keys.enum';
import {
  ActionNameAnalytics,
  TransactionTrackingScreenTrackingEventsService,
} from '../../../services/transaction-tracking-screen-tracking-events/transaction-tracking-screen-tracking-events.service';

@Component({
  selector: 'tsl-transaction-tracking-action-user-action',
  templateUrl: './transaction-tracking-action-user-action.component.html',
  styleUrls: ['../styles/transaction-tracking-action.scss'],
})
export class TransactionTrackingActionUserActionComponent {
  @Input() userAction: TransactionTrackingActionUserAction;

  constructor(
    private transactionTrackingService: TransactionTrackingService,
    private errorsService: ErrorsService,
    private transactionTrackingScreenTrackingEventsService: TransactionTrackingScreenTrackingEventsService
  ) {}

  public requestUserAction(): void {
    this.trackEvent();
    this.transactionTrackingService.sendUserAction(this.userAction.transactionId, this.userAction.name).subscribe({
      error: () => {
        // TODO: Error management states should be improved by cases		Date: 2021/12/02
        this.errorsService.i18nError(TRANSLATION_KEY.DEFAULT_ERROR_MESSAGE);
      },
    });
  }

  public trackEvent(): void {
    const analyticsEvent = this.userAction.analytics;
    if (analyticsEvent) {
      this.transactionTrackingScreenTrackingEventsService.trackClickActionTTS(
        analyticsEvent.requestId,
        analyticsEvent.source as ActionNameAnalytics
      );
    }
  }
}
