import { MessagePayload, MessageStatus } from '@private/features/chat/core/model';

import { StanzaIO } from './xmpp.provider';

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
  to: JID;
  thread: string;
  read?: any;
  status?: MessageStatus;
  type?: string;
  received?: any;
  receipt?: string;
  request?: any;
  requestReceipt?: boolean;
  sentReceipt?: any;
  readReceipt?: any;
  delay?: any;
}

export interface XmppBodyMessage extends XmppMessage {
  from: JID;
  body: string;
  timestamp?: {
    body: string;
  };
  date?: number;
  carbonSent?: {
    forwarded: {
      message: XmppBodyMessage;
    };
  };
  carbon?: boolean;
  payload?: MessagePayload;
}

export interface XmppError {
  name: string;
  message: string;
  stack?: string;
}

export class JID {
  constructor(private _userId: string, private _domain: string, private _resource: string) {
    return new StanzaIO.JID(this._userId, this._domain, this._resource);
  }

  get bare(): string {
    return this.bare;
  }

  get local(): string {
    return this.local;
  }
}
