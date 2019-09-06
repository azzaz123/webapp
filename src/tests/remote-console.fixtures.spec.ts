import { DeviceInfo } from 'ngx-device-detector';

export class MockRemoteConsoleService {
  sendConnectionTimeout(userId: string, timeout: number): void {
  }
}

export class DeviceDetectorServiceMock {
  getDeviceInfo(): DeviceInfo {
    return {
      browser: 'Chrome',
      browser_version: '76.0.3809.132'
    } as DeviceInfo;
  }
}
