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

export const MOCK_PRIVACY_ALLOW: PrivacyList = {
  gdpr_display: [
    {
      version: '0',
      allow: true,
      modified_date: '1524819320'
    }
  ],
  privacy_policy: [
    {
      version: '0',
      allow: true,
      modified_date: '1524819320'
    }
  ]
};

export const MOCK_PRIVACY_DISALLOW: PrivacyList = {
  gdpr_display: [
    {
      version: '0',
      allow: false,
      modified_date: '1524819320'
    }
  ],
  privacy_policy: [
    {
      version: '0',
      allow: false,
      modified_date: '1524819320'
    }
  ]
};

export const MOCK_PRIVACY_UNKNOW: PrivacyList = {
  gdpr_display: [
    {
      version: '0',
      allow: false
    }
  ],
  privacy_policy: [
    {
      version: '0',
      allow: false
    }
  ]
};

