import { MessagePayload } from '../message/messages.interface';

export interface XMPPClient {
  on(event: string, handler: Function): void;
  connect(options?: any): void;
  disconnect(): void;
  sendMessage(options?: XmppMessage): void;
  sendPresence(options?: any): void;
  getRoster(callback?: Function): void;
  enableCarbons(): void;
  use(plugin: Function): void;
  sendIq(options: any): Promise<any>;
  getTime(userId: string): Promise<any>;
  nextId(): string;
  enableKeepAlive(opts: any): void;
}

export interface XmppMessage {
  id?: string;
  to: string | any;
  thread: string;
  read?: any;
  status?: string;
  type?: string;
  received?: any;
  receipt?: string;
  request?: any;
  requestReceipt?: boolean;
  sentReceipt?: any;
  readReceipt?: any;
  delay?: any;
}
export interface XmppTimestampMessage {
  id: string;
  receipt: string;
  to: string;
  from: string | any;
  timestamp?: {
    body: string;
  };
}
export interface XmppBodyMessage extends XmppMessage {
  from: string | any;
  body: string;
  timestamp?: {
    body: string;
  };
  date?: number;
  carbonSent?: {
    forwarded: {
      message: XmppBodyMessage
    }
  };
  carbon?: boolean;
  payload?: MessagePayload;
}
