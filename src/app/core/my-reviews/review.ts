export class Review {

  constructor(private _comments?: string,
              private _date?: number,
              private _scoring?: number) {
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

}
