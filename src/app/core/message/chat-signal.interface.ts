import { MessageStatus } from '../../chat/model';

export const chatSignalType = {
  SENT: MessageStatus.SENT,
  RECEIVED: MessageStatus.RECEIVED,
  READ: MessageStatus.READ
};

export class ChatSignal {
  constructor(
    private _type: string,
    private _thread: string,
    private _timestamp: number,
    private _messageId?: string,
    private _fromSelf?: boolean) {
  }

  get type(): string {
    return this._type;
  }

  get thread(): string {
    return this._thread;
  }

  get timestamp(): number {
    return this._timestamp;
  }

  get messageId(): string {
    return this._messageId;
  }

  get fromSelf(): boolean {
    return this._fromSelf;
  }
}
