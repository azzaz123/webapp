import { Message } from './message';
import { MetaInfo } from './messages.interface';

export interface MsgArchiveData {
  messages: Message[];
  meta: MetaInfo;
}

export interface MsgArchiveResponse {
  messages: Message[];
  receivedReceipts: Array<any>;
  readReceipts: Array<any>;
}
