import { StripeCard } from '@core/payments/payment.interface';
import { Model } from '@core/resource/model.interface';

export class FinancialCard implements Model {
  constructor(
    private _expire_date: string,
    private _id: string,
    private _number: string,
    private _invoices_default?: boolean,
    private _favorite?: boolean,
    private _stripeCard?: StripeCard
  ) {}
  get id(): string {
    return this._id;
  }

  set id(value: string) {
    this._id = value;
  }

  get expire_date(): string {
    return this._expire_date;
  }

  set expire_date(value: string) {
    this._expire_date = value;
  }

  get number(): string {
    return this._number;
  }

  set number(value: string) {
    this._number = value;
  }

  get invoices_default(): boolean {
    return this._invoices_default;
  }

  set invoices_default(value: boolean) {
    this._invoices_default = value;
  }

  get favorite(): boolean {
    return this._favorite;
  }

  set favorite(value: boolean) {
    this._favorite = value;
  }

  get stripeCard(): StripeCard {
    return this._stripeCard;
  }

  set stripeCard(value: StripeCard) {
    this._stripeCard = value;
  }
}
