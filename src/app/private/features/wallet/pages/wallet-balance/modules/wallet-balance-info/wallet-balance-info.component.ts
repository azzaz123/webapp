import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { DEFAULT_ERROR_TOAST } from '@layout/toast/core/constants/default-toasts';
import { KYCBannerService } from '@private/features/wallet/services/kyc-banner/kyc-banner.service';
import { KYCBannerSpecifications, KYC_BANNER_STATUS } from '@private/features/wallet/interfaces/kyc/kyc-banner.interface';
import { Money } from '@api/core/model/money.interface';
import { PaymentsWalletsService } from '@api/payments/wallets/payments-wallets.service';
import { ToastService } from '@layout/toast/core/services/toast.service';

import { forkJoin } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { WalletTransferModalComponent } from '@private/features/wallet/modals/transfer/components/modal/wallet-transfer-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'tsl-wallet-balance-info',
  templateUrl: './wallet-balance-info.component.html',
  styleUrls: ['./wallet-balance-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalletBalanceInfoComponent implements OnInit {
  public isError = false;
  public loading = true;
  public walletBalance: Money;
  private specifications: KYCBannerSpecifications;

  constructor(
    private paymentsWalletsService: PaymentsWalletsService,
    private toastService: ToastService,
    private kycBannerService: KYCBannerService,
    private changeDetectorRef: ChangeDetectorRef,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    this.loadBalanceAndSpecifications();
  }

  public get allowTransfer(): boolean {
    return this.hasPositiveBalance && this.isValidStatus;
  }

  public transferBalance(): void {
    console.log('Begin transfer balance process by TC');
    this.modalService.open(WalletTransferModalComponent).result.then(() => {});
  }

  private get hasPositiveBalance(): boolean {
    return this.walletBalance?.amount.total > 0;
  }

  private get isValidStatus(): boolean {
    return !this.specifications || this.specifications.status === KYC_BANNER_STATUS.VERIFIED;
  }

  private loadBalanceAndSpecifications(): void {
    this.changeDetectorRef.detectChanges();

    forkJoin({
      walletBalance: this.paymentsWalletsService.walletBalance$,
      specifications: this.kycBannerService.getSpecifications(),
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
        error: () => {
          this.isError = true;
          this.toastService.show(DEFAULT_ERROR_TOAST);
        },
      });
  }
}
