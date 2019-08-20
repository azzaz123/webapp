import { Item, ITEM_TYPES } from './item';
import { ItemFlags, ItemSaleConditions } from './item-response.interface';
import { Image } from '../user/user-response.interface';

export class Car extends Item {

  constructor(id: string,
              sellerId?: string,
              title?: string,
              storytelling?: string,
              salePrice?: number,
              currencyCode?: string,
              modifiedDate?: number,
              url?: string,
              flags?: ItemFlags,
              saleConditions?: ItemSaleConditions,
              images?: Image[],
              webSlug?: string,
              private _brand?: string,
              private _model?: string,
              private _year?: number,
              private _km?: number,
              private _gearbox?: string,
              private _engine?: string,
              private _color?: string,
              private _horsepower?: number,
              private _bodyType?: string,
              private _numDoors?: number,
              private _extras?: any[],
              private _warranty?: boolean,
              private _numSeats?: number,
              private _condition?: string,
              private _version?: string,
              private _financedPrice?: number,
              publishedDate?: number,
              image?: any) {
    super(
      id,
      0,
      sellerId,
      title,
      storytelling,
      100,
      null,
      salePrice,
      currencyCode,
      modifiedDate,
      url,
      flags,
      null,
      saleConditions,
      image ? {
        id: '1',
        original_width: image ? image.original_width : null,
        original_height: image ? image.original_height : null,
        average_hex_color: '',
        urls_by_size: image
      } : (images ? images[0] : null),
      images,
      webSlug,
      publishedDate,
      null,
      ITEM_TYPES.CARS
    );
  }

  get brand(): string {
    return this._brand;
  }

  get model(): string {
    return this._model;
  }

  get year(): number {
    return this._year;
  }

  get km(): number {
    return this._km;
  }

  get gearbox(): string {
    return this._gearbox;
  }

  get engine(): string {
    return this._engine;
  }

  get color(): string {
    return this._color;
  }

  get horsepower(): number {
    return this._horsepower;
  }

  get bodyType(): string {
    return this._bodyType;
  }

  get numDoors(): number {
    return this._numDoors;
  }

  get extras(): any[] {
    return this._extras;
  }

  get warranty(): boolean {
    return this._warranty;
  }

  get numSeats(): number {
    return this._numSeats;
  }

  get condition(): string {
    return this._condition;
  }

  get version(): string {
    return this._version;
  }

  get financedPrice(): number {
    return this._financedPrice;
  }
}

