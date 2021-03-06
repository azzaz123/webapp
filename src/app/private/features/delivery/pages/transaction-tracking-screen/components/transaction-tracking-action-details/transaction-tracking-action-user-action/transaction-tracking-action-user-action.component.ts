import { Component, Input, OnInit } from '@angular/core';
import { TransactionTrackingService } from '@api/bff/delivery/transaction-tracking/transaction-tracking.service';
import { TransactionTrackingActionUserAction } from '@api/core/model/delivery/transaction/tracking';
import { ErrorsService } from '@core/errors/errors.service';
import { TRANSLATION_KEY } from '@core/i18n/translations/enum/translation-keys.enum';
import { TransactionTrackingScreenTrackingEventsService } from '@private/features/delivery/pages/transaction-tracking-screen/services/transaction-tracking-screen-tracking-events/transaction-tracking-screen-tracking-events.service';
import { ActionNameAnalytics } from '@private/features/delivery/pages/transaction-tracking-screen/services/transaction-tracking-screen-tracking-events/action-name-analytics-type';
import { ActivatedRoute, Router } from '@angular/router';
import { DELIVERY_PATHS, DELIVERY_PATH_PARAMS } from '@private/features/delivery/delivery-routing-constants';
import { TRANSACTION_TRACKING_PATHS } from '@private/features/delivery/pages/transaction-tracking-screen/transaction-tracking-screen-routing-constants';
import { PRIVATE_PATHS } from '@private/private-routing-constants';

@Component({
  selector: 'tsl-transaction-tracking-action-user-action',
  templateUrl: './transaction-tracking-action-user-action.component.html',
  styleUrls: ['../styles/transaction-tracking-action.scss'],
})
export class TransactionTrackingActionUserActionComponent implements OnInit {
  @Input() userAction: TransactionTrackingActionUserAction;
  private requestId: string;

  constructor(
    private transactionTrackingService: TransactionTrackingService,
    private errorsService: ErrorsService,
    private transactionTrackingScreenTrackingEventsService: TransactionTrackingScreenTrackingEventsService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.requestId = this.route.snapshot.paramMap.get(DELIVERY_PATH_PARAMS.ID);
  }

  public requestUserAction(): void {
    this.trackEvent();
    this.transactionTrackingService.sendUserAction(this.userAction.transactionId, this.userAction.name).subscribe(
      () => {
        this.redirectToTTSIfInstructions();
      },
      () => {
        // TODO: Error management states should be improved by cases		Date: 2021/12/02
        this.errorsService.i18nError(TRANSLATION_KEY.DEFAULT_ERROR_MESSAGE);
      }
    );
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

  private redirectToTTSIfInstructions(): void {
    const isInstructionsPage = this.router.url.includes(TRANSACTION_TRACKING_PATHS.INSTRUCTIONS);
    if (isInstructionsPage) {
      const pathToTransactionTracking = `${PRIVATE_PATHS.DELIVERY}/${DELIVERY_PATHS.TRACKING}/${this.requestId}`;
      this.router.navigate([pathToTransactionTracking]);
    }
  }
}
