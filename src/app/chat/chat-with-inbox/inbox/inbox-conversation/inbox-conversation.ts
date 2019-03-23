import { InboxMessage } from '../../message/inbox-message';
import { InboxUser } from '../inbox-user';
import { InboxItem } from '../inbox-item';

export class InboxConversation {

    constructor(private _id: string,
        private _modifiedDate: Date,
        private _user: InboxUser,
        private _item: InboxItem,
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

    set messages(messages: InboxMessage[]) {
        this._messages = messages;
    }

    get messages(): InboxMessage[] {
        return this._messages;
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
