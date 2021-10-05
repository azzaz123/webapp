import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { DEFAULT_ERROR_TOAST } from '@layout/toast/core/constants/default-toasts';
import { KYC_STATUS } from '@api/core/model/kyc-properties/kyc-status.enum';
import { KYCBannerSpecifications } from '@api/core/model/kyc-properties/interfaces/kyc-banner-specifications.interface';
import { KYCProperties } from '@api/core/model/kyc-properties/interfaces/kyc-properties.interface';
import { KYCPropertiesService } from '@api/payments/kyc-properties/kyc-properties.service';
import { Money } from '@api/core/model/money.interface';
import { PaymentsWalletsService } from '@api/payments/wallets/payments-wallets.service';
import { Toast, TOAST_TYPES } from '@layout/toast/core/interfaces/toast.interface';
import { ToastService } from '@layout/toast/core/services/toast.service';
import { WalletSharedErrorActionService } from '@private/features/wallet/shared/error-action';
import { WalletTransferDismissErrorModel } from '@private/features/wallet/errors/classes/transfer/wallet-transfer-dismiss-error.model';
import { WalletTransferErrorModel } from '@private/features/wallet/errors/classes/transfer/wallet-transfer-error.model';
import { WalletTransferMainComponent } from '@private/features/wallet/modals/transfer/components/main/wallet-transfer-main.component';
import { WalletTransferPayUserBankAccountErrorModel } from '@private/features/wallet/errors/classes/transfer/wallet-transfer-pay-user-bank-account-error.model';
import { WalletTransferService } from '@private/features/wallet/services/transfer/wallet-transfer.service';

import { forkJoin } from 'rxjs';
import { finalize, switchMap } from 'rxjs/operators';
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
  private specifications: KYCBannerSpecifications;

  constructor(
    private paymentsWalletsService: PaymentsWalletsService,
    private toastService: ToastService,
    private kycPropertiesService: KYCPropertiesService,
    private errorActionService: WalletSharedErrorActionService,
    private changeDetectorRef: ChangeDetectorRef,
    private modalService: NgbModal,
    private walletTransferService: WalletTransferService
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
    return this.specifications.status === KYC_STATUS.NO_NEED || this.specifications.status === KYC_STATUS.VERIFIED;
  }

  private loadBalanceAndSpecifications(): void {
    this.changeDetectorRef.detectChanges();

    forkJoin({
      walletBalance: this.paymentsWalletsService.walletBalance$,
      specifications: this.kycPropertiesService.get().pipe(
        switchMap((properties: KYCProperties) => {
          return this.kycPropertiesService.getBannerSpecificationsFromProperties(properties);
        })
      ),
    })
      .pipe(
        finalize(() => {
          this.loading = false;
          this.changeDetectorRef.detectChanges();
        })
      )
      .subscribe({
        next: ({ walletBalance, specifications }) => {
          this.walletBalance = walletBalance;
          this.specifications = specifications;
        },
        error: (error) => {
          this.isError = true;
          this.toastService.show(DEFAULT_ERROR_TOAST);
          this.errorActionService.show(error);
        },
      });
  }

  private checkPayUserBankAccount(): void {
    this.walletTransferService.checkPayUserBankAccount().subscribe({
      next: () => {},
      error: (error: WalletTransferErrorModel) => {
        if (error instanceof WalletTransferDismissErrorModel) {
          return;
        }
        this.showTransferErrorMessage(error);
      },
    });
  }

  private showTransferErrorMessage(error: WalletTransferErrorModel): void {
    this.toastService.show({
      type: error instanceof WalletTransferPayUserBankAccountErrorModel ? TOAST_TYPES.SUCCESS : TOAST_TYPES.ERROR,
      text: error.message,
    });
    this.isTransferInProgress = true;
    this.changeDetectorRef.detectChanges();
  }
}
