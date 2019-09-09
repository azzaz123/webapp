import { Injectable } from '@angular/core';

import { DeviceDetectorService } from 'ngx-device-detector';
import { MetricTypeEnum } from './metric-type.enum';
import * as logger from 'loglevel';
import * as _ from 'lodash';
import { FeatureflagService } from '../user/featureflag.service';

@Injectable({
  providedIn: 'root'
})
export class RemoteConsoleService {

  constructor(private deviceService: DeviceDetectorService, private featureflagService: FeatureflagService) {
  }

  sendConnectionTimeout(userId: string, connectionTime: number): void {
    const device = this.deviceService.getDeviceInfo();
    logger.info(JSON.stringify({
      ...this.getCommonLog(userId), ...{
        metric_type: MetricTypeEnum.XMPP_CONNECTION_TIME,
        message: 'xmpp connection time',
        connection_time: connectionTime,
        connection_type: _.toUpper(navigator['connection']['type']),
        ping_time_ms: navigator['connection']['rtt']
      }
    }));
  }

  sendDuplicateConversations(userId: string, conversationsGroupById: Map<string, number>): void {
    const device = this.deviceService.getDeviceInfo();
    logger.info(JSON.stringify({
      ...this.getCommonLog(userId), ...{
        metric_type: MetricTypeEnum.DUPLICATE_CONVERSATION,
        message: 'send log when user see duplicate conversation in inbox',
        conversations_group_by_id: conversationsGroupById
      }
    }));
  }

  private getCommonLog(userId: string): {} {
    this.featureflagService.getWebInboxProjections();
    const device = this.deviceService.getDeviceInfo();
    return {
      browser: _.toUpper(device.browser),
      browser_version: device.browser_version,
      user_id: userId,
      feature_flag: true,
    };
  }
}
