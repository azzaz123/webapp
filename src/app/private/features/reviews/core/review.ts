import { User } from 'app/core/user/user';
import { ReviewItem } from './review-item';

export class Review {
  constructor(
    private _date: number,
    private _scoring: number,
    private _type: string,
    private _comments?: string,
    private _item?: ReviewItem,
    private _user?: User,
    private _id?: string,
    private _canTranslate?: boolean
  ) {}

  get id(): string {
    return this._id;
  }

  get canTranslate(): boolean {
    return this._canTranslate;
  }

  get item(): ReviewItem {
    return this._item;
  }

  get user(): User {
    return this._user;
  }

  get type(): string {
    return this._type;
  }

  get comments(): string {
    return this._comments;
  }

  get date(): number {
    return this._date;
  }

  get scoring(): number {
    return this._scoring;
  }

  get isSold(): boolean {
    return this.type === 'sell';
  }

  get isBought(): boolean {
    return this.type === 'buy';
  }
}
