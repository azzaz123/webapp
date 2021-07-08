import { Item, ITEM_TYPES } from './item';
import { ItemFlags } from './item-response.interface';
import { Image } from '../user/user-response.interface';
import { CATEGORY_IDS } from '@core/category/category-ids';

export class Realestate extends Item {
  constructor(
    id: string,
    sellerId?: string,
    title?: string,
    storytelling?: string,
    location?: any,
    salePrice?: number,
    currencyCode?: string,
    modifiedDate?: number,
    url?: string,
    flags?: ItemFlags,
    images?: Image[],
    webSlug?: string,
    private _operation?: string,
    private _type?: string,
    private _condition?: string,
    private _surface?: number,
    private _bathrooms?: number,
    private _rooms?: number,
    private _garage?: boolean,
    private _terrace?: boolean,
    private _elevator?: boolean,
    private _pool?: boolean,
    private _garden?: boolean,
    image?: any,
    publishedDate?: number
  ) {
    super(
      id,
      0,
      sellerId,
      title,
      storytelling,
      CATEGORY_IDS.REAL_ESTATE,
      location,
      salePrice,
      currencyCode,
      modifiedDate,
      url,
      flags,
      null,
      null,
      image
        ? {
            id: '1',
            original_width: image ? image.original_width : null,
            original_height: image ? image.original_height : null,
            average_hex_color: '',
            urls_by_size: image,
          }
        : images
        ? images[0]
        : null,
      images,
      webSlug,
      publishedDate,
      null,
      ITEM_TYPES.REAL_ESTATE
    );
  }

  get operation(): string {
    return this._operation;
  }

  get type(): string {
    return this._type;
  }

  get condition(): string {
    return this._condition;
  }

  get surface(): number {
    return this._surface;
  }

  get bathrooms(): number {
    return this._bathrooms;
  }

  get rooms(): number {
    return this._rooms;
  }

  get garage(): boolean {
    return this._garage;
  }

  get terrace(): boolean {
    return this._terrace;
  }

  get elevator(): boolean {
    return this._elevator;
  }

  get pool(): boolean {
    return this._pool;
  }

  get garden(): boolean {
    return this._garden;
  }
}
