import { ConnectionType } from './connection-type';

export class ChatConnectionMetric {
  public inboxConnectionSuccess: boolean;
  public xmppConnectionSuccess: boolean;
  public inboxRetryCount: number;
  public xmppRetryCount: number;
  public connectionChatTimeStart: number;
  public alreadySent: boolean;
  public sendingToBackend: boolean;

  get canBeSent(): boolean {
    return this.inboxConnectionSuccess && this.xmppConnectionSuccess && !this.sendingToBackend && !this.alreadySent;
  }

  get shouldSendErrorMetric(): boolean {
    return !this.inboxConnectionSuccess && !this.xmppConnectionSuccess && this.inboxRetryCount !== 0 && this.xmppRetryCount !== 0;
  }

  constructor() {
    this.inboxConnectionSuccess = false;
    this.xmppConnectionSuccess = false;
    this.inboxRetryCount = 0;
    this.xmppRetryCount = 0;
    this.connectionChatTimeStart = Date.now();
    this.alreadySent = false;
    this.sendingToBackend = false;
  }

  public getConnectionTime(): number {
    let connectionTime = 0;

    if (!this.connectionChatTimeStart) {
      return connectionTime;
    }

    connectionTime = Date.now() - this.connectionChatTimeStart;
    return connectionTime < 0 ? 0 : connectionTime;
  }

  public update(connectionType: ConnectionType, success: boolean): void {
    if (connectionType === ConnectionType.INBOX) {
      this.inboxConnectionSuccess = success;
      this.inboxRetryCount += 1;
    }

    if (connectionType === ConnectionType.XMPP) {
      this.xmppConnectionSuccess = success;
      this.xmppRetryCount += 1;
    }
  }
}
