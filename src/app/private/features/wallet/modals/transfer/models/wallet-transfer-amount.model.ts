import { HELP_LOCALE } from '@core/external-links/customer-help/customer-help-constants';

export class WalletTransferAmountModel {
  private _total: number;
  private amountOfDecimals: number;
  private maximum: number;
  private minimum: number;
  private showDecimalsAsCents = true;

  constructor(total: number, minimum: number = 0, amountOfDecimals: number = 2) {
    this._total = this.isNullOrUndefined(total) ? 0 : total;
    this.amountOfDecimals = amountOfDecimals;
    this.maximum = this._total;
    this.minimum = minimum;
  }

  public get decimals(): string {
    if (this.isNullOrUndefined(this._total)) {
      return null;
    }
    return this.showDecimalsAsCents
      ? this.decimalsAsCents
      : this.total.toLocaleString(HELP_LOCALE.en, { maximumFractionDigits: this.amountOfDecimals, minimumFractionDigits: 0 }).split('.')[1];
  }

  public set decimals(value: string) {
    this.showDecimalsAsCents = false;
    this.setTotal(this.integer, value);
  }

  public get decimalsAsCents(): string {
    return this.total.toFixed(this.amountOfDecimals).split('.')[1];
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

  public get isValid(): boolean {
    return this.total >= this.minimum && this.total <= this.maximum;
  }

  public empty(): void {
    this._total = null;
  }

  public get total(): number {
    return this.isNullOrUndefined(this._total) ? 0 : this._total;
  }

  public toString(): string {
    return this.total.toLocaleString(HELP_LOCALE.en, {
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
