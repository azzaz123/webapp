import { Currency } from '@api/core/model/currency.interface';
import { Money } from '@api/core/model/money.interface';
import { NumericAmount } from '@api/core/model/numeric-amount.interface';

const defaultAmountOfDecimals: number = 2;

export class WalletTransferMoneyModel implements Money {
  public amount: NumericAmount;
  public currency: Currency;

  private amountOfDecimals: number;

  constructor(amount: number, currency: Currency, amountOfDecimals: number = defaultAmountOfDecimals) {
    this.amount = this.getAmount(amount, amountOfDecimals);
    this.currency = currency;
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
