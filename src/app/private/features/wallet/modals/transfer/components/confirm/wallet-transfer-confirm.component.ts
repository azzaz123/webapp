import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';

import { Toast, TOAST_TYPES } from '@layout/toast/core/interfaces/toast.interface';
import { WalletTransferAmountModel } from '@private/features/wallet/modals/transfer/models/wallet-transfer-amount.model';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '@layout/toast/core/services/toast.service';

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
  public transferAmount: WalletTransferAmountModel;

  @Output()
  public canceled: EventEmitter<WalletTransferAmountModel> = new EventEmitter<WalletTransferAmountModel>();

  public isTransferInProgress: boolean;

  constructor(private changeDetectorRef: ChangeDetectorRef, private ngbActiveModal: NgbActiveModal, private toastService: ToastService) {}

  public get amountAsText(): string {
    return `${this.transferAmount?.toString()} €`;
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
