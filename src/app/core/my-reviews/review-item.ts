import { CategoryResponse } from "../category/category-response.interface";

export class ReviewItem {

  constructor(private _id: string,
              private _category?: CategoryResponse,
              private _category_id?: number,
              private _title?: string,
              private _image?: ReviewImage,
              private _web_link?: string) {
  }

  get id(): string {
    return this._id;
  }

  get category(): CategoryResponse {
    return this._category;
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

  get web_link(): string {
    return this._web_link;
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
