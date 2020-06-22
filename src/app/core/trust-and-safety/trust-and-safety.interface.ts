export interface StarterResponse {
  starter: boolean;
}

export interface GenerateSessionIdResponse {
  id: string;
}

export type SessionProfileDataLocation = 'OpenChat' | 'OpenCreateListing';
export type SessionProfileDataPlatform = 'Android' | 'IOS' | 'Web';

export interface SessionProfileData {
  id: string;
  location: SessionProfileDataLocation;
  platform: SessionProfileDataPlatform;
}
