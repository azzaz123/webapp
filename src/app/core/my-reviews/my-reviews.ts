import { ReviewUser } from './review-user';
import { Review } from "./review";
import { ReviewItem } from "./review-item";

export class MyReviews {

  constructor(private _item?: ReviewItem,
              private _review?: Review,
              private _type?: string,
              private _user?: ReviewUser) {
  }

  get item(): ReviewItem {
    return this._item;
  }

  get review(): Review {
    return this._review;
  }

  get user(): ReviewUser {
    return this._user;
  }

  get type(): string {
    return this._type;
  }

  get isSold(): boolean {
    return this.type === 'sell';
  }

  get isBought(): boolean {
    return this.type === 'buy';
  }
}
