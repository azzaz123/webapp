import { DeviceInfo } from 'ngx-device-detector';

export class MockRemoteConsoleService {
  sendConnectionTimeout(userId: string, timeout: number): void {
  }

  sendDuplicateConversations(userId: string, conversationsGroupById: Map<string, number>): void {
  }

  sendMessageTimeout(userId: string, messageId: string): void {
  }

  sendAcceptTimeout(messageId: string): void {
  }

  sendPresentationMessageTimeout(messageId: string): void {
  }

  sendXmppConnectionClosedWithError(message: string): void {
  }
}

export const BROWSER = 'CHROME';
export const BROWSER_VERSION = '76.0.3809.132';

export class DeviceDetectorServiceMock {
  getDeviceInfo(): DeviceInfo {
    return {
      browser: BROWSER,
      browser_version: BROWSER_VERSION
    } as DeviceInfo;
  }
  isMobile(): boolean {
    return false
  }
}
