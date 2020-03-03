import { Message } from './message';
import { MessagePayload } from './messages.interface';

export interface MetaInfo {
  first: string;
  last: string;
  end: boolean;
}

export interface MessagePayload {
  text: string;
  type: string;
}
