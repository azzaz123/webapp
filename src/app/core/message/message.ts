import { Model } from '../resource/model.interface';
import { User } from '../user/user';
import { MessagePayload } from '../../chat/model';

export const messageStatus = {
  PENDING: 'pending',
  SENT: 'sent',
  RECEIVED: 'received',
  READ: 'read'
};

export const phoneRequestState = {
  pending: 'pending',
  answered: 'answered'
};

export const phoneMethod = {
  chatMessage: 'bubble',
  popUp: 'qa'
};

export const statusOrder = [messageStatus.PENDING, messageStatus.SENT, messageStatus.RECEIVED, messageStatus.READ];

export class Message implements Model {

  private _user: User;
  private _fromSelf: boolean;

  constructor(private _id: string,
              private _thread: string,
              private _message: string,
              private _from: string,
              private _date?: Date,
              private _status?: string,
              private _payload?: MessagePayload,
              private _phoneRequest?: string) {
  }

  get id(): string {
    return this._id;
  }

  get message(): string {
    return this._message;
  }

  get thread(): string {
    return this._thread;
  }

  get date(): Date {
    return this._date;
  }

  set date(value: Date) {
    this._date = value;
  }

  get status(): string {
    return this._status;
  }

  set status(value: string) {
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

  set phoneRequest(value: string) {
    this._phoneRequest = value;
  }

  get phoneRequest(): string {
    return this._phoneRequest;
  }
}
