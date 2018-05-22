import { Message } from './message';
import { MessagePayload } from './messages.interface';
import * as PouchDB from 'pouchdb';
import DocumentId = PouchDB.Core.DocumentId;
import DocumentKey = PouchDB.Core.DocumentKey;
import RevisionId = PouchDB.Core.RevisionId;

export interface MetaInfo {
  first: string;
  last: string;
  end: boolean;
}

export interface MessagesData {
  data: Message[];
  meta: MetaInfo;
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
  status: number;
  from: string;
  conversationId: string;
  payload?: MessagePayload;
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
