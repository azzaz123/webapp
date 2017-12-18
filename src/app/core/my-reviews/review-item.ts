export class ReviewItem {

  constructor(private _id: string,
              private _category_id?: number,
              private _title?: string,
              private _image?: ReviewImage) {
  }

  get id(): string {
    return this._id;
  }

  get category_id(): number {
    return this._category_id;
  }

  get title(): string {
    return this._title;
  }

  get image(): ReviewImage {
    return this._image;
  }

}

interface ReviewImage {
  id: string;
  large: string;
  medium: string;
  original: string;
  original_height: number;
  original_width: number;
  small: string;
  xlarge: string;
  xsmall: string;
}
