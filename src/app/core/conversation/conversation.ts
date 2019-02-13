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
              private _modifiedDate: number,
              private _user?: InboxUser,
              private _item?: InboxItem,
              private _lastMessage?: any,
              private _messages: Array<Message> = [],
              private _unreadCounter: number = 0,
              private _archived: boolean = false,
              private _phone?: string) {
  }

  get id(): string {
    return this._id;
  }

  set modifiedDate(value: number) {
    this._modifiedDate = value;
  }

  get modifiedDate(): number {
    return this._modifiedDate;
  }

  get archived(): boolean {
    return this._archived;
  }

  set archived(value: boolean) {
    this._archived = value;
  }

  get user(): InboxUser {
    return this._user;
  }

  get item(): InboxItem {
    return this._item;
  }

  set lastMessage(lastMessage: any) {
    this._lastMessage = lastMessage;
  }

  get lastMessage(): any {
    return this._lastMessage;
  }

  set messages(value: Array<Message>) {
    this._messages = value;
  }

  get messages(): Array<Message> {
    return this._messages;
  }

  set unreadCounter(value: number) {
    this._unreadCounter = value;
  }

  get unreadCounter(): number {
    return this._unreadCounter;
  }

  set phone(value: string) {
    this._phone = value;
  }

  get phone(): string {
    return this._phone;
  }
}
