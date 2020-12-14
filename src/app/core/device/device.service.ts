import { Injectable } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';

import { DeviceType } from '@core/device/deviceType.enum';

@Injectable()
export class DeviceService {
  constructor(private deviceDetectorService: DeviceDetectorService) {}

  public getDeviceType(): DeviceType {
    if (this.deviceDetectorService.isMobile()) {
      return DeviceType.MOBILE;
    }

    if (this.deviceDetectorService.isTablet()) {
      return DeviceType.TABLET;
    }

    return DeviceType.DESKTOP;
  }
}
