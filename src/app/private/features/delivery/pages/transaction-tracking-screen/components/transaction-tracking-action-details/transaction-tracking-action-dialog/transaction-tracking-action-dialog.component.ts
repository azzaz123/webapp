import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TransactionTrackingService } from '@api/bff/delivery/transaction-tracking/transaction-tracking.service';
import { TransactionTrackingActionDialog, TransactionTrackingActionUserAction } from '@api/core/model/delivery/transaction/tracking';
import { COLORS } from '@core/colors/colors-constants';
import { ErrorsService } from '@core/errors/errors.service';
import { TRANSLATION_KEY } from '@core/i18n/translations/enum/translation-keys.enum';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DELIVERY_PATHS, DELIVERY_PATH_PARAMS } from '@private/features/delivery/delivery-routing-constants';
import { PRIVATE_PATHS } from '@private/private-routing-constants';
import { ConfirmationModalComponent } from '@shared/confirmation-modal/confirmation-modal.component';
import { ConfirmationModalProperties } from '@shared/confirmation-modal/confirmation-modal.interface';
import { TRANSACTION_TRACKING_PATHS } from '../../..';
import { TransactionTrackingScreenStoreService } from '../../../services/transaction-tracking-screen-store/transaction-tracking-screen-store.service';

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
    private storeService: TransactionTrackingScreenStoreService
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
          this.sendUserAction();
        }
      },
      () => {}
    );
  }

  private sendUserAction(): void {
    const userAction = this.dialogAction.positive.action as TransactionTrackingActionUserAction;
    this.transactionTrackingService.sendUserAction(userAction.transactionId, userAction.name).subscribe(
      () => {
        this.storeService.refresh(this.requestId);
        this.redirectToTTSIfInstructions();
      },
      () => {
        // TODO: Error management states should be improved by cases		Date: 2021/12/02
        this.errorsService.i18nError(TRANSLATION_KEY.DEFAULT_ERROR_MESSAGE);
      }
    );
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
}
