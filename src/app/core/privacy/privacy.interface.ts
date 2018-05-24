export class PrivacyRequestData {
  gdpr_display?: PrivacyVersionItem;
  privacy_policy?: PrivacyVersionItem;
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
