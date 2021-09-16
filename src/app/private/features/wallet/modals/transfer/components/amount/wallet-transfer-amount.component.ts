import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';

import { Money } from '@api/core/model/money.interface';
import { PaymentsWalletsHttpService } from '@api/payments/wallets/http/payments-wallets-http.service';
import { PaymentsWalletsService } from '@api/payments/wallets/payments-wallets.service';
import { DEFAULT_ERROR_TOAST } from '@layout/toast/core/constants/default-toasts';
import { ToastService } from '@layout/toast/core/services/toast.service';

import { finalize } from 'rxjs/operators';

@Component({
  selector: 'tsl-wallet-transfer-amount',
  templateUrl: './wallet-transfer-amount.component.html',
  styleUrls: ['./wallet-transfer-amount.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [PaymentsWalletsHttpService, PaymentsWalletsService],
})
export class WalletTransferAmountComponent implements OnInit {
  private error: boolean;
  private loading: boolean = true;
  private walletBalance: Money;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private paymentsWalletsService: PaymentsWalletsService,
    private toastService: ToastService
  ) {}

  public ngOnInit(): void {
    this.loadBalance();
  }

  public get amountAsText(): string {
    return `${this.walletBalance.amount.toString()} ${this.walletBalance.currency.symbol}`;
  }

  public get showBalance(): boolean {
    return !this.showError && !!this.walletBalance;
  }

  public get showError(): boolean {
    return !this.showSpinner && this.error;
  }
  public get showSpinner(): boolean {
    return this.loading;
  }

  private loadBalance(): void {
    this.changeDetectorRef.detectChanges();

    this.paymentsWalletsService.walletBalance$
      .pipe(
        finalize(() => {
          this.loading = false;
          this.changeDetectorRef.detectChanges();
          console.log('Finish the call to backend');
        })
      )
      .subscribe({
        next: (walletBalance) => {
          this.walletBalance = walletBalance;
        },
        error: () => {
          this.error = true;
          this.toastService.show(DEFAULT_ERROR_TOAST);
        },
      });
  }
}
