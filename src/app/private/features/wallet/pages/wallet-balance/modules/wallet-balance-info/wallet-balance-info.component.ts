import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { DEFAULT_ERROR_TOAST } from '@layout/toast/core/constants/default-toasts';
import { KYC_STATUS } from '@api/core/model/kyc-properties/kyc-status.enum';
import { KYCProperties } from '@api/core/model/kyc-properties/interfaces/kyc-properties.interface';
import { KYCPropertiesService } from '@api/payments/kyc-properties/kyc-properties.service';
import { Money } from '@api/core/model/money.interface';
import { PaymentsWalletsService } from '@api/payments/wallets/payments-wallets.service';
import { Toast, TOAST_TYPES } from '@layout/toast/core/interfaces/toast.interface';
import { ToastService } from '@layout/toast/core/services/toast.service';
import { WalletBalanceTrackingEventService } from '@private/features/wallet/pages/wallet-balance/services/balance-tracking-event.service';
import { WalletSharedErrorActionService } from '@private/features/wallet/shared/error-action';
import { WalletTransferDismissError } from '@private/features/wallet/errors/classes/transfer/wallet-transfer-dismiss-error';
import { WalletTransferError } from '@private/features/wallet/errors/classes/transfer/wallet-transfer-error';
import { WalletTransferMainComponent } from '@private/features/wallet/modals/transfer/components/main/wallet-transfer-main.component';
import { WalletTransferPayUserBankAccountError } from '@private/features/wallet/errors/classes/transfer/wallet-transfer-pay-user-bank-account-error';
import { WalletTransferService } from '@private/features/wallet/services/transfer/wallet-transfer.service';

import { combineLatest } from 'rxjs';
import { finalize, take } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

const validatingTransferMessage: Toast = {
  type: TOAST_TYPES.SUCCESS,
  text: $localize`:@@make_transfer_view_snackbar_no_commissions_description:Transfers are free, forget about fees.`,
};

@Component({
  selector: 'tsl-wallet-balance-info',
  templateUrl: './wallet-balance-info.component.html',
  styleUrls: ['./wallet-balance-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalletBalanceInfoComponent implements OnInit {
  public isError = false;
  public isTransferInProgress: boolean;
  public loading = true;
  public walletBalance: Money;
  private KYCProperties: KYCProperties;

  constructor(
    private paymentsWalletsService: PaymentsWalletsService,
    private toastService: ToastService,
    private kycPropertiesService: KYCPropertiesService,
    private errorActionService: WalletSharedErrorActionService,
    private changeDetectorRef: ChangeDetectorRef,
    private modalService: NgbModal,
    private walletTransferService: WalletTransferService,
    private balanceTrackingEventService: WalletBalanceTrackingEventService
  ) {}

  ngOnInit() {
    this.loadBalanceAndSpecifications();
    this.checkPayUserBankAccount();
  }

  public get allowTransfer(): boolean {
    return this.hasPositiveBalance && this.isValidStatus;
  }

  public transferBalance(): void {
    this.modalService.open(WalletTransferMainComponent).result.then(() => {
      this.loadBalanceAndSpecifications();
    });
  }

  private get hasPositiveBalance(): boolean {
    return this.walletBalance?.amount.total > 0;
  }

  private get isValidStatus(): boolean {
    return this.KYCProperties.status === KYC_STATUS.NO_NEED || this.KYCProperties.status === KYC_STATUS.VERIFIED;
  }

  private loadBalanceAndSpecifications(): void {
    this.changeDetectorRef.detectChanges();

    combineLatest([this.paymentsWalletsService.walletBalance$.pipe(take(1)), this.kycPropertiesService.KYCProperties$.pipe(take(1))])
      .pipe(
        finalize(() => {
          this.balanceTrackingEventService.trackViewWallet(this.walletBalance?.amount.total, this.KYCProperties?.status);
        })
      )
      .subscribe({
        next: ([walletBalance, specifications]: [Money, KYCProperties]) => {
          this.walletBalance = walletBalance;
          this.KYCProperties = specifications;

          this.loading = false;
          this.changeDetectorRef.detectChanges();
        },
        error: (error) => {
          this.isError = true;
          this.toastService.show(DEFAULT_ERROR_TOAST);
          this.errorActionService.show(error);

          this.loading = false;
          this.changeDetectorRef.detectChanges();
        },
      });
  }

  private checkPayUserBankAccount(): void {
    this.walletTransferService.checkPayUserBankAccount().subscribe({
      error: (error: WalletTransferError) => {
        if (error instanceof WalletTransferDismissError) {
          return;
        }
        this.showTransferErrorMessage(error);
      },
    });
  }

  private showTransferErrorMessage(error: WalletTransferError): void {
    this.toastService.show({
      type: error instanceof WalletTransferPayUserBankAccountError ? TOAST_TYPES.SUCCESS : TOAST_TYPES.ERROR,
      text: error.message,
    });
    this.isTransferInProgress = true;
    this.changeDetectorRef.detectChanges();
  }
}
