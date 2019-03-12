import { Message } from './message';
import { MessagePayload } from './messages.interface';
import PouchDB from 'pouchdb';
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
   // TODO - replace conversationId with thread when with DB version update to standardizes pop. names
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
