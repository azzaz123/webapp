export class ChatConnectionMetric {
  public inboxConnectionSuccess: boolean;
  public xmppConnectionSuccess: boolean;
  public inboxRetryCount: number;
  public xmppRetryCount: number;
  public connectionChatTimeStart: number;

  constructor() {
    this.inboxConnectionSuccess = false;
    this.xmppConnectionSuccess = false;
    this.inboxRetryCount = 0;
    this.xmppRetryCount = 0;
    this.connectionChatTimeStart = Date.now();
  }

  public getConnectionTime(): number {
    if (!this.connectionChatTimeStart) {
      return 0;
    }

    return Date.now() - this.connectionChatTimeStart;
  }

  get isConnected(): boolean {
    return this.inboxConnectionSuccess && this.xmppConnectionSuccess;
  }
}
