import { Model } from 'shield';

export class Review implements Model {

  private _selected: boolean = false;

  constructor(private _id: string,
              private _title?: string,
              private _description?: string,
              private _category?: string,
              private _image?: string,
              private _saleDate?: string,
              private _transactionUser?: string) {
  }

  get id(): string {
    return this._id;
  }

  get title(): string {
    return this._title;
  }

  get description(): string {
    return this._description;
  }

  get category(): string {
    return this._category;
  }

  get image(): string {
    return this._image;
  }

  get saleDate(): string {
    return this._saleDate;
  }

  get transactionUser(): string {
    return this._transactionUser;
  }

  get selected(): boolean {
    return this._selected;
  }

  set selected(value: boolean) {
    this._selected = value;
  }

}
