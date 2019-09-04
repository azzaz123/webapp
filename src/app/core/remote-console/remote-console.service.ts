import { Injectable } from '@angular/core';

import logger from 'loglevel';
import { DeviceDetectorService } from 'ngx-device-detector';

@Injectable({
  providedIn: 'root'
})
export class RemoteConsoleService {

  constructor(private deviceService: DeviceDetectorService) {
  }

  sendConnectionTimeout(userId: string, connectionTime: number): void {
    const device = this.deviceService.getDeviceInfo();
    logger.info(JSON.stringify({
      browser: device.browser,
      browser_version: device.browser_version,
      user_id: userId,
      connection_time: connectionTime,
      message: 'xmpp connection time',
      connection_type: navigator['connection']['type'],
      ping_time_ms: navigator['connection']['rtt']
    }));
  }
}
