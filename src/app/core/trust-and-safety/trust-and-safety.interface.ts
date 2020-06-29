export interface StarterResponse {
  starter: boolean;
}

export enum SessionProfileDataLocation {
  'OpenChat',
  'OpenCreateListing'
}

export enum SessionProfileDataPlatform {
  'Android',
  'IOS',
  'Web'
}

export interface SessionProfileData {
  id: string;
  location: SessionProfileDataLocation;
  platform: SessionProfileDataPlatform;
}
