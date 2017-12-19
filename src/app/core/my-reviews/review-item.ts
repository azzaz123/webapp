import { CategoryResponse } from "../category/category-response.interface";
export class ReviewItem {

  constructor(private _id: string,
              private _category?: CategoryResponse,
              private _title?: string,
              private _image?: ReviewImage,
              private _webLink?: string) {
  }

  get id(): string {
    return this._id;
  }

  get category(): CategoryResponse {
    return this._category;
  }

  get title(): string {
    return this._title;
  }

  get image(): ReviewImage {
    return this._image;
  }

  get webLink(): string {
    return this._webLink;
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
