export interface UserDevicePermissions {
  video?: DEVICE_PERMISSIONS_STATUS;
  audio?: DEVICE_PERMISSIONS_STATUS;
}

export enum DEVICE_PERMISSIONS_STATUS {
  ACCEPTED,
  DENIED,
  CANNOT_ACCESS,
}
