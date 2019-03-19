import { User, InboxUser } from '../user/user';
import { Item, InboxItem } from '../item/item';
import { Message } from '../message/message';
import { Lead } from './lead';
import { SurveyResponse } from './lead-response.interface';

export class Conversation extends Lead {

  constructor(id: string,
              legacyId: number,
              modifiedDate: number,
              private _expectedVisit: boolean = false,
              user?: User,
              item?: Item,
              messages: Array<Message> = [],
              phone?: string,
              surveyResponses: SurveyResponse[] = []) {
    super(id, legacyId, modifiedDate, user, item, messages, phone, surveyResponses);
  }

  get expectedVisit(): boolean {
    return this._expectedVisit;
  }
}

export class InboxConversation {

  constructor(private _id: string,
              private _modifiedDate: Date,
              private _user: InboxUser,
              private _item: InboxItem,
              private _phoneShared: boolean,
              private _unreadCounter: number = 0,
              private _lastMessage?: Message) {
  }

  get id(): string {
    return this._id;
  }

  set modifiedDate(value: Date) {
    this._modifiedDate = value;
  }

  get modifiedDate(): Date {
    return this._modifiedDate;
  }

  get user(): InboxUser {
    return this._user;
  }

  get item(): InboxItem {
    return this._item;
  }

  set lastMessage(lastMessage: Message) {
    this._lastMessage = lastMessage;
  }

  get lastMessage(): Message {
    return this._lastMessage;
  }

  set unreadCounter(value: number) {
    this._unreadCounter = value;
  }

  get unreadCounter(): number {
    return this._unreadCounter;
  }

  set phoneShared(value: boolean) {
    this._phoneShared = value;
  }

  get phoneShared(): boolean {
    return this._phoneShared;
  }
}
