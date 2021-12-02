import { Component, Input, OnInit } from '@angular/core';
import { TransactionTrackingActionDialog } from '@api/core/model/delivery/transaction/tracking';
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
  @Input() dialogAction: TransactionTrackingActionDialog;
  @Input() hasBorderBottom: boolean;

  constructor(private modalService: NgbModal) {}

  ngOnInit(): void {}

  public openModal(): void {
    const modalRef: NgbModalRef = this.modalService.open(ConfirmationModalComponent);

    modalRef.componentInstance.properties = this.modalProperties;

    modalRef.result.then(
      () => {},
      () => {}
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
}
