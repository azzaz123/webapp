import { Injectable } from '@angular/core';

import { DeviceDetectorService } from 'ngx-device-detector';
import { MetricTypeEnum } from './metric-type.enum';
import logger from 'loglevel';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class RemoteConsoleService {

  constructor(private deviceService: DeviceDetectorService) {
  }

  sendConnectionTimeout(userId: string, connectionTime: number): void {
    const device = this.deviceService.getDeviceInfo();
    logger.info(JSON.stringify({
      browser: _.toUpper(device.browser),
      browser_version: device.browser_version,
      user_id: userId,
      connection_time: connectionTime,
      metric_type: MetricTypeEnum.XMPP_CONNECTION_TIME,
      message: 'xmpp connection time',
      connection_type: _.toUpper(navigator['connection']['type']),
      ping_time_ms: navigator['connection']['rtt']
    }));
  }
}
