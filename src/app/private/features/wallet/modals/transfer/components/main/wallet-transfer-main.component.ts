import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';

import { StepperComponent } from '@shared/stepper/stepper.component';
import { Toast, TOAST_TYPES } from '@layout/toast/core/interfaces/toast.interface';
import { ToastService } from '@layout/toast/core/services/toast.service';
import { WalletTransferMoneyInterface } from '@private/features/wallet/modals/transfer/interfaces/wallet-transfer-money.interface';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

const confirmationId: number = 1;
const noComissionsMessage: Toast = {
  type: TOAST_TYPES.SUCCESS,
  text: $localize`:@@make_transfer_view_snackbar_no_commissions_description:Transfers are free, forget about fees.`,
};

@Component({
  selector: 'tsl-wallet-transfer-main',
  templateUrl: './wallet-transfer-main.component.html',
  styleUrls: ['./wallet-transfer-main.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalletTransferMainComponent implements OnInit {
  @ViewChild(StepperComponent, { static: true }) stepper: StepperComponent;

  public transferAmount: WalletTransferMoneyInterface;

  constructor(private activeModal: NgbActiveModal, private toastService: ToastService) {}

  public ngOnInit(): void {
    this.toastService.show(noComissionsMessage);
  }

  public closeModal(): void {
    this.activeModal.close();
  }

  public get isInConfirmationStep(): boolean {
    return this.stepper.activeId === confirmationId;
  }

  public goNextStep(transferAmount: WalletTransferMoneyInterface): void {
    this.transferAmount = transferAmount;
    this.stepper.goNext();
  }

  public goPreviousStep(transferAmount?: WalletTransferMoneyInterface): void {
    this.transferAmount = transferAmount;
    this.stepper.goBack();
  }
}
