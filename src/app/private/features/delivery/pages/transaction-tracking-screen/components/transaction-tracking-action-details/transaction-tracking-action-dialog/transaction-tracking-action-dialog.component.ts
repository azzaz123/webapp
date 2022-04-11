import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TransactionTrackingService } from '@api/bff/delivery/transaction-tracking/transaction-tracking.service';
import {
  TransactionTrackingActionDeeplink,
  TransactionTrackingActionDetail,
  TransactionTrackingActionDialog,
  TransactionTrackingActionUserAction,
} from '@api/core/model/delivery/transaction/tracking';
import { COLORS } from '@core/colors/colors-constants';
import { ErrorsService } from '@core/errors/errors.service';
import { TRANSLATION_KEY } from '@core/i18n/translations/enum/translation-keys.enum';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DELIVERY_PATHS, DELIVERY_PATH_PARAMS } from '@private/features/delivery/delivery-routing-constants';
import { PRIVATE_PATHS } from '@private/private-routing-constants';
import { ConfirmationModalComponent } from '@shared/confirmation-modal/confirmation-modal.component';
import { ConfirmationModalProperties } from '@shared/confirmation-modal/confirmation-modal.interface';
import { TRANSACTION_TRACKING_PATHS } from '@private/features/delivery/pages/transaction-tracking-screen/transaction-tracking-screen-routing-constants';
import { ActionNameAnalytics } from '@private/features/delivery/pages/transaction-tracking-screen/services/transaction-tracking-screen-tracking-events/action-name-analytics-type';
import { TransactionTrackingScreenTrackingEventsService } from '@private/features/delivery/pages/transaction-tracking-screen/services/transaction-tracking-screen-tracking-events/transaction-tracking-screen-tracking-events.service';
import { DeeplinkService } from '@api/core/utils/deeplink/deeplink.service';

@Component({
  selector: 'tsl-transaction-tracking-action-dialog',
  templateUrl: './transaction-tracking-action-dialog.component.html',
  styleUrls: ['../styles/transaction-tracking-action.scss'],
})
export class TransactionTrackingActionDialogComponent implements OnInit {
  @Input() dialogAction: TransactionTrackingActionDialog;
  @Input() hasBorderBottom: boolean;
  private requestId: string;

  constructor(
    private modalService: NgbModal,
    private transactionTrackingService: TransactionTrackingService,
    private errorsService: ErrorsService,
    private router: Router,
    private route: ActivatedRoute,
    private transactionTrackingScreenTrackingEventsService: TransactionTrackingScreenTrackingEventsService,
    private deeplinkService: DeeplinkService
  ) {}

  ngOnInit() {
    this.requestId = this.route.snapshot.paramMap.get(DELIVERY_PATH_PARAMS.ID);
  }

  public openModal(): void {
    const modalRef: NgbModalRef = this.modalService.open(ConfirmationModalComponent);

    modalRef.componentInstance.properties = this.modalProperties;

    modalRef.result.then(
      () => {
        if (this.dialogAction.positive) {
          return this.handlePositiveDialogAction();
        }
      },
      () => {}
    );
  }

  private handlePositiveDialogAction(): void {
    const { action } = this.dialogAction.positive;

    if (this.isDeeplink(action)) {
      return this.deeplinkService.navigate(action.linkUrl);
    }

    if (this.isAction(action)) {
      this.transactionTrackingService.sendUserAction(action.transactionId, action.name).subscribe(
        () => {
          this.trackEvent(action);
          this.redirectToTTSIfInstructions();
        },
        () => {
          // TODO: Error management states should be improved by cases		Date: 2021/12/02
          this.errorsService.i18nError(TRANSLATION_KEY.DEFAULT_ERROR_MESSAGE);
        }
      );
      return;
    }
  }

  private trackEvent(userAction: TransactionTrackingActionUserAction): void {
    const analyticsEvent = userAction.analytics;
    if (analyticsEvent) {
      this.transactionTrackingScreenTrackingEventsService.trackClickActionTTS(
        analyticsEvent.requestId,
        analyticsEvent.source as ActionNameAnalytics
      );
    }
  }

  private get modalProperties(): ConfirmationModalProperties {
    return {
      title: this.dialogAction.title,
      description: this.dialogAction.description,
      confirmMessage: this.dialogAction.positive.title,
      cancelMessage: this.dialogAction.negative?.title,
      confirmColor: COLORS.WALLA_MAIN,
    };
  }

  private redirectToTTSIfInstructions(): void {
    const isInstructionsPage = this.router.url.includes(TRANSACTION_TRACKING_PATHS.INSTRUCTIONS);
    if (isInstructionsPage) {
      const pathToTransactionTracking = `${PRIVATE_PATHS.DELIVERY}/${DELIVERY_PATHS.TRACKING}/${this.requestId}`;
      this.router.navigate([pathToTransactionTracking]);
    }
  }

  private isDeeplink(action: TransactionTrackingActionDetail): action is TransactionTrackingActionDeeplink {
    return !!(action as TransactionTrackingActionDeeplink).isDeeplink;
  }

  private isAction(action: TransactionTrackingActionDetail): action is TransactionTrackingActionUserAction {
    return !!(action as TransactionTrackingActionUserAction).name;
  }
}
