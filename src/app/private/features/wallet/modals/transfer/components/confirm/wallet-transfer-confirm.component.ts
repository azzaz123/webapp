import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';

import { Money } from '@api/core/model/money.interface';
import { Toast, TOAST_TYPES } from '@layout/toast/core/interfaces/toast.interface';
import { ToastService } from '@layout/toast/core/services/toast.service';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

const transferSentMessage: Toast = {
  type: TOAST_TYPES.SUCCESS,
  text: $localize`:@@make_transfer_view_snackbar_money_sent_description:Money sent! Will be reflected in your account within the indicated period.`,
};

@Component({
  selector: 'tsl-wallet-transfer-confirm',
  templateUrl: './wallet-transfer-confirm.component.html',
  styleUrls: ['./wallet-transfer-confirm.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalletTransferConfirmComponent {
  @Input()
  public transferAmount: Money;

  @Output()
  public canceled: EventEmitter<Money> = new EventEmitter<Money>();

  public isTransferInProgress: boolean;

  constructor(private changeDetectorRef: ChangeDetectorRef, private ngbActiveModal: NgbActiveModal, private toastService: ToastService) {}

  public get amountAsText(): string {
    return this.transferAmount?.toString();
  }

  public cancelTransfer(): void {
    this.canceled.emit(this.transferAmount);
  }

  public confirmTransfer(): void {
    this.isTransferInProgress = true;

    // TODO - finish it!

    /* this.isTransferInProgress = false;
    this.changeDetectorRef.detectChanges(); */
    this.toastService.show(transferSentMessage);
    this.ngbActiveModal.close();
  }
}
