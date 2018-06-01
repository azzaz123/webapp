import {PrivacyList, PrivacyRequestData} from './privacy.interface';

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

export const MOCK_PRIVACY_UPDATE_ALLOW: PrivacyRequestData = {
  gdpr_display: {
      version: '0',
      allow: true
    },
  privacy_policy: {
    version: '0',
    allow: true
  }
};


export const MOCK_PRIVACY_UPDATE_DISALLOW: PrivacyRequestData = {
  gdpr_display: {
    version: '0',
    allow: false
  },
  privacy_policy: {
    version: '0',
    allow: false
  }
};

