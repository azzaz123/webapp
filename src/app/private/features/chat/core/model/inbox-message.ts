import { InboxMessageApi } from './api';

export enum MessageType {
  /* Projections and realtime */
  TEXT = 'text',
  REVIEW = 'review',
  SHIPPING_KEYWORDS = 'shipping_keywords_in_message_detected',
  /** Projections */
  PRICE_DROP = 'price_drop',
  DELIVERY_GENERIC = 'delivery_generic',
  TRANSACTION_CLAIM_PERIOD = 'delivery_transaction_claim_period_started',
  /** Real Time Service */
  DROP_PRICE = 'drop_price',
  DELIVERY = 'delivery',
  TRANSACTION_CLAIM_PERIOD_RT = 'deliveryTransactionClaimPeriodStarted',
}

export enum MessageStatus {
  PENDING = 'pending',
  SENT = 'sent',
  RECEIVED = 'received',
  READ = 'read',
}

export const MESSAGES_WHITE_LIST = [
  MessageType.TEXT,
  MessageType.REVIEW,
  MessageType.DROP_PRICE,
  MessageType.PRICE_DROP,
  MessageType.DELIVERY,
  MessageType.DELIVERY_GENERIC,
  MessageType.SHIPPING_KEYWORDS,
  MessageType.TRANSACTION_CLAIM_PERIOD,
  MessageType.TRANSACTION_CLAIM_PERIOD_RT,
];

export const statusOrder = [MessageStatus.PENDING, MessageStatus.SENT, MessageStatus.RECEIVED, MessageStatus.READ];

export enum PhoneRequestState {
  PENDING = 'pending',
  ANSWERED = 'answered',
}

export enum PhoneMethod {
  CHAT_MESSAGE = 'bubble',
  POP_UP = 'qa',
}

export class InboxMessage {
  private _translation: string;
  constructor(
    private _id: string,
    private _thread: string,
    private _text: string,
    private _from: string,
    private _fromSelf: boolean,
    private _date: Date,
    private _status: MessageStatus,
    private _type: MessageType,
    private _payload?: MessagePayload
  ) {}

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

  get status(): MessageStatus {
    return this._status;
  }

  set status(value: MessageStatus) {
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

  get translation(): string {
    return this._translation;
  }

  set translation(value: string) {
    this._translation = value;
  }

  public static messsagesFromJson(
    messagesApiModel: InboxMessageApi[],
    conversationId: string,
    currentUserId: string,
    otherUserId: string
  ): InboxMessage[] {
    return messagesApiModel
      .map((message: InboxMessageApi) => this.buildMessage(message, conversationId, currentUserId, otherUserId))
      .filter((message: InboxMessage) => MESSAGES_WHITE_LIST.includes(message.type));
  }

  private static buildMessage(message: InboxMessageApi, conversationId: string, currentUserId: string, otherUserId: string) {
    return new InboxMessage(
      message.id,
      conversationId,
      message.text,
      message.from_self ? currentUserId : otherUserId,
      message.from_self,
      new Date(message.timestamp),
      message.status,
      message.type,
      message.payload
    );
  }
}

export class MessagePayload {
  text: string;
  type: string;
}
