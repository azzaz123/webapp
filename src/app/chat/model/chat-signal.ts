import { MessageStatus } from './inbox-message';

export enum ChatSignalType {
  SENT = MessageStatus.SENT,
  RECEIVED = MessageStatus.RECEIVED,
  READ = MessageStatus.READ
}

export class ChatSignal {
  constructor(
    private _type: ChatSignalType,
    private _thread: string,
    private _timestamp: number,
    private _messageId?: string,
    private _fromSelf?: boolean) {
  }

  get type(): ChatSignalType {
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
