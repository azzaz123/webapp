import { Message } from './message';
import { MessagePayload } from './messages.interface';
import * as PouchDB from 'pouchdb';
import DocumentId = PouchDB.Core.DocumentId;
import DocumentKey = PouchDB.Core.DocumentKey;
import RevisionId = PouchDB.Core.RevisionId;

export const chatSignalType = {
  SENT: 'sent',
  RECEIVED: 'received',
  READ: 'read'
};

export interface MetaInfo {
  first: string;
  last: string;
  end: boolean;
}

export interface MessagesData {
  data: Message[];
}

export interface MessagesDataRecursive extends MessagesData {
  messages: Message[];
}

export interface StoredMetaInfo {
  start: string;
  last: string;
}

export interface StoredMetaInfoData {
  data: StoredMetaInfo;
}

export interface StoredMessage {
  _id: string;
  date: Date;
  message: string;
  status: string;
  from: string;
  conversationId: string;
  payload?: MessagePayload;
  phoneRequest?: string;
}

export interface StoredMessageRow {
  doc?: StoredMessage;
  id: DocumentId;
  key: DocumentKey;
  value: {
    rev: RevisionId;
  };
}

export interface StoredConversation {
  unreadMessages: number;
}

export interface MessagePayload {
  text: string;
  type: string;
}

export class ChatSignal {
  constructor(
    private _type: string,
    private _thread: string,
    private _timestamp: number,
    private _messageId?: string) {
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
}
