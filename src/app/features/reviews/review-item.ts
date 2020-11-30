import { Item } from '../../core/item/item';

export class ReviewItem extends Item {
  constructor(
    _id: string,
    _categoryId?: number,
    _title?: string,
    private _image?: ReviewImage,
    _web_link?: string
  ) {
    super(
      _id,
      null,
      null,
      _title,
      null,
      _categoryId,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      _web_link,
      null
    );
  }

  get image(): ReviewImage {
    return this._image;
  }
}

export interface ReviewImage {
  large: string;
  medium: string;
  original: string;
  original_height: number;
  original_width: number;
  small: string;
  xlarge: string;
  xsmall: string;
}
