import { HELP_LOCALE } from '@core/external-links/customer-help/customer-help-constants';

const defaultAmountOfDecimals: number = 2;
const defaultMinimumAmount: number = 0;
const defaultTotalAmount: number = 0;

export class WalletTransferAmountModel {
  private _total: number;
  private amountOfDecimals: number;
  private beginnigByZero: boolean;
  private maximum: number;
  private minimum: number;
  private showDecimalsAsCents = true;

  constructor(total: number, minimum: number = defaultMinimumAmount, amountOfDecimals: number = defaultAmountOfDecimals) {
    this._total = this.isNullOrUndefined(total) ? defaultTotalAmount : total;
    this.amountOfDecimals = amountOfDecimals ?? defaultAmountOfDecimals;
    this.maximum = this._total;
    this.minimum = minimum ?? defaultMinimumAmount;
  }

  public get decimals(): string {
    if (this.isNullOrUndefined(this._total)) {
      return null;
    }
    return this.showDecimalsAsCents
      ? this.decimalsAsCents
      : this.total.toLocaleString(HELP_LOCALE.en, { maximumFractionDigits: this.amountOfDecimals, minimumFractionDigits: 1 }).split('.')[1];
  }

  public set decimals(value: string) {
    this.showDecimalsAsCents = false;
    this.setTotal(this.integer, this.beginnigByZero ? `0${value}` : value);
    this.beginnigByZero = parseInt(value, 10) === 0;
  }

  public get decimalsAsCents(): string {
    return this.total.toFixed(this.amountOfDecimals).split('.')[1];
  }

  public empty(): void {
    this._total = null;
  }

  public get integer(): string {
    if (this.isNullOrUndefined(this._total)) {
      return null;
    }
    return Math.trunc(this._total).toString();
  }

  public set integer(value: string) {
    this.showDecimalsAsCents = true;
    this.setTotal(value, this.decimals);
  }

  public get integerAsUnits(): string {
    return this.total.toFixed(this.amountOfDecimals).split('.')[0];
  }

  public get isEmpty(): boolean {
    return this._total === null;
  }

  public get isValid(): boolean {
    return this.total >= this.minimum && this.total <= this.maximum;
  }

  public setMaximum(maximum: number): void {
    this.maximum = maximum;
  }

  public get total(): number {
    return this.isNullOrUndefined(this._total) ? 0 : this._total;
  }

  public toString(): string {
    return this.total.toLocaleString(undefined, {
      maximumFractionDigits: this.amountOfDecimals,
      minimumFractionDigits: this.amountOfDecimals,
    });
  }

  private isNullOrUndefined(value: string | number): boolean {
    return value === null || value === undefined;
  }

  private setTotal(integerPart: string, decimalPart: string): void {
    if (isNaN(parseInt(integerPart)) && isNaN(parseInt(decimalPart))) {
      this._total = null;
    }

    this._total = parseFloat(
      `${!isNaN(parseInt(integerPart, 10)) ? integerPart : 0}.${!isNaN(parseInt(decimalPart, 10)) ? decimalPart : 0}`
    );
  }
}
