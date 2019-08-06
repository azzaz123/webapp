import { InboxMessage } from '../../message/inbox-message';
import { InboxUser, InboxUserPlaceholder } from '../inbox-user';
import { InboxItem, InboxImage, InboxItemPlaceholder, INBOX_ITEM_STATUSES } from '../inbox-item';
import { environment } from '../../../../../environments/environment';

export class InboxConversation {

    constructor(private _id: string,
        private _modifiedDate: Date,
        private _user: InboxUser,
        private _item: InboxItem,
        private _nextPageToken: string,
        private _messages: InboxMessage[],
        private _phoneShared: boolean,
        private _phone_number: string = '',
        private _unreadCounter: number = 0,
        private _lastMessage?: InboxMessage) {
    }

    public active = false;

    get cannotChat(): boolean {
        return  this.user.blocked
                || !this.user.available
                || this.item.status === INBOX_ITEM_STATUSES.notAvailable;
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

    set phoneNumber(value: string) {
      this._phone_number = value;
    }

    get phoneNumber(): string {
      return this._phone_number;
    }

    set phoneShared(value: boolean) {
        this._phoneShared = value;
    }

    get phoneShared(): boolean {
        return this._phoneShared;
    }

    static errorConversationFromMessage(message: InboxMessage) {
        const user = InboxUserPlaceholder;
        const item = InboxItemPlaceholder;
        const messages = [message];
        const lastMessage = message;
        const dateModified = lastMessage.date;
        const hash = message.thread;
        return new InboxConversation(hash, dateModified, user, item, null, messages, false, null, messages.length, lastMessage);
    }

    static fromJSON(json: any, withSelfId: string): InboxConversation {
        const user = this.buildInboxUser(json.with_user);
        const item = this.buildInboxItem(json.item);
        const messages = this.buildInboxMessages(json, withSelfId);
        const nextPageToken = json.messages.next_from || null;
        const lastMessage = messages[0];
        const dateModified = lastMessage ? lastMessage.date : null;
        return new InboxConversation(json.hash, dateModified, user, item, nextPageToken, messages, json.phone_shared,
            json.unread_messages, json.phone_number, lastMessage);
    }

    private static buildInboxUser(user: any): InboxUser {
        if (!user) {
            return InboxUserPlaceholder;
        }
        const userBlocked = Boolean(user.available && user.blocked);
        const profileUrl = `${environment.siteUrl}user/${user.slug}`;
        return new InboxUser(user.hash, user.name, userBlocked, user.available, profileUrl, user.image_url, user.response_rate,
            user.score, user.location);
    }

    private static buildInboxItem(item: any): InboxItem {
        const image: InboxImage = {
            urls_by_size: {
                small: item && item.image_url ? item.image_url : null
            }
        };
        if (!item) {
            return InboxItemPlaceholder;
        }
        const itemUrl = `${environment.siteUrl}item/${item.slug}`;
        return new InboxItem(item.hash, item.price, item.title, image, itemUrl, item.status, item.is_mine);
    }

    private static buildInboxMessages(conversation, id) {
        // TODO - handle third voice type message (type === '? TBD');
        const textMessages = InboxMessage.messsagesFromJson(conversation.messages.messages,
            conversation.hash, id, conversation.with_user ? conversation.with_user.id : null);
        return textMessages;
    }
}

export class StoredInboxConversation {
    constructor(private _id: string,
      private modifiedDate: Date,
      private user: InboxUser,
      private item: InboxItem,
      private phoneShared: boolean,
      private phoneNumber: string,
      private unreadCounter: number = 0,
      private nextPageToken: string,
      private lastMessage?: InboxMessage) {}
  }
