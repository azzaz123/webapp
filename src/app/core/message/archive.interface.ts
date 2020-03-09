import { Message } from './message';

export interface MsgArchiveResponse {
  messages: Message[];
  receivedReceipts?: Array<ReceivedReceipt>;
  readReceipts?: Array<ReadReceipt>;
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

export interface ArchiveMetrics {
  downloadingTime: number;
  processingTime: number;
  eventsCount: number;
  pageSize: number;
  startDownloadTs?: number;
  endDownloadTs?: number;
  startProcessTs?: number;
  endProcessTs?: number;
}
