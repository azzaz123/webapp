import { UserDevicePermissions } from '@shared/services/ask-permissions/user-device-permissions.interface';

export const MOCK_DEVICE_PERMISSIONS: UserDevicePermissions = {
  video: null,
  audio: null,
};

export const MOCK_MEDIA_STREAM = {
  getTracks: () => [],
};
