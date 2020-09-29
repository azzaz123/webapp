import { DeviceInfo } from 'ngx-device-detector';
import { ConnectionType } from 'app/core/remote-console/connection-type';

export class MockRemoteConsoleService {
  sendConnectionTimeout(userId: string, timeout: number): void {
  }

  sendDuplicateConversations(userId: string, conversationsGroupById: Map<string, number>): void {
  }

  sendMessageTimeout(userId: string, messageId: string): void {
  }

  sendMessageActTimeout(messageId: string): void {
  }

  sendPresentationMessageTimeout(messageId: string): void {
  }

  sendXmppConnectionClosedWithError(message: string): void {
  }

  sendChatConnectionTime(connectionType: ConnectionType, success: boolean): void {
  }

  sendMessageAckFailed(messageId: string, description: string): void {
  }

  sendConnectionChatFailed(connectionType: ConnectionType): void {
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
    return false;
  }
}
