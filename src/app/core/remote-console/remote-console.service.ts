import { Injectable } from '@angular/core';

import { DeviceDetectorService } from 'ngx-device-detector';
import { MetricTypeEnum } from './metric-type.enum';
import * as Fingerprint2 from 'fingerprintjs2';
import * as logger from 'loglevel';
import * as _ from 'lodash';
import { FeatureflagService } from '../user/featureflag.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RemoteConsoleService {

  deviceId: string;

  constructor(private deviceService: DeviceDetectorService, private featureflagService: FeatureflagService) {
    this.deviceId = Fingerprint2.get({}, components => {
      const values = components.map(component => component.value);
      this.deviceId = Fingerprint2.x64hash128(values.join(''), 31);
    });
  }

  sendConnectionTimeout(userId: string, connectionTime: number): void {
    this.getCommonLog(userId).subscribe(commonLog => logger.info(JSON.stringify({
      ...commonLog, ...{
        metric_type: MetricTypeEnum.XMPP_CONNECTION_TIME,
        message: 'xmpp connection time',
        connection_time: connectionTime,
        connection_type: _.toUpper(navigator['connection']['type']),
        ping_time_ms: navigator['connection']['rtt']
      }
    })));

  }

  sendDuplicateConversations(userId: string, conversationsGroupById: Map<string, number>): void {
    this.getCommonLog(userId).subscribe(commonLog => logger.info(JSON.stringify({
      ...commonLog, ...{
        metric_type: MetricTypeEnum.DUPLICATE_CONVERSATION,
        message: 'send log when user see duplicate conversation in inbox',
        conversations_group_by_id: JSON.stringify(conversationsGroupById)
      }
    })));
  }

  private getCommonLog(userId: string): Observable<{}> {
    return this.featureflagService.getWebInboxProjections()
    .map(fetureFlag => {
      const device = this.deviceService.getDeviceInfo();
      return {
        device_id: this.deviceId,
        browser: _.toUpper(device.browser),
        browser_version: device.browser_version,
        user_id: userId,
        feature_flag: fetureFlag,
      };
    });
  }
}
