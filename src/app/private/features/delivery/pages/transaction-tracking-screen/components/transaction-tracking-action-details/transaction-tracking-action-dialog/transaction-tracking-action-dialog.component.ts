import { Component, Input } from '@angular/core';
import { TransactionTrackingService } from '@api/bff/delivery/transaction-tracking/transaction-tracking.service';
import { TransactionTrackingActionDialog, TransactionTrackingActionUserAction } from '@api/core/model/delivery/transaction/tracking';
import { COLORS } from '@core/colors/colors-constants';
import { ErrorsService } from '@core/errors/errors.service';
import { TRANSLATION_KEY } from '@core/i18n/translations/enum/translation-keys.enum';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationModalComponent } from '@shared/confirmation-modal/confirmation-modal.component';
import { ConfirmationModalProperties } from '@shared/confirmation-modal/confirmation-modal.interface';

@Component({
  selector: 'tsl-transaction-tracking-action-dialog',
  templateUrl: './transaction-tracking-action-dialog.component.html',
  styleUrls: ['./transaction-tracking-action-dialog.component.scss'],
})
export class TransactionTrackingActionDialogComponent {
  @Input() dialogAction: TransactionTrackingActionDialog;
  @Input() hasBorderBottom: boolean;

  constructor(
    private modalService: NgbModal,
    private transactionTrackingService: TransactionTrackingService,
    private errorsService: ErrorsService
  ) {}

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
    this.transactionTrackingService.sendUserAction(userAction.transactionId, userAction.name).subscribe({
      error: () => {
        // TODO: Error management states should be improved by cases		Date: 2021/12/02
        this.errorsService.i18nError(TRANSLATION_KEY.DEFAULT_ERROR_MESSAGE);
      },
    });
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
}
