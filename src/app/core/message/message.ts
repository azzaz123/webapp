import { Model } from '../resource/model.interface';
import { User } from '../user/user';
import { MessagePayload } from './messages.interface';

export const messageStatus = {
  PENDING: 0,
  SENT: 1,
  RECEIVED: 2,
  READ: 3
};

export class Message implements Model {

  private _user: User;
  private _fromSelf: boolean;

  constructor(private _id: string,
              private _conversationId: string,
              private _message: string,
              private _from: string,
              private _date?: Date,
              private _status?: number,
              private _payload?: MessagePayload) {
  }

  get id(): string {
    return this._id;
  }

  get message(): string {
    return this._message;
  }

  get conversationId(): string {
    return this._conversationId;
  }

  get date(): Date {
    return this._date;
  }

  set date(value: Date) {
    this._date = value;
  }

  get status(): number {
    return this._status;
  }

  set status(value: number) {
    this._status = value;
  }

  get from(): string {
    return this._from;
  }

  get user(): User {
    return this._user;
  }

  set user(value: User) {
    this._user = value;
  }

  get fromSelf(): boolean {
    return this._fromSelf;
  }

  set fromSelf(value: boolean) {
    this._fromSelf = value;
  }

  get payload(): MessagePayload {
    return this._payload;
  }
}
