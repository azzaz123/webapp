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
