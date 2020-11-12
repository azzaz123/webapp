import { Model } from '../resource/model.interface';

export const PACKS_TYPES = {
  BUMP: 'cityBump',
  NATIONAL_BUMP: 'countryBump',
  LISTINGS: 'listings',
  WALLACOINS: 'wallacoins',
  WALLACREDITS: 'wallacredits',
};

export const COINS_PACK_ID = 'b4f402c8-1468-49e9-84df-fcd7de7d8000';
export const CREDITS_PACK_ID = 'e0e3f72a-c57a-49a8-8e10-6e8063feabba';

export const COINS_FACTOR = 100;
export const CREDITS_FACTOR = 1;

export class Pack implements Model {
  private _discount: number;
  private _forFree: number;
  private _factor: number;

  constructor(
    private _id: string,
    private _quantity: number,
    private _price: number,
    private _currency: string,
    private _name: string
  ) {}
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

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  get forFree(): number {
    return this._forFree;
  }

  set forFree(value: number) {
    this._forFree = value;
  }

  get factor(): number {
    return this._factor;
  }

  public calculateDiscount(
    packPrice: string,
    quantity: number,
    basePrice: number
  ): void {
    const price: number = basePrice * quantity;
    const save: number = price - +packPrice;

    this.discount = Math.floor((save * 100) / price);
  }

  public calculateDiscountWithOriginalPrice(
    price: number,
    originalPrice: number
  ): void {
    const save: number = originalPrice - price;
    this._factor = this.name === 'wallacoins' ? COINS_FACTOR : CREDITS_FACTOR;

    this.discount = Math.floor((save * 100) / price);
    this.forFree = save * this._factor;
  }
}
