import { Component, Input, OnInit } from '@angular/core';
import { TransactionTrackingService } from '@api/bff/delivery/transaction-tracking/transaction-tracking.service';
import { TransactionTrackingActionDetailPayload } from '@api/core/model/delivery/transaction/tracking';
import { COLORS } from '@core/colors/colors-constants';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationModalComponent } from '@shared/confirmation-modal/confirmation-modal.component';
import { ConfirmationModalProperties } from '@shared/confirmation-modal/confirmation-modal.interface';

@Component({
  selector: 'tsl-transaction-tracking-action-dialog',
  templateUrl: './transaction-tracking-action-dialog.component.html',
  styleUrls: ['./transaction-tracking-action-dialog.component.scss'],
})
export class TransactionTrackingActionDialogComponent implements OnInit {
  @Input() modalAction: any;
  @Input() hasBorderBottom: boolean;

  constructor(private modalService: NgbModal, private transactionTrackingService: TransactionTrackingService) {}

  ngOnInit(): void {}

  public openModal(): void {
    const modalRef: NgbModalRef = this.modalService.open(ConfirmationModalComponent);
    const payloadAction: TransactionTrackingActionDetailPayload = this.modalAction.payload;

    modalRef.componentInstance.properties = this.getModalProperties(payloadAction);

    modalRef.result.then(
      () => {
        if (payloadAction.positive.action?.isUserAction) {
          this.requestUserAction(payloadAction.positive.action.payload);
        }
      },
      () => {}
    );
  }

  private requestUserAction(payload: TransactionTrackingActionDetailPayload): void {
    // this.transactionTrackingService.sendUserAction(payload.parameters.transactionId, payload.name).subscribe(
    //   () => {},
    //   () => {}
    // );
  }

  private getModalProperties(payload: TransactionTrackingActionDetailPayload): ConfirmationModalProperties {
    return {
      title: payload.title,
      description: payload.description,
      confirmMessage: payload.positive.title,
      cancelMessage: payload.negative?.title,
      confirmColor: COLORS.WALLA_MAIN,
    };
  }
}
