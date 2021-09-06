export enum SessionProfileDataLocation {
  OPEN_CHAT = 'OpenChat',
  OPEN_CREATE_LISTING = 'OpenCreateListing',
}

export enum SessionProfileDataPlatform {
  ANDROID = 'Android',
  IOS = 'IOS',
  WEB = 'Web',
}

export enum TMXStatusCode {
  TMX_INTERNAL_ERROR = 'TMX_Internal_Error',
}

export interface SessionProfileData {
  id: string;
  location: SessionProfileDataLocation;
  platform: SessionProfileDataPlatform;
  status?: TMXStatusCode;
}
