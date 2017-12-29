import { ReviewImage } from "./review-item";

export class ReviewUser {

  constructor(private _id: string,
              private _image?: ReviewImage,
              private _micro_name?: string,
              private _web_slug?: string) {
  }

  get id(): string {
    return this._id;
  }

  get image(): ReviewImage {
    return this._image;
  }

  get micro_name(): string {
    return this._micro_name;
  }

  get web_slug(): string {
    return this._web_slug;
  }

}
