import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';

import { DEFAULT_ERROR_TOAST } from '@layout/toast/core/constants/default-toasts';
import { Money } from '@api/core/model/money.interface';
import { PaymentsWalletsHttpService } from '@api/payments/wallets/http/payments-wallets-http.service';
import { PaymentsWalletsService } from '@api/payments/wallets/payments-wallets.service';
import { ToastService } from '@layout/toast/core/services/toast.service';
import { WalletTransferAmountModel } from '@private/features/wallet/modals/transfer/models/wallet-transfer-amount.model';
import { WalletTransferMoneyModel } from '@private/features/wallet/modals/transfer/models/wallet-transfer-money.model';

import { finalize } from 'rxjs/operators';

const amountOfDecimals: number = 2;
const decimalPartId: string = 'decimalPart';
const integerPartId: string = 'integerPart';
const minimumTransferAmount: number = 0.5;
const transferId: string = 'transfer';

@Component({
  selector: 'tsl-wallet-transfer-amount',
  templateUrl: './wallet-transfer-amount.component.html',
  styleUrls: ['./wallet-transfer-amount.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [PaymentsWalletsHttpService, PaymentsWalletsService],
})
export class WalletTransferAmountComponent implements OnInit {
  @ViewChild(decimalPartId, { static: false }) decimalElementRef: ElementRef;
  @ViewChild(integerPartId, { static: false }) integerElementRef: ElementRef;
  @ViewChild(transferId, { static: false }) transferElementRef: ElementRef;

  @Output()
  public transfered: EventEmitter<Money> = new EventEmitter<Money>();

  public transferAmount: WalletTransferAmountModel;

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

  public get allowTransfer(): boolean {
    return this.transferAmount.isValid;
  }

  public amountAsText(amount: number): string {
    return `${new WalletTransferAmountModel(amount, minimumTransferAmount, amountOfDecimals).toString()} ${
      this.walletBalance.currency.symbol
    }`;
  }

  public get decimalPartMaxLength(): number {
    return amountOfDecimals;
  }

  public emptyAmount(): void {
    this.transferAmount.empty();
    (this.integerElementRef.nativeElement as HTMLInputElement).focus();
  }

  public formatDecimalPart(): void {
    (this.decimalElementRef.nativeElement as HTMLInputElement).value = this.transferAmount.decimalsAsCents;
  }

  public formatIntegerPart(): void {
    (this.integerElementRef.nativeElement as HTMLInputElement).value = this.transferAmount.integerAsUnits;
  }

  public get integerPartMaxLength(): number {
    return this.walletBalance.amount.integer.toString().length;
  }

  public get maximumAsText(): string {
    return this.amountAsText(this.walletBalance.amount.total);
  }

  public get minimumAsText(): string {
    return this.amountAsText(minimumTransferAmount);
  }

  public get showBalance(): boolean {
    return !this.showError && !!this.walletBalance;
  }

  public get showError(): boolean {
    return !this.showSpinner && this.error;
  }

  public get showWarnColor(): boolean {
    return !this.transferAmount.isValid && !this.transferAmount.isEmpty;
  }

  public get showSpinner(): boolean {
    return this.loading;
  }

  public transferBalance(): void {
    this.transfered.emit(new WalletTransferMoneyModel(this.transferAmount.total, this.walletBalance.currency, amountOfDecimals));
  }

  private loadBalance(): void {
    this.changeDetectorRef.detectChanges();

    this.paymentsWalletsService.walletBalance$
      .pipe(
        finalize(() => {
          this.loading = false;
          this.changeDetectorRef.detectChanges();
        })
      )
      .subscribe({
        next: (walletBalance) => {
          this.walletBalance = walletBalance;
          this.transferAmount = new WalletTransferAmountModel(this.walletBalance.amount.total, minimumTransferAmount, amountOfDecimals);
        },
        error: () => {
          this.error = true;
          this.toastService.show(DEFAULT_ERROR_TOAST);
        },
      });
  }
}
