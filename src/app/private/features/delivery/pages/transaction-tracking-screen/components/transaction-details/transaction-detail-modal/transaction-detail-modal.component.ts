import { Component, Input, OnInit } from '@angular/core';
import { TransactionTrackingService } from '@api/bff/delivery/transaction-tracking/transaction-tracking.service';
import {
  TransactionTrackingActionDetailPayload,
  TransactionTrackingActionDetailPayloadConfirmation,
} from '@api/core/model/delivery/transaction/tracking';
import { COLORS } from '@core/colors/colors-constants';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationModalComponent } from '@shared/confirmation-modal/confirmation-modal.component';
import { ConfirmationModalProperties } from '@shared/confirmation-modal/confirmation-modal.interface';
import { TransactionDetail } from '../../../interfaces/transaction-detail.interface';

@Component({
  selector: 'tsl-transaction-detail-modal',
  templateUrl: './transaction-detail-modal.component.html',
  styleUrls: ['./transaction-detail-modal.component.scss'],
})
export class TransactionDetailModalComponent implements OnInit {
  @Input() transactionDetail: TransactionDetail;
  @Input() hasBorderBottom: boolean;

  constructor(private modalService: NgbModal, private transactionTrackingService: TransactionTrackingService) {}

  ngOnInit(): void {}

  public openModal(): void {
    const modalRef: NgbModalRef = this.modalService.open(ConfirmationModalComponent);
    const payloadAction: TransactionTrackingActionDetailPayload = this.transactionDetail.action.payload;

    modalRef.componentInstance.properties = this.getModalProperties(payloadAction);

    modalRef.result.then(
      () => {
        if (this.transactionDetail.action.isUserAction && payloadAction.positive.action) {
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
