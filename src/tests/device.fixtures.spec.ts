import { DeviceType } from '@core/device/deviceType.enum';

export const MockDeviceService = {
  getDeviceType: () => DeviceType.DESKTOP,
  isMobile: () => false,
  isTablet: () => false,
  isDesktop: () => true,
  getDeviceId: () => '1234',
  getDeviceLanguages: () => navigator.languages,
};
