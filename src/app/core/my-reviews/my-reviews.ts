import { User } from 'shield';
import { Review } from "./review";
import { ReviewItem } from "./review-item";

export class MyReviews {

  private _selected: boolean = false;

  constructor(private _item: ReviewItem,
              private _review?: Review,
              private _type?: string,
              private _user?: User) {
  }

  get item(): ReviewItem {
    return this._item;
  }

  get review(): Review {
    return this._review;
  }

  get user(): User {
    return this._user;
  }

  get type(): string {
    return this._type;
  }

  get selected(): boolean {
    return this._selected;
  }

  set selected(value: boolean) {
    this._selected = value;
  }

}
