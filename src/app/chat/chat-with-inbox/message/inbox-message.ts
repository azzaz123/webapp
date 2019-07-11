export enum MessageType {
  TEXT = 'text',
  /** Projections */
  PRICE_DROP = 'price_drop',
  /** Real Time Service */
  DROP_PRICE = 'drop_price',
  REVIEW = 'review',
}

export const messageStatus = {
    PENDING: 'pending',
    SENT: 'sent',
    RECEIVED: 'received',
    READ: 'read'
};

export const statusOrder = [messageStatus.PENDING, messageStatus.SENT, messageStatus.RECEIVED, messageStatus.READ];

export const phoneRequestState = {
    pending: 'pending',
    answered: 'answered'
};

export const phoneMethod = {
    chatMessage: 'bubble',
    popUp: 'qa'
};

export class InboxMessage {
    constructor(private _id: string,
        private _thread: string,
        private _text: string,
        private _from: string,
        private _fromSelf: boolean,
        private _date: Date,
        private _status: string,
        private _type: MessageType,
        private _payload?: MessagePayload,
        private _phoneRequest?: string) { }

    get id(): string {
        return this._id;
    }

    get text(): string {
        return this._text;
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

    get type(): MessageType {
      return this._type;
    }

    set type(value: MessageType) {
      this._type = value;
    }

    set from(value: string) {
        this._from = value;
    }

    get from(): string {
        return this._from;
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

    public static messsagesFromJson(json: any, conversationId: string, currentUserId: string, otherUserId: string): InboxMessage[] {
        return json.map(message => this.buildMessage(message, conversationId, currentUserId, otherUserId));
    }

    private static buildMessage(message: any, conversationId: string, currentUserId: string, otherUserId: string) {
        return new InboxMessage(message.id, conversationId, message.text,
          message.from_self ? currentUserId : otherUserId, message.from_self, new Date(message.timestamp),
          message.status, message.type, message.payload);
    }
}

export interface MessagePayload {
    text: string;
    type: string;
}

