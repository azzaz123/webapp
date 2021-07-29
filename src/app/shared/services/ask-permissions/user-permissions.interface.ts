export interface UserPermissions {
  video?: PERMISSIONS_STATUS;
  audio?: PERMISSIONS_STATUS;
}

export enum PERMISSIONS_STATUS {
  ACCEPTED,
  DENIED,
  CANNOT_ACCESS,
}
