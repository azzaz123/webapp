import { Component, Input, OnInit } from '@angular/core';
import { TransactionTrackingActionDialog } from '@api/core/model/delivery/transaction/tracking';
import { COLORS } from '@core/colors/colors-constants';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationActionModalComponent } from '../../../modals/confirmation-action-modal/confirmation-action-modal.component';
import { ConfirmationActionModalProperties } from '../../../modals/confirmation-action-modal/confirmation-action-modal.interface';

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
    const modalRef: NgbModalRef = this.modalService.open(ConfirmationActionModalComponent);

    modalRef.componentInstance.properties = this.modalProperties;

    modalRef.result.then(
      () => {},
      () => {}
    );
  }

  private get modalProperties(): ConfirmationActionModalProperties {
    return {
      title: this.dialogAction.title,
      description: this.dialogAction.description,
      confirmMessage: this.dialogAction.positive.title,
      cancelMessage: this.dialogAction.negative?.title,
      confirmColor: COLORS.WALLA_MAIN,
      positiveAction: this.dialogAction.positive.action,
    };
  }
}
