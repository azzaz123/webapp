import { Component, OnInit } from '@angular/core';
import { Money } from '@api/core/model/money.interface';
import { PaymentsWalletsService } from '@api/payments/wallets/payments-wallets.service';

@Component({
  selector: 'tsl-wallet-balance',
  templateUrl: './wallet-balance.component.html',
  styleUrls: ['./wallet-balance.component.scss'],
})
export class WalletBalanceComponent implements OnInit {
  public loading = true;
  public walletBalance: Money;
  public hasPositiveBalance = false;
  public isError = false;

  constructor(private paymentsWalletsService: PaymentsWalletsService) {}

  ngOnInit() {
    this.paymentsWalletsService.walletBalance$.subscribe({
      next: (walletBalance) => {
        this.walletBalance = walletBalance;
        this.hasPositiveBalance = this.isNumberPositive(walletBalance.amount.total);
      },
      error: () => {
        this.isError = true;
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  private isNumberPositive(number: number): boolean {
    return number > 0;
  }
}
