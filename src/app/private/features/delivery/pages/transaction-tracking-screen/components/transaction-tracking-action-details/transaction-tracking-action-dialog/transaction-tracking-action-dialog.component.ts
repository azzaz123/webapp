import { Component, Input, OnInit } from '@angular/core';
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
  @Input() dialogAction: any;
  @Input() hasBorderBottom: boolean;

  constructor(private modalService: NgbModal) {}

  ngOnInit(): void {}

  public openModal(): void {
    // TODO: tendremos que cambiar el modal a uno que incorpore acciones		Date: 2021/11/25
    const modalRef: NgbModalRef = this.modalService.open(ConfirmationModalComponent);
    const payloadAction: TransactionTrackingActionDetailPayload = this.dialogAction.payload;

    modalRef.componentInstance.properties = this.getModalProperties(payloadAction);

    modalRef.result.then(
      () => {},
      () => {}
    );
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
