import { DeviceType } from '@core/device/deviceType.enum';

export const MOCK_DEVICE_UUID = '1234';

export const MockDeviceService = {
  getDeviceType: () => DeviceType.DESKTOP,
  isMobile: () => false,
  isTablet: () => false,
  isDesktop: () => true,
  getDeviceId: () => MOCK_DEVICE_UUID,
  getDeviceLanguages: () => navigator.languages,
};
