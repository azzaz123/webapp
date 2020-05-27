export class ChatConnectionMetric {
  public inboxConnectionSuccess = false;
  public inboxRetryCount = 0;
  public xmppConnectionSuccess = false;
  public xmppRetryCount = 0;
  public connectionChatTimeStart = Date.now();
}
