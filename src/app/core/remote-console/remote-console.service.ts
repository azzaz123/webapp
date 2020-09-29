import { Injectable, OnDestroy } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { toUpper } from 'lodash-es';
import { UUID } from 'angular2-uuid';

import { MetricTypeEnum } from './metric-type.enum';
import { APP_VERSION } from '../../../environments/version';
import { UserService } from '../user/user.service';
import { RemoteConsoleClientService } from './remote-console-client.service';
import { User } from '../user/user';
import { ChatConnectionMetric } from './chat-connection-metric';
import { finalize } from 'rxjs/operators';
import { ConnectionType } from './connection-type';
import { CookieService } from 'ngx-cookie';
import { DEVICE_ID_COOKIE_NAME } from '../analytics/analytics.service';

@Injectable({
  providedIn: 'root'
})
export class RemoteConsoleService implements OnDestroy {

  private deviceId: string;
  private sessionId: string;
  private connectionTimeCallNo = 0;
  private sendMessageTime = new Map();
  private sendMessageActTime = new Map();
  private presentationMessageTimeout = new Map();
  private chatConnectionMetric: ChatConnectionMetric;

  constructor(
    private remoteConsoleClientService: RemoteConsoleClientService,
    private deviceService: DeviceDetectorService,
    private userService: UserService,
    cookiesService: CookieService) {
      this.deviceId = cookiesService.get(DEVICE_ID_COOKIE_NAME).replace('-', '');
      this.sessionId = UUID.UUID();
  }

  ngOnDestroy(): void {
    this.sendMessageTime = new Map();
    this.presentationMessageTimeout = new Map();
    this.removeChatConnectionMetric();
  }

  public sendConnectionTimeout(userId: string, connectionTime: number): void {
    this.connectionTimeCallNo += 1;
    this.remoteConsoleClientService.info({
      ...this.getCommonLog(userId),
      metric_type: MetricTypeEnum.XMPP_CONNECTION_TIME,
      message: 'xmpp connection time',
      connection_time: connectionTime,
      call_no: this.connectionTimeCallNo,
    });
  }

  public sendChatConnectionTime(connectionType: ConnectionType, success: boolean): void {
    if (!this.chatConnectionMetric) {
      this.chatConnectionMetric = new ChatConnectionMetric();
    }

    if (connectionType === ConnectionType.INBOX) {
      this.chatConnectionMetric.inboxConnectionSuccess = success;
      this.chatConnectionMetric.inboxRetryCount += 1;
    }

    if (connectionType === ConnectionType.XMPP) {
      this.chatConnectionMetric.xmppConnectionSuccess = success;
      this.chatConnectionMetric.xmppRetryCount += 1;
    }

    if (this.chatConnectionMetric.isConnected) {
      this.userService.me()
        .pipe(finalize(() => this.removeChatConnectionMetric()))
        .subscribe((user: User) => this.remoteConsoleClientService.info({
          ...this.getCommonLog(user.id),
          connection_time: this.chatConnectionMetric.getConnectionTime(),
          xmpp_retry_count: this.chatConnectionMetric.xmppRetryCount,
          inbox_retry_count: this.chatConnectionMetric.inboxRetryCount,
          metric_type: MetricTypeEnum.CHAT_CONNECTION_TIME,
        }));
    }
  }

  public sendMessageTimeout(messageId: string): void {
    if (!this.sendMessageTime.has(messageId)) {
      this.sendMessageTime.set(messageId, new Date().getTime());
    } else {
      this.remoteConsoleClientService.info({
        ...this.getCommonLog(this.userService.user.id),
        message_id: messageId,
        send_message_time: new Date().getTime() - this.sendMessageTime.get(messageId),
        metric_type: MetricTypeEnum.CLIENT_SEND_MESSAGE_TIME,
      });
      this.sendMessageTime.delete(messageId);
    }
  }

  public sendMessageAckFailed(messageId: string, description: string): void {
    this.remoteConsoleClientService.info({
      ...this.getCommonLog(this.userService.user.id),
      message_id: messageId,
      metric_type: MetricTypeEnum.MESSAGE_SENT_ACK_FAILED,
      description: description
    });
  }

  public sendConnectionChatFailed(connectionType: ConnectionType): void {
    this.remoteConsoleClientService.info({
      ...this.getCommonLog(this.userService.user.id),
      metric_type: MetricTypeEnum.CHAT_FAILED_CONNECTION,
      xmpp_connected: connectionType === ConnectionType.XMPP,
      description: connectionType === ConnectionType.INBOX ? 'Get inbox is failed' : 'Connection xmpp is failed'
    });
  }

  public sendMessageActTimeout(messageId: string): void {
    if (!this.sendMessageActTime.has(messageId)) {
      this.sendMessageActTime.set(messageId, new Date().getTime());
    } else {
      this.remoteConsoleClientService.info({
        ...this.getCommonLog(this.userService.user.id),
        message_id: messageId,
        send_message_time: new Date().getTime() - this.sendMessageActTime.get(messageId),
        metric_type: MetricTypeEnum.MESSAGE_SENT_ACK_TIME,
      });
      this.sendMessageTime.delete(messageId);
    }
  }

  public sendPresentationMessageTimeout(messageId: string): void {
    if (!this.presentationMessageTimeout.has(messageId)) {
      this.presentationMessageTimeout.set(messageId, new Date().getTime());
    } else {
      this.remoteConsoleClientService.info({
        ...this.getCommonLog(this.userService.user.id),
        message_id: messageId,
        send_message_time: new Date().getTime() - this.presentationMessageTimeout.get(messageId),
        metric_type: MetricTypeEnum.CLIENT_PRESENTATION_MESSAGE_TIME,
      });
      this.presentationMessageTimeout.delete(messageId);
    }
  }

  public sendDuplicateConversations(userId: string, callMethodClient: string, conversationsGroupById: Map<string, number>): void {
    this.remoteConsoleClientService.info({
      ...this.getCommonLog(userId),
      metric_type: MetricTypeEnum.DUPLICATE_CONVERSATION,
      message: 'send log when user see duplicate conversation in inbox',
      call_method_client: callMethodClient,
      conversations_count_by_id: JSON.stringify(conversationsGroupById)
    });
  }

  public sendXmppConnectionClosedWithError(): void {
    this.userService.me().subscribe((user: User) => this.remoteConsoleClientService.info({
        ...this.getCommonLog(user.id),
        metric_type: MetricTypeEnum.XMPP_CONNECTION_CLOSED_WITH_ERROR,
        message: '',
      })
    );
  }

  public getReleaseVersion(appVersion: string): number {
    return +appVersion.split('.')
      .map((subVersion: string) => ('00' + subVersion).slice(-3))
      .reduce((a: string, b: string) => a + b);
  }

  private getCommonLog(userId: string): {} {
    const device = this.deviceService.getDeviceInfo();
    return {
      timestamp: Date.now(),
      client: 'WEB',
      device_id: this.deviceId,
      browser: device.browser.toUpperCase(),
      browser_version: device.browser_version,
      user_id: userId,
      feature_flag: true,
      app_version: this.getReleaseVersion(APP_VERSION),
      session_id: this.sessionId,
      connection_type: navigator['connection'] ? toUpper(navigator['connection']['type']) : '',
      ping_time_ms: navigator['connection'] ? navigator['connection']['rtt'] : -1
    };
  }

  private removeChatConnectionMetric() {
    this.chatConnectionMetric = null;
    delete this.chatConnectionMetric;
  }
}
