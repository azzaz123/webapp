import { Currency } from '@api/core/model/currency.interface';
import { Money } from '@api/core/model/money.interface';
import { NumericAmount } from '@api/core/model/numeric-amount.interface';
import { WalletTransferMoneyInterface } from '@private/features/wallet/modals/transfer/interfaces/wallet-transfer-money.interface';

const defaultAmountOfDecimals: number = 2;

export class WalletTransferMoneyModel implements WalletTransferMoneyInterface {
  public amount: NumericAmount;
  public balance: Money;
  public currency: Currency;

  private amountOfDecimals: number;

  constructor(amount: number, balance: Money, amountOfDecimals: number = defaultAmountOfDecimals) {
    this.amount = this.getAmount(amount, amountOfDecimals);
    this.balance = balance;
    this.currency = balance.currency;
    this.amountOfDecimals = amountOfDecimals ?? defaultAmountOfDecimals;
  }

  public toString(): string {
    return `${this.amount.total.toLocaleString(undefined, {
      minimumFractionDigits: this.amountOfDecimals,
      maximumFractionDigits: this.amountOfDecimals,
    })} ${this.currency.symbol}`;
  }

  private getAmount(amount: number, amountOfDecimals: number): NumericAmount {
    return {
      integer: Math.trunc(amount),
      decimals: parseInt(amount.toFixed(amountOfDecimals).split('.')[1], 10),
      total: amount,
    } as NumericAmount;
  }
}
