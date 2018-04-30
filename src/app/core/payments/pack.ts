import { Model } from '../resource/model.interface';

export class Pack implements Model {
  private _discount: number;

  constructor(private _id,
              private _quantity,
              private _price,
              private _currency) {}

  get id(): string {
    return this._id;
  }

  set id(value: string) {
    this._id = value;
  }

  get quantity(): number {
    return this._quantity;
  }

  set quantity(value: number) {
    this._quantity = value;
  }

  get price(): number {
    return this._price;
  }

  set price(value: number) {
    this._price = value;
  }

  get currency(): string {
    return this._currency;
  }

  set currency(value: string) {
    this._currency = value;
  }

  get discount(): number {
    return this._discount;
  }

  set discount(value: number) {
    this._discount = value;
  }

  public calculateDiscount(packPrice: string, quantity: number, basePrice: number): void {
    const price: number = basePrice * quantity;
    const save: number = price - +packPrice;

    this.discount = Math.floor(save * 100 / price);
  }
}
