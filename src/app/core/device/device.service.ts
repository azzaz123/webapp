import { Injectable } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';

import { DeviceType } from '@core/device/deviceType.enum';
import { environment } from '@environments/environment';
import { CookieService } from 'ngx-cookie';
import { UuidService } from '@core/uuid/uuid.service';

@Injectable({ providedIn: 'root' })
export class DeviceService {
  private static DEVICE_ID_COOKIE_NAME = 'device_id';

  constructor(
    private deviceDetectorService: DeviceDetectorService,
    private cookieService: CookieService,
    private uuidService: UuidService
  ) {}

  public getDeviceType(): DeviceType {
    if (this.deviceDetectorService.isMobile()) {
      return DeviceType.MOBILE;
    }

    if (this.deviceDetectorService.isTablet()) {
      return DeviceType.TABLET;
    }

    return DeviceType.DESKTOP;
  }

  public isMobile(): boolean {
    return this.deviceDetectorService.isMobile();
  }

  public isTablet(): boolean {
    return this.deviceDetectorService.isTablet();
  }

  public isDesktop(): boolean {
    return this.deviceDetectorService.isDesktop();
  }

  public isTouchDevice(): boolean {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
  }

  public getDeviceId(): string {
    let deviceId = this.cookieService.get(DeviceService.DEVICE_ID_COOKIE_NAME);
    if (!deviceId) {
      deviceId = this.uuidService.getUUID();
      this.cookieService.put(DeviceService.DEVICE_ID_COOKIE_NAME, deviceId, {
        expires: new Date('2038-01-19'),
        // TODO: Generic cookie options could be abstracted and extended on each case
        domain: environment.name === 'local' ? 'localhost' : '.wallapop.com',
        path: '/',
      });
    }

    return deviceId;
  }

  public getDeviceLanguages(): readonly string[] {
    return navigator.languages;
  }

  public getOSName(): string {
    return this.deviceDetectorService.os;
  }
}
