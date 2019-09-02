import { Injectable } from '@angular/core';

import logger from 'loglevel';
import remote from 'loglevel-plugin-remote';
import { environment } from '../../../environments/environment';
import { DeviceDetectorService } from 'ngx-device-detector';

@Injectable({
  providedIn: 'root'
})
export class RemoteConsoleService {

  constructor(private deviceService: DeviceDetectorService) {
    const options = {
      url: environment.remoteConsoleUrl,
      method: 'POST',
      timestamp: () => new Date().getTime(),
      format: this.plain,
    };

    remote.apply(logger, options);
  }

  sendConnectionTimeout(userId: string, timeout: number): void {
    const device = this.deviceService.getDeviceInfo();
    logger.info(JSON.stringify({
      browser: device.browser,
      browser_version: device.browser_version,
      user_id: userId,
      timeout: timeout,
      message: 'xmpp connection timeout',
      connectionType: navigator['connection']['type'],
      effectiveType: navigator['connection']['effectiveType'],
      rtt: `${navigator['connection']['rtt']}ms`,
      downlink: `${navigator['connection']['downlink']}Mb/s`,
    }));
  }

  private plain(log) {
    const message = JSON.parse(log.message);
    return { timestamp: log.timestamp, client: 'web', ...message };
  }
}
