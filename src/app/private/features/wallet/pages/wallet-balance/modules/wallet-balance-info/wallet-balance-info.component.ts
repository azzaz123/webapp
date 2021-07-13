import { Component, OnInit } from '@angular/core';
import { Money } from '@api/core/model/money.interface';
import { PaymentsWalletsService } from '@api/payments/wallets/payments-wallets.service';
import { DEFAULT_ERROR_TOAST } from '@layout/toast/core/constants/default-toasts';
import { ToastService } from '@layout/toast/core/services/toast.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'tsl-wallet-balance-info',
  templateUrl: './wallet-balance-info.component.html',
  styleUrls: ['./wallet-balance-info.component.scss'],
})
export class WalletBalanceInfoComponent implements OnInit {
  public loading = true;
  public walletBalance: Money;
  public hasPositiveBalance = false;
  public isError = false;

  constructor(private paymentsWalletsService: PaymentsWalletsService, private toastService: ToastService) {}

  ngOnInit() {
    this.paymentsWalletsService.walletBalance$.pipe(finalize(() => (this.loading = false))).subscribe({
      next: (walletBalance) => {
        this.walletBalance = walletBalance;
        this.hasPositiveBalance = this.isNumberPositive(walletBalance.amount.total);
      },
      error: () => {
        this.isError = true;
        this.toastService.show(DEFAULT_ERROR_TOAST);
      },
    });
  }

  private isNumberPositive(number: number): boolean {
    return number > 0;
  }
}
