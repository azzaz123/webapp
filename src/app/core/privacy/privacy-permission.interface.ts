export const PRIVACY_PERMISSION_STATUS = {
  allow: 'allow',
  disallow: 'disallow',
  unknown: 'unknown'
};

export interface PrivacyPermission {
  version: string;
  allow: boolean;
}

export interface PrivacyPermissionRequestData {
  gdpr_display?: PrivacyPermission;
  privacy_policy?: PrivacyPermission;
}

export interface PrivacyPermissions {
  gdpr_display: PrivacyPermission[];
  privacy_policy: PrivacyPermission[];
}
