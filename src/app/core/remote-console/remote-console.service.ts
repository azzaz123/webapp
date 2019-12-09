import { Injectable, OnDestroy } from '@angular/core';

import { DeviceDetectorService } from 'ngx-device-detector';
import { MetricTypeEnum } from './metric-type.enum';
import * as Fingerprint2 from 'fingerprintjs2';
import * as logger from 'loglevel';
import { toUpper } from 'lodash-es';
import { Observable } from 'rxjs';
import { FeatureflagService, FEATURE_FLAGS_ENUM } from '../user/featureflag.service';
import { APP_VERSION } from '../../../environments/version';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root'
})
export class RemoteConsoleService implements OnDestroy {

  deviceId: string;
  private connectionTimeCallNo = 0;
  private sendMessageTime = [];
  private acceptMessageTime = new Map();
  private presentationMessageTimeout = new Map();

  constructor(private deviceService: DeviceDetectorService, private featureflagService: FeatureflagService,
              private userService: UserService) {
    this.deviceId = Fingerprint2.get({}, components => {
      const values = components.map(component => component.value);
      this.deviceId = Fingerprint2.x64hash128(values.join(''), 31);
    });
  }

  ngOnDestroy(): void {
    this.sendMessageTime = [];
    this.acceptMessageTime = new Map();
    this.presentationMessageTimeout = new Map();
  }

  sendConnectionTimeout(userId: string, connectionTime: number): void {
    this.connectionTimeCallNo += 1;
    this.getCommonLog(userId).subscribe(commonLog => logger.info(JSON.stringify({
      ...commonLog,
      metric_type: MetricTypeEnum.XMPP_CONNECTION_TIME,
      message: 'xmpp connection time',
      connection_time: connectionTime,
      call_no: this.connectionTimeCallNo,
      connection_type: toUpper(navigator['connection']['type']),
      ping_time_ms: navigator['connection']['rtt']
    })));
  }

  sendMessageTimeout(messageId: string): void {
    if (messageId === null) {
      this.sendMessageTime.push(new Date().getTime());
    } else {
      if (this.sendMessageTime.length > 0) {

        this.getCommonLog(this.userService.user.id).subscribe(commonLog => logger.info(JSON.stringify({
          ...commonLog,
          message_id: messageId,
          send_message_time: new Date().getTime() - this.sendMessageTime.shift(),
          metric_type: MetricTypeEnum.CLIENT_SEND_MESSAGE_TIME,
        })));
      }
    }
  }

  sendAcceptTimeout(messageId: string): void {
    if (!this.acceptMessageTime.has(messageId)) {
      this.acceptMessageTime.set(messageId, new Date().getTime());
    } else {
      this.getCommonLog(this.userService.user.id).subscribe(commonLog => logger.info(JSON.stringify({
        ...commonLog,
        message_id: messageId,
        send_message_time: new Date().getTime() - this.acceptMessageTime.get(messageId),
        metric_type: MetricTypeEnum.XMPP_ACCEPT_MESSAGE_TIME,
        ping_time_ms: navigator['connection']['rtt']
      })));
      this.acceptMessageTime.delete(messageId);
    }
  }

  sendPresentationMessageTimeout(messageId: string): void {
    if (!this.presentationMessageTimeout.has(messageId)) {
      this.presentationMessageTimeout.set(messageId, new Date().getTime());
    } else {
      this.getCommonLog(this.userService.user.id).subscribe(commonLog => logger.info(JSON.stringify({
        ...commonLog,
        message_id: messageId,
        send_message_time: new Date().getTime() - this.presentationMessageTimeout.get(messageId),
        metric_type: MetricTypeEnum.CLIENT_PRESENTATION_MESSAGE_TIME,
        ping_time_ms: navigator['connection']['rtt']
      })));
      this.presentationMessageTimeout.delete(messageId);
    }
  }

  sendDuplicateConversations(userId: string, callMethodClient: string, conversationsGroupById: Map<string, number>): void {
    this.getCommonLog(userId).subscribe(commonLog => logger.info(JSON.stringify({
      ...commonLog,
      metric_type: MetricTypeEnum.DUPLICATE_CONVERSATION,
      message: 'send log when user see duplicate conversation in inbox',
      call_method_client: callMethodClient,
      conversations_count_by_id: JSON.stringify(conversationsGroupById)
    })));
  }

  private getCommonLog(userId: string): Observable<{}> {
    return this.featureflagService.getFlag(FEATURE_FLAGS_ENUM.INBOX_PROJECTIONS)
    .map((featureFlag: boolean) => {
      const device = this.deviceService.getDeviceInfo();
      return {
        device_id: this.deviceId,
        browser: device.browser.toUpperCase(),
        browser_version: device.browser_version,
        user_id: userId,
        feature_flag: featureFlag,
        app_version: APP_VERSION
      };
    });
  }
}
