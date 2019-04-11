import { InboxMessage } from '../../message/inbox-message';
import { InboxUser } from '../inbox-user';
import { InboxItem } from '../inbox-item';

export class InboxConversation {

    constructor(private _id: string,
        private _modifiedDate: Date,
        private _user: InboxUser,
        private _item: InboxItem,
        private _nextPageToken: string,
        private _messages: InboxMessage[],
        private _phoneShared: boolean,
        private _unreadCounter: number = 0,
        private _lastMessage?: InboxMessage) {
    }

    public active = false;
    public cannotChat = false;

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

    set lastMessage(lastMessage: InboxMessage) {
        this._lastMessage = lastMessage;
    }

    get lastMessage(): InboxMessage {
        return this._lastMessage;
    }

    set nextPageToken(nextPageToken: string) {
        this._nextPageToken = nextPageToken;
    }

    get nextPageToken(): string {
        return this._nextPageToken;
    }

    set messages(messages: InboxMessage[]) {
        this._messages = messages;
    }

    get messages(): InboxMessage[] {
        return this._messages;
    }

    set unreadCounter(value: number) {
        this._unreadCounter = Math.max(value, 0);
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

export class StoredInboxConversation {
    constructor(private _id: string,
      private modifiedDate: Date,
      private user: InboxUser,
      private item: InboxItem,
      private phoneShared: boolean,
      private unreadCounter: number = 0,
      private nextPageToken: string,
      private lastMessage?: InboxMessage) {}
  }
