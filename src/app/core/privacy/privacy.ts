export const PRIVACY_STATUS = {
  allow: 'allow',
  disallow: 'disallow',
  unknown: 'unknown'
};

export class PrivacyRequestData {
  constructor(privacyName, version, allow) {
    this[privacyName] = {
      version,
      allow
    };
  }
}

export interface PrivacyVersionItem {
  version: string;
  allow: boolean;
  modified_date?: string;
}

export interface PrivacyList {
  gdpr_display: PrivacyVersionItem[];
  privacy_policy: PrivacyVersionItem[];
}

export interface PrivacyStatus {
  allow?: string;
  disallow?: string;
  unknown?: string;
}
