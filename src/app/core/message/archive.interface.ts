import { Message } from './message';
import { MetaInfo } from './messages.interface';

export interface MsgArchiveResponse {
  messages: Message[];
  receivedReceipts?: Array<ReceivedReceipt>;
  readReceipts?: Array<ReadReceipt>;
  meta?: MetaInfo;
  metaDate?: string;
}

export interface ReceivedReceipt {
  thread: string;
  messageId: string;
  from: string;
  to: string;
  fromSelf: boolean;
  timestamp: number;
}

export interface ReadReceipt {
  thread: string;
  to: string;
  timestamp: number;
}
